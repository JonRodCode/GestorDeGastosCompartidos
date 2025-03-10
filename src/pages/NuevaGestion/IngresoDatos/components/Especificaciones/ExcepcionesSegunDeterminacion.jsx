import css from "../../css/Excepciones.module.css";
import { Card, Typography } from "antd";
import { useMemo } from "react";

const { Text } = Typography;

const ExcepcionesSegunDeterminacion = ({
  especificaciones,
  determinacion,
  TIPOS_EXCEPCION,
  botonActivo,
  eliminarExcepcion,
  seleccionarExcepcion,
}) => {
  const titulo = useMemo(() => {
    if (determinacion === "GastoEquitativo") return "Gastos Equitativos: ";
    if (determinacion === "GastoIgualitario") return "Gastos Igualitarios: ";
    if (determinacion === "GastoPersonal") return "Gastos Personales: ";
    return "Excepciones Globales";
  }, [determinacion]);

  return (
    <>
      <h3>{titulo}</h3>
      <div className={css.gastosLista}>
        {especificaciones["excepcionesGlobales"][determinacion].length === 0 ? (
          <Text type="secondary">No se han agregado excepciones</Text>
        ) : (
          <div>
            <div className={css.gastosScrollWrapper}>
              <div className={css.gastosScrollContainer}>
                {especificaciones["excepcionesGlobales"][determinacion].map(
                  (excepcion) => (
                    <div key={excepcion.id} className={css.gastoItem}>
                      <Card>
                        <div className={css.tipoYCheckbox}>
                          <p>
                            <strong>Tipo:</strong>{" "}
                            {TIPOS_EXCEPCION[excepcion.tipo] || excepcion.tipo}
                          </p>
                        </div>
                        <p>
                          <strong>Nombre de persona:</strong>{" "}
                          {excepcion.persona}
                        </p>
                        <p>
                          <strong>Fuente del gasto:</strong>{" "}
                          {excepcion.fuenteDelGasto}
                        </p>
                          <p>
                            <strong>Detalle:</strong> {excepcion.detalle}
                          </p>                 
                        {excepcion.tipo === "prestamo" && (
                          <>
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
                          </>
                        )}
                        {botonActivo === "eliminar" && (
                          <p
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => eliminarExcepcion(excepcion,true, determinacion)}
                          >
                            Eliminar
                          </p>
                        )}
                        {botonActivo === "modificar" && (
                          <p
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => seleccionarExcepcion(excepcion, determinacion)}
                          >
                            Seleccionar
                          </p>
                        )}
                      </Card>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExcepcionesSegunDeterminacion;
