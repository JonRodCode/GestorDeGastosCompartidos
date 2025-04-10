import { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Select,
  Tooltip,
  Typography,
  Checkbox,
  Modal,
} from "antd";
import GastoBasico from "./Gastos/GastoBasico";
import GastoPrestamo from "./Gastos/GastoPrestamo";
import GastoDebito from "./Gastos/GastoDebito";
import GastoCredito from "./Gastos/GastoCredito";
import css from "../css/PersonaConGastos.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import PanelDeCargaDeGastos from "./Gastos/PanelDeCargaDeGastos";

const { Option } = Select;
const { Title, Text } = Typography;
const TIPOS_GASTO = {
  basico: "Básico",
  prestamo: "Préstamo",
  debito: "Débito",
  credito: "Crédito",
};

const PersonaConGastos = ({
  agregarMuchosGastos,
  nombre,
  setPersonaAEliminar,
  eliminarPersona,
  gastos,
  setGastos,
  listaDeFuentesDeGastosPendientes,
  setListaDeFuentesDeGastosPendientes,
  especificaciones,
  setEspecificaciones,

  setFuentesDeGastosEnUsoPorPersona,

  listaDeConsumosPendientes,
  setListaDeConsumosPendientes,

  setConsumosEnUsoPorPersona,

  elementoAReclasificar,
  setElementoAReclasificar,
}) => {
  const [tipoGasto, setTipoGasto] = useState("basico");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gastoEditado, setGastoEditado] = useState(null);
  const gastoRef = useRef(null);
  const formularioRef = useRef(null); // Referencia al formulario
  const [botonActivo, setBotonActivo] = useState("");
  const [mostrarPanelDeCarga, setMostrarPanelDeCarga] = useState(false);
  const [seCargaronGastos, setSeCargaronGastos] = useState(false);

  // Función para manejar el clic en los botones
  const handleButtonClick = (accion) => {
    if (botonActivo === accion) {
      // Si el botón ya está activo, lo desactivamos
      setBotonActivo("");
    } else {
      // Si no está activo, lo activamos y desactivamos el otro
      setBotonActivo(accion);
    }
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setGastoEditado(null);
  };

  const existeElemento = (elemento, elementos, elementosPendientes) => {
    const existeEnElementos = Array.isArray(elementos)
      ? elementos.includes(elemento)
      : elemento in elementos;

    if (!(existeEnElementos || elementosPendientes.includes(elemento))) {
      return false;
    }
    return true;
  };

  const agregarElemento = (
    elemento,
    elementos,
    elementosPendientes,
    setElementosPendientes,
    setElementosEnUso
  ) => {
    if (!elemento) return;

    if (!existeElemento(elemento, elementos, elementosPendientes)) {
      setElementosPendientes((prev) => [...prev, elemento]);
    }

    setElementosEnUso((prev) => ({
      ...prev,
      [nombre]: {
        ...prev[nombre],
        [elemento]: (prev[nombre]?.[elemento] || 0) + 1,
      },
    }));
  };

  const agregarConsumo = (nuevoGasto) => {
    setEspecificaciones((prev) => {
      const listaActual = prev.fuenteDelGasto[nuevoGasto.fuenteDelGasto] || [];

      return {
        ...prev,
        fuenteDelGasto: {
          ...prev.fuenteDelGasto,
          [nuevoGasto.fuenteDelGasto]: listaActual.includes(
            nuevoGasto.nombreConsumo
          )
            ? listaActual // Si ya existe, no lo agregamos
            : [...listaActual, nuevoGasto.nombreConsumo], // Si no está, lo agregamos
        },
      };
    });
  };

  const modificarFuenteDelGastoSiEsEditada = (fuenteDelGasto) => {
    if (fuenteDelGasto === gastoEditado.fuenteDelGasto) {
      return;
    }
    agregarElemento(
      fuenteDelGasto,
      especificaciones.fuenteDelGasto,
      listaDeFuentesDeGastosPendientes,
      setListaDeFuentesDeGastosPendientes,
      setFuentesDeGastosEnUsoPorPersona
    );
    restar1UnElementoEnUso(
      gastoEditado.fuenteDelGasto,
      setFuentesDeGastosEnUsoPorPersona
    );
  };

  const modificarConsumoSiEsEditado = (consumo, consumos) => {
    if (!consumo) return;
    if (consumo === gastoEditado.nombreConsumo) {
      return;
    }

    agregarElemento(
      consumo,
      consumos,
      listaDeConsumosPendientes,
      setListaDeConsumosPendientes,
      setConsumosEnUsoPorPersona
    );

    restar1UnElementoEnUso(
      gastoEditado.nombreConsumo,
      setConsumosEnUsoPorPersona
    );
  };

  const agregarGasto = () => {
    if (gastoRef.current) {
      const nuevoGasto = gastoRef.current.obtenerDatos();

      if (!validarConcordanciaEntreConsumoYFuenteDeGasto(nuevoGasto)) {
        return;
      }

      const consumos = Object.values(especificaciones.fuenteDelGasto).flat();

      if (nuevoGasto) {
        if (gastoEditado) {
          modificarFuenteDelGastoSiEsEditada(nuevoGasto.fuenteDelGasto);
          modificarConsumoSiEsEditado(nuevoGasto.nombreConsumo, consumos);
          setGastos(
            gastos.map((gasto) =>
              gasto.id === gastoEditado.id ? { ...gasto, ...nuevoGasto } : gasto
            )
          );
        } else {
          agregarElemento(
            nuevoGasto.fuenteDelGasto,
            especificaciones.fuenteDelGasto,
            listaDeFuentesDeGastosPendientes,
            setListaDeFuentesDeGastosPendientes,
            setFuentesDeGastosEnUsoPorPersona
          );
          if (nuevoGasto.tipo === "credito" && nuevoGasto.nombreConsumo !== "") {
            agregarElemento(
              nuevoGasto.nombreConsumo,
              consumos,
              listaDeConsumosPendientes,
              setListaDeConsumosPendientes,
              setConsumosEnUsoPorPersona
            );
            agregarConsumo(nuevoGasto);
          }

          setGastos([...gastos, { id: Date.now(), ...nuevoGasto }]);
        }
        setMostrarFormulario(false);
      }
    }
  };

  const elGastoYaExiste = (gasto, lista1, lista2, noSeEliminaronDeLista1 = true) => {
    const existeEnLista1 = noSeEliminaronDeLista1 ? lista1.some((item) => item.id === gasto.id) : false;
    const existeEnLista2 = lista2.some((item) => item.id === gasto.id);
  
    return existeEnLista1 || existeEnLista2;
  };
  

  const agregarMuchosGastosValidados = (
    listaDeGastos,
    eliminarValoresAnteriores = false
  ) => {
    if (eliminarValoresAnteriores) {
      setFuentesDeGastosEnUsoPorPersona((prev) => ({
        ...prev,
        [nombre]: {},
      }));

      setConsumosEnUsoPorPersona((prev) => ({
        ...prev,
        [nombre]: {},
      }));
      setGastos((prev) => ({
        ...prev,
        [nombre]: {},
      }));
    }

    const listaDeGastosValidados = [];
    let contadorDeInsonsistencias = 0;

    listaDeGastos.forEach((gasto) => {
      let esValido = !elGastoYaExiste(gasto, gastos, listaDeGastosValidados, !eliminarValoresAnteriores);

      if (esValido) {
        if (gasto.tipo === "credito" && gasto.nombreConsumo !== "") {
          if (validarConcordanciaEntreConsumoYFuenteDeGasto(gasto, true, false)){
            const consumos = Object.values(
              especificaciones.fuenteDelGasto
            ).flat();
            agregarElemento(
              gasto.nombreConsumo,
              consumos,
              listaDeConsumosPendientes,
              setListaDeConsumosPendientes,
              setConsumosEnUsoPorPersona
            );
            agregarConsumo(gasto);
          } else {
            contadorDeInsonsistencias += 1;
            esValido = false;
          }
        }

        if (esValido) {
          agregarElemento(
            gasto.fuenteDelGasto,
            especificaciones.fuenteDelGasto,
            listaDeFuentesDeGastosPendientes,
            setListaDeFuentesDeGastosPendientes,
            setFuentesDeGastosEnUsoPorPersona
          );
          listaDeGastosValidados.push(gasto);
        }
      }
    });

    if (listaDeGastosValidados.length > 0) {
      agregarMuchosGastos(
        nombre,
        listaDeGastosValidados,
        eliminarValoresAnteriores
      );
      setSeCargaronGastos(true);
    }
    if (contadorDeInsonsistencias > 0) {
      Modal.info({
        title: "Inconsistencia detectada",
        content: (
          <>
            <p>
              No se pudieron cargar todos los gastos debido a inconsistencias
              entre los campos &quot;Fuente del gasto&quot; y &quot;Nombre del
              Consumo&quot;.
            </p>
            <p>Cantidad de gastos no cargados: {contadorDeInsonsistencias}.</p>
            <p>
              Puede recategorizar en &quot;Especificaciones&quot;, y volver a
              intentarlo.
            </p>
          </>
        ),
      });
    }
  };

  const validarConcordanciaEntreConsumoYFuenteDeGasto = (
    nuevoGasto,
    cargandoDatos = false,
    mostrarAdvertencias = true
  ) => {
    const { fuenteDelGasto, nombreConsumo } = nuevoGasto;
    if (!nombreConsumo) return true; // Si nombreConsumo es null o undefined, tampoco validamos

    const consumos = Object.values(especificaciones.fuenteDelGasto).flat();
    if (!consumos.includes(nombreConsumo)) {
      return true;
    }

    if (!especificaciones.fuenteDelGasto[fuenteDelGasto] && !cargandoDatos) {
      if (mostrarAdvertencias) {
        Modal.warning({
          title: "Inconsistencia detectada",
          content: `El consumo "${nombreConsumo}" ya pertenece a otra fuente de gasto. Modifique los campos o recategorice en "Especificaciones"`,
        });
      }
      return false;
    }

    const esValido =
      especificaciones.fuenteDelGasto[fuenteDelGasto].includes(nombreConsumo);

    if (!esValido && !cargandoDatos) {
      Modal.warning({
        title: "Inconsistencia detectada",
        content: `El consumo "${nombreConsumo}" no pertenece a la fuente de gasto "${fuenteDelGasto}". Modifique los campos o recategorice en "Especificaciones"`,
      });
    } else if (!esValido && cargandoDatos) {
      return false;
    }

    return esValido;
  };

  const seleccionarGasto = (gasto) => {
    setGastoEditado(gasto);
    setMostrarFormulario(true); // Abrimos el formulario para editar
    setTipoGasto(gasto.tipo);

    // Mover foco al formulario
    formularioRef.current?.focus();
  };

  const restar1UnElementoEnUso = (elemento, setElementoEnUso) => {
    if (!elemento) return;

    setElementoEnUso((prev) => {
      const copia = { ...prev };

      if (copia[nombre]?.[elemento]) {
        copia[nombre][elemento] -= 1;

        if (copia[nombre][elemento] === 0) {
          delete copia[nombre][elemento];
        }
      }
      return copia;
    });
  };

  const eliminarElementosEnUso = (gasto) => {
    restar1UnElementoEnUso(
      gasto.fuenteDelGasto,
      setFuentesDeGastosEnUsoPorPersona
    );
    restar1UnElementoEnUso(gasto.nombreConsumo, setConsumosEnUsoPorPersona);
    setGastos(gastos.filter((g) => g.id !== gasto.id));
    if (gastos.length === 1) {
      setBotonActivo("");
    }
  };

  const eliminarGasto = (gasto, confirmar = true) => {
    if (confirmar) {
      Modal.confirm({
        title: "Confirmar eliminación",
        content: `¿Estás seguro de que quieres eliminar el gasto "${gasto.tipo}"?`,
        okText: "Sí, eliminar",
        cancelText: "Cancelar",
        onOk: () => {
          eliminarElementosEnUso(gasto);
        },
      });
    } else {
      eliminarElementosEnUso(gasto);
    }
  };

  const eliminarConsumosPendientesClasificados = () => {
    setListaDeConsumosPendientes((pendientes) => {
      return pendientes.filter((consumoPendiente) => {
        const keyEncontrada = Object.entries(
          especificaciones["fuenteDelGasto"]
        ).find((entrada) => entrada[1].includes(consumoPendiente))?.[0];

        if (keyEncontrada) {
          const fuentesDeGastosActuales = Object.values(
            especificaciones.categorias
          ).flat();
          return !fuentesDeGastosActuales.includes(keyEncontrada);
        }

        return true;
      });
    });
  };
  useEffect(() => {
    if (seCargaronGastos) {
      setListaDeFuentesDeGastosPendientes((prev) => [...new Set(prev)]);
      setListaDeConsumosPendientes((prev) => [...new Set(prev)]);
      eliminarConsumosPendientesClasificados();
      setSeCargaronGastos(false);
    }
  }, [seCargaronGastos]);

  useEffect(() => {
    if (elementoAReclasificar.length !== 0) {
      const nuevosGastos = gastos.map((gasto) =>
        gasto.nombreConsumo === elementoAReclasificar[0]
          ? { ...gasto, fuenteDelGasto: elementoAReclasificar[1] }
          : gasto
      );
      setGastos(nuevosGastos);
      setElementoAReclasificar([]);
    }
  }, [elementoAReclasificar]);

  const eliminarPersonaCompletamente = () => {
    Modal.confirm({
      title: "Confirmar eliminación",
      content: `¿Estás seguro de que quieres eliminar a ${nombre}?`,
      okText: "Eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      onOk: () => {
        setPersonaAEliminar(nombre);
        
        setFuentesDeGastosEnUsoPorPersona(prev => {
          const nuevoEstado = { ...prev };
          delete nuevoEstado[nombre];
          return nuevoEstado;
        });
      
        setConsumosEnUsoPorPersona(prev => {
          const nuevoEstado = { ...prev };
          delete nuevoEstado[nombre];
          return nuevoEstado;
        });
      }      
    });
  };
  

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <div>
          <div className={css.contenedorPersona}>
            <Button
              type="text"
              icon={mostrarPanelDeCarga ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setMostrarPanelDeCarga(!mostrarPanelDeCarga)}
            />
            <span className={css.cardTitle}>{nombre}</span>
            {eliminarPersona && (
              <p className={css.eliminarPersona}
              onClick={eliminarPersonaCompletamente}>Eliminar</p>
            )}
          </div>

          <div>
            {mostrarPanelDeCarga && (
              <PanelDeCargaDeGastos
                especificaciones={gastos}
                nombreDePersona={nombre}
                agregarMuchosGastos={agregarMuchosGastosValidados}
                tipoDeCaptura={"array"}
                elemento="gastos"
              />
            )}
          </div>
        </div>
        <Button
          type="primary"
          onClick={toggleFormulario}
          className={css.addButton}
          disabled={mostrarFormulario}
        >
          Agregar nuevo gasto
        </Button>
      </div>
      <hr className={css.divider} />

      {mostrarFormulario && (
        <>
          <Title level={4} className={css.nuevoGastoTitulo}>
            {gastoEditado ? "Modificar Gasto" : "Nuevo Gasto"}
          </Title>
          <div className={css.formContainer} ref={formularioRef} tabIndex={-1}>
            <label>Tipo de gasto:</label>
            <Select
              value={tipoGasto}
              onChange={setTipoGasto}
              className={css.selectBox}
            >
              {Object.entries(TIPOS_GASTO).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>

          {tipoGasto === "basico" && (
            <GastoBasico ref={gastoRef} gasto={gastoEditado} />
          )}
          {tipoGasto === "prestamo" && (
            <GastoPrestamo ref={gastoRef} gasto={gastoEditado} />
          )}
          {tipoGasto === "debito" && (
            <GastoDebito ref={gastoRef} gasto={gastoEditado} />
          )}
          {tipoGasto === "credito" && (
            <GastoCredito ref={gastoRef} gasto={gastoEditado} />
          )}
          <div className={css.buttonContainer1}>
            <Button type="primary" onClick={agregarGasto}>
              Confirmar
            </Button>
            <Button onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </Button>
          </div>
        </>
      )}

      <div className={css.buttonContainer}>
        <Title level={4}>Gastos Agregados</Title>
        <div>
          <Button
            className={`${
              botonActivo === "modificar" ? css.modificarActivo : ""
            }`}
            onClick={() => handleButtonClick("modificar")}
            disabled={gastos.length === 0}
          >
            Modificar
          </Button>
          <Button
            className={`${
              botonActivo === "eliminar" ? css.eliminarActivo : ""
            }`}
            onClick={() => handleButtonClick("eliminar")}
            disabled={gastos.length === 0}
          >
            Eliminar
          </Button>
        </div>
      </div>

      <div className={css.gastosLista}>
        {gastos.length === 0 ? (
          <Text type="secondary">No se han agregado gastos</Text>
        ) : (
          <div>
            <div className={css.gastosScrollWrapper}>
              <div className={css.gastosScrollContainer}>
                {gastos.map((gasto) => (
                  <div key={gasto.id} className={css.gastoItem}>
                    <Card>
                      <div className={css.tipoYCheckbox}>
                        <p>
                          <strong>T. de importe:</strong>{" "}
                          {gasto.tipoDeImporte}
                        </p>
                        <Tooltip title="Marcar para un rápido acceso luego de la clasificación">
                          <Checkbox checked={gasto.marcado} />
                        </Tooltip>
                      </div>
                      <p>
                          <strong>Tipo:</strong>{" "}
                          {TIPOS_GASTO[gasto.tipo] || gasto.tipo}
                        </p>
                      <p>
                        <strong>Fuente del gasto:</strong>{" "}
                        {gasto.fuenteDelGasto}
                      </p>
                      <p>
                        <strong>Monto:</strong> {gasto.monto}
                      </p>
                      {gasto.detalle && (
                        <p>
                          <strong>Detalle:</strong> {gasto.detalle}
                        </p>
                      )}
                      {gasto?.fecha && (
                        <p>
                          <strong>Fecha:</strong> {gasto?.fecha.toString()}
                        </p>
                      )}
                      {gasto.tipo === "basico" && (
                        <>
                          <p>
                            <strong>Forma de pago:</strong> {gasto.formaDePago}
                          </p>
                        </>
                      )}
                      {gasto.tipo === "prestamo" && (
                        <>
                          <p>
                            <strong>Cuota Actual:</strong> {gasto.cuotaActual}
                          </p>
                          <p>
                            <strong>Total de Cuotas:</strong>{" "}
                            {gasto.totalDeCuotas}
                          </p>
                          <p>
                            <strong>Préstamo de:</strong> {gasto.prestamoDe}
                          </p>
                        </>
                      )}
                      {(gasto.tipo === "debito" ||
                        gasto.tipo === "credito") && (
                        <>
                          <p>
                            <strong>Tarjeta:</strong> {gasto.tarjeta}
                          </p>
                          <p>
                            <strong>Tipo de Tarjeta:</strong>{" "}
                            {gasto.tipoTarjeta}
                          </p>
                          {gasto.tipoTarjeta === "Extensión" && (
                            <p>
                              <strong>A Nombre De:</strong> {gasto.aNombreDe}
                            </p>
                          )}
                          <p>
                            <strong>Banco:</strong> {gasto.banco}
                          </p>
                          <p>
                            <strong>Últimos dígitos de la Tarjeta:</strong>{" "}
                            {gasto.numFinalTarjeta}
                          </p>
                        </>
                      )}
                      {gasto.tipo === "credito" && (
                        <>
                          <p>
                            <strong>Nombre del Consumo:</strong>{" "}
                            {gasto.nombreConsumo}
                          </p>
                          <p>
                            <strong>Cuota Actual:</strong> {gasto.cuotaActual}
                          </p>
                          <p>
                            <strong>Total de Cuotas:</strong>{" "}
                            {gasto.totalDeCuotas}
                          </p>
                        </>
                      )}
                      {botonActivo === "eliminar" && (
                        <p
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => eliminarGasto(gasto)}
                        >
                          Eliminar
                        </p>
                      )}
                      {botonActivo === "modificar" && (
                        <p
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() => seleccionarGasto(gasto)}
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
  );
};

export default PersonaConGastos;
