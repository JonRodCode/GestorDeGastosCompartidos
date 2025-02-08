import { useEffect, useState, useRef } from "react";
import { Button, Typography, Input } from "antd";
import Persona from "../components/Persona";

const { Title } = Typography;

const DistribucionGastos = () => {
  const [personas, setPersonas] = useState([]);
  const [miembrosDelHogar, setMiembrosDelHogar] = useState([])
  const [nuevaPersona, setNuevaPersona] = useState("");
  const personasRef = useRef([]);
  const [nuevaRespuesta, setNuevaRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);

  const agregarPersona = (nuevaPersona) => {
    const nuevaCantidadDeMiembros = personas.length +1;
    setPersonas(prevPersonas => [...prevPersonas, { id: nuevaCantidadDeMiembros, nombre: nuevaPersona}]);
    setMiembrosDelHogar(prevMiembrosDelHogar => [...prevMiembrosDelHogar, nuevaPersona]);
    setNuevaPersona("");
  };  

  const obtenerDatosPersonas = () => {
    const nuevosDatos = [];

    personasRef.current.forEach((persona) => {
      if (persona){
        nuevosDatos.push(persona.obtenerDatosPropios());
      }
    });
    console.log(nuevosDatos)
    return nuevosDatos;
  };

  const enviarDatos = async () => {
    setLoading(true);
    const datos = obtenerDatosPersonas(); // Obtener los datos actualizados de las personas
    // Hacemos la petición POST
    try {
      const response = await fetch("http://localhost:6061/resumen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {
        const respuesta = await response.json();
        console.log("Respuesta del servidor:", respuesta);
        setNuevaRespuesta(respuesta)
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
    <div className="container">
      <Title level={2} className="title">
        Distribución de Gastos del Hogar
      </Title>
      <Title level={3} className="subtitle">
        Cargar Gastos Por Persona
      </Title>
      <div className="button-container">
      <Input
        value={nuevaPersona}
        onChange={(e) => setNuevaPersona(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && agregarPersona(nuevaPersona)}
        placeholder="Nueva persona"
        type="text"
        className='input'
      />
        <Button
          type="primary"
          className="button"
          onClick={() => agregarPersona(nuevaPersona)}
        >
          Agregar persona
        </Button>
      </div>
      <div className="info-container">
        <label className="info-label">
          Cantidad de miembros: {personas.length}
        </label>
        <label className="info-label">
          Miembros: {personas.map((persona) => persona.nombre + " ,")}
        </label>
      </div>
      <div>
        {personas.length !== 0 ? (personas.map((persona, index) => (
          <Persona
            key={index}
            nombre={persona.nombre}
            miembrosHogar={miembrosDelHogar}
            ref={(el) => personasRef.current[index] = el}
            />            
        ))) : <p>Agregue una persona</p>}
      </div>
      <Button type="primary" onClick={enviarDatos}>Enviar Datos</Button>
      {loading && <p>Cargando...</p>} {/* Si la respuesta está en proceso de carga */}
  
  {nuevaRespuesta && (
    <div>
      <h3>Respuesta del servidor:</h3>
      {/*<pre>{JSON.stringify(nuevaRespuesta, null, 2)}</pre>  Muestra la respuesta en formato legible */}
      <p>{nuevaRespuesta.ajustesDeSaldos}</p> 
    </div>
  )}

  {!nuevaRespuesta && !loading && (
    <p>No se ha recibido respuesta aún.</p> // Mensaje si no hay respuesta y no está cargando
  )}
    </div>

  );
};

export default DistribucionGastos;
