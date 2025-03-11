import { useState, useRef, useEffect } from "react";
import css from "../../css/Excepciones.module.css";
import { Card, Button, Select, Typography, Modal } from "antd";
import GastoBasico from "../Gastos/GastoBasico";
import GastoPrestamo from "../Gastos/GastoPrestamo";
import GastoDebito from "../Gastos/GastoDebito";
import GastoCredito from "../Gastos/GastoCredito";
import ExcepcionesSegunDeterminacion from "./ExcepcionesSegunDeterminacion";

const { Option } = Select;
const { Title } = Typography;
const TIPOS_EXCEPCION = {
  basico: "Básico",
  prestamo: "Préstamo",
  debito: "Débito",
  credito: "Crédito",
};

const Excepciones = ({ especificaciones, setEspecificaciones, contadorDeExcepciones,
  setContadoDeExcepciones, hayDuplicados}) => {  
  const [tipoGasto, setTipoGasto] = useState("basico");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [excepcionEditada, setExcepcionEditada] = useState(null);
  const [determinacionDeExcepcionEditada, setDeterminacionDeExcepcionEditada] =
    useState(null);
  const [determinacionDeGasto, setDeterminacionDeGasto] =
    useState("GastoEquitativo");
  const gastoRef = useRef(null);
  const formularioRef = useRef(null);
  const [botonActivo, setBotonActivo] = useState("");
  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setExcepcionEditada(null);
    setDeterminacionDeExcepcionEditada(null);
  };

  useEffect(() => {
    if (contadorDeExcepciones === 0) {
      setBotonActivo("");
    }
  }, [contadorDeExcepciones])

  const handleButtonClick = (accion) => {
    if (botonActivo === accion) {
      setBotonActivo("");
    } else {
      setBotonActivo(accion);
    }
  };
  const agregarExcepcion = () => {
    if (gastoRef.current) {
      const nuevaExcepcion = gastoRef.current.obtenerDatos();
      if (!nuevaExcepcion) {
        return;
      }
      if (excepcionEditada) {
        nuevaExcepcion.id = excepcionEditada.id;
        if (hayDuplicados(nuevaExcepcion, true)) {
          return;
        }
        if (determinacionDeGasto !== determinacionDeExcepcionEditada) {
          eliminarExcepcion(
            excepcionEditada,
            false,
            determinacionDeExcepcionEditada
          );
          agregarExcepcionNueva(nuevaExcepcion, true);
        } else {
          // Actualizar la excepción existente
          setEspecificaciones((prevEspecificaciones) => {
            const nuevasExcepciones = prevEspecificaciones[
              "excepcionesGlobales"
            ][determinacionDeGasto].map((excepcion) =>
              excepcion.id === excepcionEditada.id
                ? { ...excepcion, ...nuevaExcepcion } // Actualizar solo la excepción editada
                : excepcion
            );

            return {
              ...prevEspecificaciones,
              excepcionesGlobales: {
                ...prevEspecificaciones["excepcionesGlobales"],
                [determinacionDeGasto]: nuevasExcepciones,
              },
            };
          });
          setMostrarFormulario(false);
        }
      }
      else {        
      if (hayDuplicados(nuevaExcepcion, false)) {
        return;
      }
        agregarExcepcionNueva(nuevaExcepcion);
      }
    }
  };

  const agregarExcepcionNueva = (nuevaExcepcion, esEditada = false) => {
    const excepcionConId = { id: Date.now(), ...nuevaExcepcion };
    setEspecificaciones((prev) => ({
      ...prev,
      excepcionesGlobales: {
        ...prev.excepcionesGlobales,
        [determinacionDeGasto]: [
          ...(prev.excepcionesGlobales?.[determinacionDeGasto] || []),
          excepcionConId,
        ],
      },
    }));
    setMostrarFormulario(false);
    if (esEditada){
    setContadoDeExcepciones(contadorDeExcepciones);
    }
    else {
      setContadoDeExcepciones(contadorDeExcepciones + 1);
    }
  };

  const seleccionarExcepcion = (excepcion, determinacion) => {
    setExcepcionEditada(excepcion);
    setMostrarFormulario(true); // Abrimos el formulario para editar
    setTipoGasto(excepcion.tipo);
    setDeterminacionDeGasto(determinacion);
    setDeterminacionDeExcepcionEditada(determinacion);
    // Mover foco al formulario
    formularioRef.current?.focus();
  };

  const eliminarExcepcion = (excepcion, confirmar = true, determinacion) => {
    if (confirmar) {
      Modal.confirm({
        title: "Confirmar eliminación",
        content: `¿Estás seguro de que quieres eliminar la excepción "${excepcion.tipo}"?`,
        okText: "Sí, eliminar",
        cancelText: "Cancelar",
        onOk: () => {
          setEspecificaciones((prev) => ({
            ...prev,
            excepcionesGlobales: {
              ...prev.excepcionesGlobales,
              [determinacion]:
                prev.excepcionesGlobales[determinacion]?.filter(
                  (ex) => ex.id !== excepcion.id
                ) || [],
            },
          }));
          setContadoDeExcepciones(contadorDeExcepciones - 1);
        },
      });
    } else {
      setEspecificaciones((prev) => ({
        ...prev,
        excepcionesGlobales: {
          ...prev.excepcionesGlobales,
          [determinacion]:
            prev.excepcionesGlobales[determinacion]?.filter(
              (ex) => ex.id !== excepcion.id
            ) || [],
        },
      }));
      setContadoDeExcepciones(contadorDeExcepciones - 1);
    }
  };

  const handleChange = (value) => {
    setDeterminacionDeGasto(value);
  };
  
  return (
    <>
      <Card className={css.card}>
        <div className={css.header}>
          <div>
            <div className={css.contenedorPersona}>
              <span className={css.cardTitle}>Excepciones</span>
            </div>
          </div>
          <Button
            type="primary"
            onClick={toggleFormulario}
            className={css.addButton}
            disabled={mostrarFormulario}
          >
            Agregar nueva excepción
          </Button>
        </div>
        <hr className={css.divider} />

        {mostrarFormulario && (
          <>
            <Title level={4} className={css.nuevoGastoTitulo}>
              {excepcionEditada ? "Modificar Excepción" : "Nueva Excepción"}
            </Title>

            <div
              className={css.formContainer}
              ref={formularioRef}
              tabIndex={-1}
            >
              <div className={css.contenedortitulo}>
                <label>Tipo de gasto:</label>
                <Select
                  value={tipoGasto}
                  onChange={setTipoGasto}
                  className={css.selectBox}
                >
                  {Object.entries(TIPOS_EXCEPCION).map(([key, label]) => (
                    <Option key={key} value={key}>
                      {label}
                    </Option>
                  ))}
                </Select>

                <label>Determinación:</label>
                <Select
                  value={determinacionDeGasto}
                  placeholder="Gasto..."
                  style={{ width: 172 }}
                  onChange={handleChange}
                >
                  <Option value="GastoEquitativo">Gasto Equitativo</Option>
                  <Option value="GastoIgualitario">Gasto Igualitario</Option>
                  <Option value="GastoPersonal">Gasto Personal</Option>
                  <Option value="GastoDeOtraPersona">Gasto de Otra Persona</Option>
                </Select>
              </div>
            </div>

            {tipoGasto === "basico" && (
              <GastoBasico
                ref={gastoRef}
                gasto={excepcionEditada}
                excepcion={true}
              />
            )}
            {tipoGasto === "prestamo" && (
              <GastoPrestamo
                ref={gastoRef}
                gasto={excepcionEditada}
                excepcion={true}
                usoDirecto={false}
              />
            )}
            {tipoGasto === "debito" && (
              <GastoDebito
                ref={gastoRef}
                gasto={excepcionEditada}
                excepcion={true}
                usoDirecto={false}
              />
            )}
            {tipoGasto === "credito" && (
              <GastoCredito
                ref={gastoRef}
                gasto={excepcionEditada}
                excepcion={true}
                usoDirecto={false}
              />
            )}
            <div className={css.buttonContainer1}>
              <Button type="primary" onClick={agregarExcepcion}>
                Confirmar
              </Button>
              <Button onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </Button>
            </div>
          </>
        )}

        <div className={css.buttonContainer}>
          <Title level={4}>Excepciones Agregados</Title>
          <div>
            <Button
              className={`${
                botonActivo === "modificar" ? css.modificarActivo : ""
              }`}
              onClick={() => handleButtonClick("modificar")}
              disabled={contadorDeExcepciones === 0}
            >
              Modificar
            </Button>
            <Button
              className={`${
                botonActivo === "eliminar" ? css.eliminarActivo : ""
              }`}
              onClick={() => handleButtonClick("eliminar")}
              disabled={contadorDeExcepciones === 0}
            >
              Eliminar
            </Button>
          </div>
        </div>

        <ExcepcionesSegunDeterminacion
          especificaciones={especificaciones}
          determinacion={"GastoEquitativo"}
          TIPOS_EXCEPCION={TIPOS_EXCEPCION}
          botonActivo={botonActivo}
          eliminarExcepcion={eliminarExcepcion}
          seleccionarExcepcion={seleccionarExcepcion}
        />
        <ExcepcionesSegunDeterminacion
          especificaciones={especificaciones}
          determinacion={"GastoIgualitario"}
          TIPOS_EXCEPCION={TIPOS_EXCEPCION}
          botonActivo={botonActivo}
          eliminarExcepcion={eliminarExcepcion}
          seleccionarExcepcion={seleccionarExcepcion}
        />
        <ExcepcionesSegunDeterminacion
          especificaciones={especificaciones}
          determinacion={"GastoPersonal"}
          TIPOS_EXCEPCION={TIPOS_EXCEPCION}
          botonActivo={botonActivo}
          eliminarExcepcion={eliminarExcepcion}
          seleccionarExcepcion={seleccionarExcepcion}
        />
          <ExcepcionesSegunDeterminacion
          especificaciones={especificaciones}
          determinacion={"GastoDeOtraPersona"}
          TIPOS_EXCEPCION={TIPOS_EXCEPCION}
          botonActivo={botonActivo}
          eliminarExcepcion={eliminarExcepcion}
          seleccionarExcepcion={seleccionarExcepcion}
        />
      </Card>
    </>
  );
};
export default Excepciones;
