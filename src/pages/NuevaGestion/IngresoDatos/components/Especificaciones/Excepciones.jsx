import { useState, useRef } from "react";
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

const Excepciones = ({ especificaciones, setEspecificaciones }) => {
  const [contadorDeExcepciones, setContadoDeExcepciones] = useState(0);
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

  const handleButtonClick = (accion) => {
    if (botonActivo === accion) {
      // Si el botón ya está activo, lo desactivamos
      setBotonActivo("");
    } else {
      // Si no está activo, lo activamos y desactivamos el otro
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
        if (hayDuplicados(nuevaExcepcion, true)) {
          return;
        }
        if (determinacionDeGasto !== determinacionDeExcepcionEditada) {
          eliminarExcepcion(
            excepcionEditada,
            false,
            determinacionDeExcepcionEditada
          );
          agregarExcepcionNueva(nuevaExcepcion);
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

  const agregarExcepcionNueva = (nuevaExcepcion) => {
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

    setContadoDeExcepciones(contadorDeExcepciones + 1);
    setMostrarFormulario(false);
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

  const formatKey = (key) => {
    return key.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const hayDuplicados = (nuevaExcepcion, esEditado) => {
    const excepcionesGlobales = especificaciones["excepcionesGlobales"];
  
    for (const key in excepcionesGlobales) {
      const excepciones = excepcionesGlobales[key];
  
      for (const excepcion of excepciones) {
        if (esEditado && excepcion.id === nuevaExcepcion.id) {
          continue;  
        }  
        if (
          excepcion.persona === nuevaExcepcion.persona &&
          excepcion.fuenteDelGasto === nuevaExcepcion.fuenteDelGasto &&
          excepcion.detalle === nuevaExcepcion.detalle &&
          excepcion.tipo === nuevaExcepcion.tipo &&
          excepcion?.prestamoDe === nuevaExcepcion?.prestamoDe &&
          excepcion?.banco === nuevaExcepcion?.banco &&
          excepcion?.tarjeta === nuevaExcepcion?.tarjeta &&
          excepcion?.numFinalTarjeta === nuevaExcepcion?.numFinalTarjeta &&
          excepcion?.aNombreDe === nuevaExcepcion?.aNombreDe &&
          excepcion?.tipoTarjeta === nuevaExcepcion?.tipoTarjeta &&
          excepcion?.nombreConsumo === nuevaExcepcion?.nombreConsumo
        ) {

          Modal.warning({
            title: 'Excepción duplicada',
            content: `Ya existe una excepción con los mismos datos como "${formatKey(key)}".`,
            onOk() {
            },
          });
          return true;
        }
      }
    }
    return false;
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
                  style={{ width: 160 }}
                  onChange={handleChange}
                >
                  <Option value="GastoEquitativo">Gasto Equitativo</Option>
                  <Option value="GastoIgualitario">Gasto Igualitario</Option>
                  <Option value="GastoPersonal">Gasto Personal</Option>
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
              disabled={especificaciones["excepcionesGlobales"].length === 0}
            >
              Modificar
            </Button>
            <Button
              className={`${
                botonActivo === "eliminar" ? css.eliminarActivo : ""
              }`}
              onClick={() => handleButtonClick("eliminar")}
              disabled={especificaciones["excepcionesGlobales"].length === 0}
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
      </Card>
    </>
  );
};
export default Excepciones;
