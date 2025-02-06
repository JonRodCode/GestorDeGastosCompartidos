import { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import Persona from "../components/Persona";

const { Title } = Typography;

const DistribucionGastos = () => {
  const [personas, setPersonas] = useState([
    {id:1, name: "Persona1"},
    {id:2, name: "Persona2"}
  ]);

  const agregarPersona = (nombre) => {
    setPersonas(prevPersonas => [...prevPersonas, { id: prevPersonas.length + 1, name: nombre }]);
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
        <Button
          type="primary"
          className="button"
          onClick={() => agregarPersona("Nueva Persona")}
        >
          Agregar persona
        </Button>
      </div>
      <div className="info-container">
        <label className="info-label">
          Cantidad de miembros: {personas.length}
        </label>
        <label className="info-label">
          Miembros: {personas.map((persona) => persona.name + " ,")}
        </label>
      </div>
      <div>
        {personas.map((persona) => (
          <Persona key={persona.id} name={persona.name} />
        ))}
      </div>
    </div>
  );
};

export default DistribucionGastos;
