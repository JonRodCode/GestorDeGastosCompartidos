import { useState, useRef } from "react";
import css from "../../css/Excepciones.module.css";
import {
  Card,
  Button,
  Select,
  Tooltip,
  Typography,
  Checkbox,
  Modal,
} from "antd";
import GastoBasico from "../Gastos/GastoBasico";
import GastoPrestamo from "../Gastos/GastoPrestamo";
import GastoDebito from "../Gastos/GastoDebito";
import GastoCredito from "../Gastos/GastoCredito";

const { Option } = Select;
const { Title, Text } = Typography;
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
  const [gastoEditado, setGastoEditado] = useState(null);
  const [determinacionDeGasto, setDeterminacionDeGasto] =
    useState("GastoEquitativo");
  const gastoRef = useRef(null);
  const formularioRef = useRef(null);
  const [botonActivo, setBotonActivo] = useState("");
  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setGastoEditado(null);
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
//HAY QUE CORROBORAR QUE NO ESTE LA MISMA EXCEPCCION EN OTRA DETERMINACION
  const agregarExcepcion = () => {
    if (gastoRef.current) {
      const nuevaExcepcion = gastoRef.current.obtenerDatos();
  
      if (!nuevaExcepcion) {
        return;
      }
  
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
    }
  };
  
  

  const seleccionarExcepcion = (gasto) => {
    setGastoEditado(gasto);
    setMostrarFormulario(true); // Abrimos el formulario para editar
    setTipoGasto(gasto.tipo);

    // Mover foco al formulario
    formularioRef.current?.focus();
  };

  const eliminarExcepcion = (excepcion, confirmar = true, determinacion = "GastoEquitativo") => {
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
              [determinacion]: prev.excepcionesGlobales[determinacionDeGasto]?.filter(
                (ex) => ex.id !== excepcion.id
              ) || [],
            },
          }));
        },
      });
    } else {
      setEspecificaciones((prev) => ({
        ...prev,
        excepcionesGlobales: {
          ...prev.excepcionesGlobales,
          [determinacionDeGasto]: prev.excepcionesGlobales[determinacionDeGasto]?.filter(
            (ex) => ex.id !== excepcion.id
          ) || [],
        },
      }));
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
              {gastoEditado ? "Modificar Gasto" : "Nueva Excepción"}
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
                gasto={gastoEditado}
                excepcion={true}
              />
            )}
            {tipoGasto === "prestamo" && (
              <GastoPrestamo
                ref={gastoRef}
                gasto={gastoEditado}
                excepcion={true}
                usoDirecto={false}
              />
            )}
            {tipoGasto === "debito" && (
              <GastoDebito
                ref={gastoRef}
                gasto={gastoEditado}
                excepcion={true}
                usoDirecto={false}
              />
            )}
            {tipoGasto === "credito" && (
              <GastoCredito
                ref={gastoRef}
                gasto={gastoEditado}
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

        <div className={css.gastosLista}>
          {especificaciones["excepcionesGlobales"]["GastoEquitativo"].length === 0 ? (
            <Text type="secondary">No se han agregado excepciones</Text>
          ) : (
            <div>
              <div className={css.gastosScrollWrapper}>
                <div className={css.gastosScrollContainer}>
                  {especificaciones["excepcionesGlobales"]["GastoEquitativo"].map((excepcion) => (
                    <div key={excepcion.id} className={css.gastoItem}>
                      <Card>
                        <div className={css.tipoYCheckbox}>
                          <p>
                            <strong>Tipo:</strong>{" "}
                            {TIPOS_EXCEPCION[excepcion.tipo] || excepcion.tipo}
                          </p>
                        </div>
                        <p>
                          <strong>Fuente del gasto:</strong>{" "}
                          {excepcion.fuenteDelGasto}
                        </p>
                        {excepcion.detalle && (
                          <p>
                            <strong>Detalle:</strong> {excepcion.detalle}
                          </p>
                        )}
                        {excepcion.fecha && (
                          <p>
                            <strong>Fecha:</strong> {excepcion.fecha.toString()}
                          </p>
                        )}
                        {excepcion.tipo === "basico" && (
                          <>
                            <p>
                              <strong>Forma de pago:</strong>{" "}
                              {excepcion.formaDePago}
                            </p>
                          </>
                        )}
                        {excepcion.tipo === "prestamo" && (
                          <>
                            <p>
                              <strong>Cuota Actual:</strong>{" "}
                              {excepcion.cuotaActual}
                            </p>
                            <p>
                              <strong>Total de Cuotas:</strong>{" "}
                              {excepcion.totalDeCuotas}
                            </p>
                            <p>
                              <strong>Préstamo de:</strong>{" "}
                              {excepcion.prestamoDe}
                            </p>
                          </>
                        )}
                        {(excepcion.tipo === "debito" ||
                          excepcion.tipo === "credito") && (
                          <>
                            <p>
                              <strong>Tarjeta:</strong> {excepcion.tarjeta}
                            </p>
                            <p>
                              <strong>Tipo de Tarjeta:</strong>{" "}
                              {excepcion.tipoTarjeta}
                            </p>
                            {excepcion.tipoTarjeta === "Extensión" && (
                              <p>
                                <strong>A Nombre De:</strong>{" "}
                                {excepcion.aNombreDe}
                              </p>
                            )}
                            <p>
                              <strong>Banco:</strong> {excepcion.banco}
                            </p>
                            <p>
                              <strong>Últimos dígitos de la Tarjeta:</strong>{" "}
                              {excepcion.numFinalTarjeta}
                            </p>
                          </>
                        )}
                        {excepcion.tipo === "credito" && (
                          <>
                            <p>
                              <strong>Nombre del Consumo:</strong>{" "}
                              {excepcion.nombreConsumo}
                            </p>
                            <p>
                              <strong>Cuota Actual:</strong>{" "}
                              {excepcion.cuotaActual}
                            </p>
                            <p>
                              <strong>Total de Cuotas:</strong>{" "}
                              {excepcion.totalDeCuotas}
                            </p>
                          </>
                        )}
                        {botonActivo === "eliminar" && (
                          <p
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => eliminarExcepcion(excepcion)}
                          >
                            Eliminar
                          </p>
                        )}
                        {botonActivo === "modificar" && (
                          <p
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => seleccionarExcepcion(excepcion)}
                          >
                            Seleccionar
                          </p>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
export default Excepciones;
