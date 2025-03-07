import { useState } from "react";
import { Modal, Button, Card, Typography, InputNumber } from "antd";
import ButtonDesplegable from "../../../../components/ButtonDesplegable";
import css from "../css/PersonaConGanancias.module.css";
import InputGanancia from "./InputGanancia";

const { Title } = Typography;

const PersonaConGanancias = ({ persona, actualizarGanancias,actualizarPersonasACargo,
  personaIndex,eliminarPersona, setPersonaAEliminar }) => {
  const [modo, setModo] = useState("agregar");
  const [modoActivado, setModoActivado] = useState(false);
  const [gananciaEditando, setGananciaEditando] = useState(null);

  const agregarGanancia = (ganancia, fuente) => {
    if (ganancia <= 0 || fuente === "") {
      return; // Validación de los datos
    }
    // Crear el objeto ganancia
    const nuevaGanancia = { monto: parseFloat(ganancia), fuente };

    // Llamar a la función para actualizar las ganancias de la persona
    actualizarGanancias(persona.nombre, nuevaGanancia);
  };

  const seleccionarGanancia = (ganancia, index) => {
    setGananciaEditando([index, ganancia]);
  };

  const cancelarAccion = () => {
    setModoActivado(false);
  };

  const modificarGanancia = (monto, fuente) => {
    actualizarGanancias(
      persona.nombre,
      { monto, fuente },
      "modificar",
      gananciaEditando[0]
    );
    setGananciaEditando(null);
  };

  const eliminarGanancia = (ganancia, index) => {
    Modal.confirm({
      title: "Confirmar eliminación",
      content: (
        <>
          <p>Estas por eliminar la ganancia:</p>
          <p>
            {ganancia.fuente}: ${ganancia.monto}
          </p>
          <p>¿Seguro que la quieres eliminar?</p>
        </>
      ),
      okText: "Sí, Eliminar",
      cancelText: "Cancelar",
      onOk: () => {
        actualizarGanancias(persona.nombre, ganancia, "eliminar", index);
      },
      onCancel: () => {
        console.log("Cancelado");
      },
    });
  };

  const handleChange = (value) => {
    actualizarPersonasACargo(value, personaIndex); 
  };

  const tieneGastosLaPersona = () => {
      if (persona.gastos) return true;
      else return false;
  };

  const eliminarPersonaCompletamente = () => {
    if (tieneGastosLaPersona()){
      Modal.info({
        title: "No se puede eliminar esta persona",
        content: <>
        <p>No puedes eliminar a {persona.nombre} porque tiene gastos registrados.</p>
        <p>Solo es posible eliminar a personas que no tengan ningún gasto asociado.</p>
        </>,
        okText: "Entiendo" 
      });
    }

    else {
    Modal.confirm({
      title: "Confirmar eliminación",
      content: `¿Estás seguro de que quieres eliminar a ${persona.nombre}?`,
      okText: "Eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      onOk: () => {
        setPersonaAEliminar(persona.nombre);             
      }      
    });}
  };

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <div>
        <div className={css.contenedorPersona}>
         <span className={css.cardTitle}>{persona.nombre}</span>
          {eliminarPersona && (
                       <p className={css.eliminarPersona}
                       onClick={eliminarPersonaCompletamente}>Eliminar</p>
                     )}
                     </div>
         {!persona.gastos && (
         <span>(no tiene gastos)</span>
         )}
</div>
        <ButtonDesplegable
          modo={modo}
          setModo={setModo}
          modoActivado={modoActivado}
          setModoActivado={setModoActivado}
          elementoEnSingular={"ganancias"}
        />

        {/* Inputs para agregar ganancia */}
      </div>
      <div className={css.buttonsContainer}>
        {modoActivado && modo === "agregar" && (
          <InputGanancia
            onAdd={agregarGanancia}
            onClose={() => setModoActivado(false)}
            estatico={true}
          />
        )}
        {modoActivado && modo !== "agregar" && (
          <span className={css.placeholderText}>Seleccione una ganancia:</span>
        )}
        {modoActivado && (
          <Button onClick={cancelarAccion} danger>
            Cancelar
          </Button>
        )}
      </div>
      <hr className={css.divider} />
      {/* Mostrar las ganancias */}
      <div style={{ marginTop: 20 }}>
      <Title level={4} >
          Ganancias: 
        </Title>
        {gananciaEditando ? (
          <div className={css.gananciaItem}>
          <InputGanancia
            onAdd={modificarGanancia}
            valorMonto={gananciaEditando[1].monto}
            valorFuente={gananciaEditando[1].fuente}
            onClose={() => setGananciaEditando(null)}
          />
          </div>
        ) : persona.ganancias.length > 0 ? (
          <ul>
            {persona.ganancias.map((ganancia, index) => (
             <li key={index} className={css.gananciaItem}>
              <div className={css.contenedor}>
             <div className={css.gananciaInfo}>
               <span className={css.gananciaFuente}>{ganancia.fuente}:</span>
               <span className={css.gananciaMonto}>${ganancia.monto}</span>
             </div>
             <div className={css.botonesAccion}>
          {modoActivado && modo === "modificar" && (
            <span
              style={{
                color: "blue",
                cursor: "pointer",
              }}
              onClick={() => seleccionarGanancia(ganancia, index)}
            >
              Seleccionar
            </span>
          )}
          {modoActivado && modo === "eliminar" && (
            <span
              style={{
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => eliminarGanancia(ganancia, index)}
            >
              Eliminar
            </span>
          )}
        </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay ganancias agregadas.</p>
        )}
      </div>
      <hr className={css.divider} />
      <div className={css.personasACargo}>
      <Title level={4} >
      Personas a Cargo: 
        </Title>
      <InputNumber
        min={0}
        max={20}
        value={persona.personasACargo}
        onChange={handleChange} // Puedes ajustar el ancho según lo necesites
        step={1} // Solo permite enteros
      />
    </div>
    </Card>
  );
};

export default PersonaConGanancias;
