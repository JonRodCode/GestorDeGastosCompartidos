import { useState, useRef } from "react";
import { Card, Button, Select, Tooltip, Typography, Checkbox, Modal } from "antd";
import GastoBasico from "./Gastos/GastoBasico";
import GastoPrestamo from "./Gastos/GastoPrestamo";
import GastoDebito from "./Gastos/GastoDebito";
import GastoCredito from "./Gastos/GastoCredito";
import css from "../css/PersonaConGastos.module.css";

const { Option } = Select;
const { Title, Text } = Typography;
const TIPOS_GASTO = {
  basico: "Básico",
  prestamo: "Préstamo",
  debito: "Débito",
  credito: "Crédito",
};

const PersonaConGastos = ({
  nombre,
  gastos,
  setGastos,
  listaDeFuentesDeGastosPendientes,
  setListaDeFuentesDeGastosPendientes,
  fuentesDeGastos,
  //fuentesDeGastosEnUso,
  setFuentesDeGastosEnUso,  
  listaDeConsumosPendientes,
  setListaDeConsumosPendientes,
  //consumosEnUso,
  setConsumosEnUso,
}) => {
  const [tipoGasto, setTipoGasto] = useState("basico");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gastoEditado, setGastoEditado] = useState(null);
  const gastoRef = useRef(null);
  const formularioRef = useRef(null); // Referencia al formulario
  const [botonActivo, setBotonActivo] = useState("");

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

  const agregarElemento = (elemento, elementos, elementosPendientes, setElementosPendientes, setElementosEnUso) => {
    if (!elemento) return;
    const existeEnElementos = Array.isArray(elementos) 
      ? elementos.includes(elemento) 
      : elemento in elementos;
  
    if (!(existeEnElementos || elementosPendientes.includes(elemento))) {
      setElementosPendientes((prev) => [...prev, elemento]);
    }
  
    setElementosEnUso((prev) => ({
      ...prev,
      [elemento]: (prev[elemento] || 0) + 1, // Si existe, suma 1; si no, inicia en 1
    }));
  };
  

  const modificarFuenteDelGastoSiEsEditada = (fuenteDelGasto) => {
    if (fuenteDelGasto === gastoEditado.fuenteDelGasto) {
      return;
    }
    agregarElemento(fuenteDelGasto, fuentesDeGastos, 
      listaDeFuentesDeGastosPendientes, setListaDeFuentesDeGastosPendientes,
      setFuentesDeGastosEnUso);
      restar1UnElementoEnUso(gastoEditado.fuenteDelGasto, setFuentesDeGastosEnUso);
  };

  const modificarConsumoSiEsEditado = (consumo, consumos) => {
    if (!consumo) return;
    if (consumo === gastoEditado.nombreConsumo) {
      return;
    }    

    agregarElemento(consumo, consumos, 
      listaDeConsumosPendientes, setListaDeConsumosPendientes,
        setConsumosEnUso);

        restar1UnElementoEnUso(gastoEditado.nombreConsumo,setConsumosEnUso);
  };

  const agregarGasto = () => {
    if (gastoRef.current) {
      const nuevoGasto = gastoRef.current.obtenerDatos();

      if (!validarConcordanciaEntreConsumoYFuenteDeGasto(nuevoGasto)){
        return;
      };

      const consumos = Object.values(fuentesDeGastos).flat();

      if (nuevoGasto) {
        if (gastoEditado) {
          modificarFuenteDelGastoSiEsEditada(nuevoGasto.fuenteDelGasto);
          modificarConsumoSiEsEditado(nuevoGasto.nombreConsumo, consumos)
          setGastos(
            gastos.map((gasto) =>
              gasto.id === gastoEditado.id ? { ...gasto, ...nuevoGasto } : gasto
            )
          );
        } else {
          agregarElemento(nuevoGasto.fuenteDelGasto, fuentesDeGastos, 
            listaDeFuentesDeGastosPendientes, setListaDeFuentesDeGastosPendientes,
            setFuentesDeGastosEnUso
          );
          agregarElemento(nuevoGasto.nombreConsumo, consumos, 
            listaDeConsumosPendientes, setListaDeConsumosPendientes,
        setConsumosEnUso);
          
          setGastos([...gastos, { id: Date.now(), ...nuevoGasto }]);
        }
        setMostrarFormulario(false);
      }
    }
  };

  const validarConcordanciaEntreConsumoYFuenteDeGasto = (nuevoGasto) => {
    const { fuenteDelGasto, nombreConsumo } = nuevoGasto;

    if (!fuentesDeGastos[fuenteDelGasto]) return true; // Si la fuente no existe en el objeto, no validamos
    if (!nombreConsumo) return true; // Si nombreConsumo es null o undefined, tampoco validamos

    const consumos = Object.values(fuentesDeGastos).flat();
    if (!consumos.includes(nombreConsumo)) {return true};

    const esValido = fuentesDeGastos[fuenteDelGasto].includes(nombreConsumo);

    if (!esValido) {
        Modal.warning({
            title: "Inconsistencia detectada",
            content: `El consumo "${nombreConsumo}" no pertenece a la fuente de gasto "${fuenteDelGasto}". Modifique los campos o recategorice en "Especificaciones"`,
        });
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

      if (copia[elemento]) {
        copia[elemento] -= 1;

        if (copia[elemento] === 0) {
          delete copia[elemento];
        }
      }
      return copia;
    });
  };

  const eliminarGasto = (gasto) => {
    
    Modal.confirm({
        title: "Confirmar eliminación",
        content: `¿Estás seguro de que quieres eliminar el gasto "${gasto.tipo}"?`,
        okText: "Sí, eliminar",
        cancelText: "Cancelar",
        onOk: () => {
            restar1UnElementoEnUso(gasto.fuenteDelGasto, setFuentesDeGastosEnUso);
            restar1UnElementoEnUso(gasto.nombreConsumo, setConsumosEnUso);
            setGastos(gastos.filter((g) => g.id !== gasto.id));
            if (gastos.length === 1) {
        
              setBotonActivo("");
            };
        },
        
    });
};

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <span className={css.cardTitle}>{nombre}</span>
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
                          <strong>Tipo:</strong>{" "}
                          {TIPOS_GASTO[gasto.tipo] || gasto.tipo}
                        </p>
                        <Tooltip title="Marcar para un rápido acceso luego de la clasificación">
                          <Checkbox checked={gasto.marcado} />
                        </Tooltip>
                      </div>
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
                      {gasto.fecha && (
                        <p>
                          <strong>Fecha:</strong> {gasto.fecha.toString()}
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
                            <strong>Mes del Resumen:</strong>{" "}
                            {gasto.mesDelResumen}
                          </p>
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
