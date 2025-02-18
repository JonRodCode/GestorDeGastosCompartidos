import { useState, useRef } from "react";
import { Card, Button, Select, Tooltip, Typography, Checkbox } from "antd";
import GastoBasico from "./Gastos/GastoBasico";
import GastoPrestamo from "./Gastos/GastoPrestamo";
import GastoDebito from "./Gastos/GastoDebito";
import css from "../css/PersonaConGastos.module.css";

const { Option } = Select;
const { Title, Text } = Typography;

const PersonaConGastos = ({ nombre, gastos, setGastos }) => {
  const [tipoGasto, setTipoGasto] = useState("basico");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gastoEditado, setGastoEditado] = useState(null);
  const gastoRef = useRef(null);
  const formularioRef = useRef(null);  // Referencia al formulario
  const [botonActivo, setBotonActivo] = useState('');

  // Función para manejar el clic en los botones
  const handleButtonClick = (accion) => {
    if (botonActivo === accion) {
      // Si el botón ya está activo, lo desactivamos
      setBotonActivo('');
    } else {
      // Si no está activo, lo activamos y desactivamos el otro
      setBotonActivo(accion);
    }
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setGastoEditado(null);
  };

  const agregarGasto = () => {
    if (gastoRef.current) {
      const nuevoGasto = gastoRef.current.obtenerDatos();
      
      if (nuevoGasto) {
        if (gastoEditado) {
          // Si estamos editando un gasto, actualizamos ese gasto
          setGastos(gastos.map((gasto) =>
            gasto.id === gastoEditado.id ? { ...gasto, ...nuevoGasto } : gasto
          ));
        } else {
          // Si no estamos editando, agregamos un nuevo gasto
          setGastos([...gastos, { id: Date.now(), ...nuevoGasto }]);
        }
        setMostrarFormulario(false);
      }
    }
  };

  const seleccionarGasto = (gasto) => {
    setGastoEditado(gasto);
    setMostrarFormulario(true); // Abrimos el formulario para editar
    setTipoGasto(gasto.tipo);    

    // Mover foco al formulario
    formularioRef.current?.focus();
  };

  const eliminarGasto = (id) => {
    setGastos(gastos.filter((g) => g.id !== id));
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
            <Select value={tipoGasto} onChange={setTipoGasto} className={css.selectBox}>
              <Option value="basico">Básico</Option>
              <Option value="prestamo">Préstamo</Option>
              <Option value="debito">Débito</Option>
              <Option value="credito">Crédito</Option>
            </Select>
          </div>

          {tipoGasto === "basico" && <GastoBasico ref={gastoRef} gasto={gastoEditado}/>}
          {tipoGasto === "prestamo" && <GastoPrestamo ref={gastoRef} gasto={gastoEditado}/>}
          {tipoGasto === "debito" && <GastoDebito ref={gastoRef} gasto={gastoEditado}/>}

          <div className={css.buttonContainer}>
            <Button type="primary" onClick={agregarGasto}>
              Confirmar
            </Button>
            <Button onClick={() => setMostrarFormulario(false)}>Cancelar</Button>
          </div>
        </>
      )}

      <Title level={4} className={css.gastosTitulo}>Gastos Agregados</Title>

      <div className={css.gastosLista}>
        {gastos.length === 0 ? (
          <Text type="secondary">No se han agregado gastos</Text>
        ) : (
          <div className={css.gastosScrollWrapper}>
            <Button
              onClick={() => handleButtonClick('eliminar')}
              style={{
                backgroundColor: botonActivo === 'eliminar' ? '#f5222d' : '', // Rojo cuando está activo
                color: botonActivo === 'eliminar' ? 'white' : '', // Color blanco cuando está activo
              }}
            >
              Eliminar
            </Button>
            <Button
              onClick={() => handleButtonClick('modificar')}
              style={{
                backgroundColor: botonActivo === 'modificar' ? '#1890ff' : '', // Azul cuando está activo
                color: botonActivo === 'modificar' ? 'white' : '', // Color blanco cuando está activo
              }}
            >
              Modificar
            </Button>
            <div className={css.gastosScrollContainer}>
              {gastos.map((gasto) => (
                <div key={gasto.id} className={css.gastoItem}>
                  <Card >
                    <div className={css.tipoYCheckbox}>
                      <p><strong>Tipo:</strong> {gasto.tipo}</p>
                      <Tooltip title="Marcar para un rápido acceso luego de la clasificación">
                        <Checkbox checked={gasto.marcado}/>
                      </Tooltip>
                    </div>
                    <p><strong>Fuente del gasto:</strong> {gasto.fuenteDelGasto}</p>
                    <p><strong>Monto:</strong> {gasto.monto}</p>
                    {gasto.detalle && <p><strong>Detalle:</strong> {gasto.detalle}</p>}
                    {gasto.fecha && <p><strong>Fecha:</strong> {gasto.fecha.toString()}</p>}
                    {gasto.tipo === "basico" && (
                      <>
                        <p><strong>Forma de pago:</strong> {gasto.formaDePago}</p>
                      </>
                    )}
                    {gasto.tipo === "prestamo" && (
                      <>
                        <p><strong>Cuota Actual:</strong> {gasto.cuotaActual}</p>
                        <p><strong>Total de Cuotas:</strong> {gasto.totalDeCuotas}</p>
                        <p><strong>Préstamo de:</strong> {gasto.prestamoDe}</p>
                      </>
                    )}
                    {gasto.tipo === "debito" && (
          <>
            <p><strong>Mes del Resumen:</strong> {gasto.mesDelResumen}</p>
            <p><strong>Tarjeta:</strong> {gasto.tarjeta}</p>
            <p><strong>Tipo de Tarjeta:</strong> {gasto.tipoTarjeta}</p>
            {gasto.tipoTarjeta === "Extensión" && <p><strong>A Nombre De:</strong> {gasto.aNombreDe}</p>}
            <p><strong>Banco:</strong> {gasto.banco}</p>
            <p><strong>Últimos dígitos de la Tarjeta:</strong> {gasto.numFinalTarjeta}</p>
            <p><strong>Nombre del Consumo:</strong> {gasto.nombreConsumo}</p>
          </>
        )}
                    {botonActivo === 'eliminar' && (
                      <p
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => eliminarGasto(gasto.id)}
                      >
                        Eliminar
                      </p>
                    )}
                    {botonActivo === 'modificar' && (
                      <p
                        style={{ color: 'blue', cursor: 'pointer' }}
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
        )}
      </div>
    </Card>
  );
}

export default PersonaConGastos;

