import { useState } from "react";
import { Typography, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import css from "../css/Personas.module.css";
import MiembrosInput from "../../../../components/MiembrosInput";
import PersonaConGanancias from "./PersonaConGanancias";

const { Title } = Typography;

const Personas = ({ listaDePersonas, setListaDePersonas }) => {
  const [miembrosDelHogar, setMiembrosDelHogar] = useState(
    Object.values(listaDePersonas).map((persona) => persona.nombre)
  );
  const [eliminarPersona, setEliminarPersona] = useState(false);
  const [personaAEliminar, setPersonaAEliminar] = useState("");
  const [mostrarInputPersonas, setMostrarInputPersonas] = useState(false);

  const actualizarGanancias = (
    nombrePersona,
    nuevaGanancia,
    accion = "agregar",
    index = null
  ) => {
    const nuevasPersonas = listaDePersonas.map((persona) => {
      if (persona.nombre === nombrePersona) {
        let nuevasGanancias;

        if (accion === "agregar") {
          // Agregar una nueva ganancia al final
          nuevasGanancias = [...persona.ganancias, nuevaGanancia];
        } else if (accion === "modificar" && index !== null) {
          // Modificar una ganancia existente en el índice indicado
          nuevasGanancias = persona.ganancias.map((ganancia, idx) =>
            idx === index ? { ...ganancia, ...nuevaGanancia } : ganancia
          );
        } else if (accion === "eliminar" && index !== null) {
          // Eliminar una ganancia en el índice indicado
          nuevasGanancias = persona.ganancias.filter((_, idx) => idx !== index);
        } else {
          // Si la acción no es válida, no modificar nada
          return persona;
        }

        // Retornar persona con las ganancias actualizadas
        return {
          ...persona,
          ganancias: nuevasGanancias,
        };
      }
      return persona;
    });

    // Actualizar el estado con las nuevas personas
    setListaDePersonas(nuevasPersonas);
  };

  // Función para actualizar las personas a cargo de una persona
  const actualizarPersonasACargo = (value, index) => {
    const nuevasPersonas = [...listaDePersonas];
    nuevasPersonas[index].personasACargo = value;
    setListaDePersonas(nuevasPersonas);
  };

  return (
    <>
      <div className={css.cargarPersona}>
        <Button
          type="text"
          icon={mostrarInputPersonas ? <UpOutlined /> : <DownOutlined />}
          onClick={() => {
            setMostrarInputPersonas(!mostrarInputPersonas);
            setEliminarPersona(false);
          }}
        />
        <Title level={3} >
          Definir datos de Personas
        </Title>
      </div>

      {mostrarInputPersonas && (
        <MiembrosInput
          personas={listaDePersonas}
          setPersonas={setListaDePersonas}
          miembrosDelHogar={miembrosDelHogar}
          setMiembrosDelHogar={setMiembrosDelHogar}
          eliminarPersona={eliminarPersona}
          personaAEliminar={personaAEliminar}
          setEliminarPersona={setEliminarPersona}
          setPersonaAEliminar={setPersonaAEliminar}
          tipoDeOperacionDePersona={"ganancias"}
        />
      )}

      <div className={css.container}>
        {listaDePersonas.map((persona, index) => (
          <PersonaConGanancias
            key={index}
            persona={persona}
            actualizarGanancias={actualizarGanancias}
            actualizarPersonasACargo={actualizarPersonasACargo}
            personaIndex={index} // Pasa el índice aquí
            eliminarPersona={eliminarPersona}
            setPersonaAEliminar={setPersonaAEliminar}
          />
        ))}
      </div>
    </>
  );
};

export default Personas;
