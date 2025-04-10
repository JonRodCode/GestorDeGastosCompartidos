import { useState, useRef } from "react";
import { Typography, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import MiembrosInput from "../../components/MiembrosInput";
import Persona from "./components/Persona";
import RespuestaServicio from "./components/RespuestaServicio";
import css from "./css/DistribucionPage.module.css";

const { Title } = Typography;

const DistribucionRapidaPage = () => {
  const [mostrarInputPersonas, setMostrarInputPersonas] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [miembrosDelHogar, setMiembrosDelHogar] = useState([]);
  const [eliminarPersona, setEliminarPersona] = useState(false);
  const [personaAEliminar, setPersonaAEliminar] = useState("");
  const personasRef = useRef([]);
  const [nuevaRespuesta, setNuevaRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);

  const obtenerDatosPersonas = () => {
    const nuevosDatos = [];

    personasRef.current.forEach((persona) => {
      if (persona) {
        nuevosDatos.push(persona.obtenerDatosPropios());
      }
    });
    console.log(nuevosDatos);
    return nuevosDatos;
  };

  const enviarDatos = async () => {
    setLoading(true);
    const datos = obtenerDatosPersonas();

    try {
      const response = await fetch("http://localhost:6061/resumen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const respuesta = await response.json();
        console.log("Respuesta del servidor:", respuesta);
        setNuevaRespuesta(respuesta);
      } else {
        console.error("Error en la petición");
        setNuevaRespuesta(null);
      }
    } catch (error) {
      console.error("Hubo un error:", error);
      setNuevaRespuesta(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <Title level={2} className={css.title}>
        Distribución de Gastos del Hogar
      </Title>
      <div className={css.cargarPersona}>
              <Button
                type="text"
                icon={mostrarInputPersonas ? <UpOutlined /> : <DownOutlined />}
                onClick={() => {
                  setMostrarInputPersonas(!mostrarInputPersonas);
                  setEliminarPersona(false);
                }}
              />
              <Title level={3} className={css.subtitle}>
                Cargar Gastos Por Persona
              </Title>
            </div>

            {mostrarInputPersonas && (
      <MiembrosInput
        personas={personas}
        setPersonas={setPersonas}
        miembrosDelHogar={miembrosDelHogar}
        setMiembrosDelHogar={setMiembrosDelHogar}
        eliminarPersona={eliminarPersona}
        personaAEliminar={personaAEliminar}
        setEliminarPersona={setEliminarPersona}
        setPersonaAEliminar={setPersonaAEliminar}
      />)}
      

      {/* Contenedor principal con Personas y Resumen General */}
      <div className={css.mainContainer}>
        {/* Personas */}
        <div className={css.leftSection}>
        {personas.length !== 0 ? (
  personas.map((persona, index) => (
    <Persona
      key={index}
      nombre={persona.nombre}
      miembrosHogar={miembrosDelHogar}
      ref={(el) => (personasRef.current[index] = el)}
      eliminarPersona={eliminarPersona}
      setPersonaAEliminar={setPersonaAEliminar}
    />
  ))
) : !mostrarInputPersonas && <p>Agregue una persona</p>}

          <Button type="primary" onClick={enviarDatos}>
        Enviar Datos
      </Button>
        </div>

        {/* Resumen General alineado con la primera card */}
        <div className={css.rightSection}>
          <div className={css.responseWrapper}>
            {nuevaRespuesta && (
              <RespuestaServicio nuevaRespuesta={nuevaRespuesta} />
            )}
            {!nuevaRespuesta && !loading && (
              <p>No se ha recibido respuesta aún.</p>
            )}
          </div>
        </div>
      </div>

      {/* Cargando */}
      {loading && <p>Cargando...</p>}
    </div>
  );
};

export default DistribucionRapidaPage;
