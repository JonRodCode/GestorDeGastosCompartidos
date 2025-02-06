import React, { useState } from "react";
import { Input, Button, Space, Select } from "antd";

const { Option } = Select;

const MapaGastosDeOtros = ({ titulo, claves, onAdd }) => {
  const [claveSeleccionada, setClaveSeleccionada] = useState("");
  const [valor, setValor] = useState("");

  const handleAgregar = () => {
    if (claveSeleccionada.trim() !== "" && valor.trim() !== "") {
      onAdd({ clave: claveSeleccionada, valor }); // Pasa el par clave-valor al componente padre
      setClaveSeleccionada(""); // Limpiar el campo de clave después de agregar
      setValor(""); // Limpiar el campo de valor después de agregar
    }
  };

  return (
    <div>
      <strong>{titulo}:</strong>
      <Space>
        {/* Dropdown para seleccionar la clave */}
        <Select
          value={claveSeleccionada}
          onChange={(value) => setClaveSeleccionada(value)}
          placeholder="Seleccione una clave"
        >
          {claves.map((clave, index) => (
            <Option key={index} value={clave}>
              {clave}
            </Option>
          ))}
        </Select>

        {/* Input para el valor */}
        <Input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ingrese el valor"
        />
        <Button onClick={handleAgregar} type="primary">
          Agregar
        </Button>
      </Space>
    </div>
  );
};

export default MapaInput;