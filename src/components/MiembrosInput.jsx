import { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import css from '../css/MiembrosInput.module.css';

const MiembrosInput = ({ personas, setPersonas, miembrosDelHogar,
  setMiembrosDelHogar, eliminarPersona, personaAEliminar, setEliminarPersona,
  setPersonaAEliminar, tipoDeOperacionDePersona = "gastos" }) => {
  const [nuevaPersona, setNuevaPersona] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (personaAEliminar !== "") {
      setPersonas(prev => prev.filter(persona => persona.nombre !== personaAEliminar));
      setMiembrosDelHogar(prev => prev.filter(nombre => nombre !== personaAEliminar));
      setPersonaAEliminar("");
    }
  }, [personaAEliminar]);
  
  const agregarPersona = () => {
    const nombreLimpio = nuevaPersona.trim();
    if (!nombreLimpio) return;
    const nombreRepetido = personas.some(persona => persona.nombre.toLowerCase() === nombreLimpio.toLowerCase());

    if (nombreRepetido) {
      setModalVisible(true);
      return;
    }

    const nuevaCantidadDeMiembros = personas.length + 1;
if (tipoDeOperacionDePersona === "gastos"){
  setPersonas(prevPersonas => [...prevPersonas, { id: nuevaCantidadDeMiembros, nombre: nombreLimpio, gastos: [] }]);
}
else if (tipoDeOperacionDePersona === "ganancias") {
  setPersonas(prevPersonas => [...prevPersonas, { id: nuevaCantidadDeMiembros,
    nombre: nombreLimpio,
    gastos: false, 
    ganancias: [],
    personasACargo: 0
   }]);
}
    
    setMiembrosDelHogar(prevMiembrosDelHogar => [...prevMiembrosDelHogar, nombreLimpio]);
    setNuevaPersona("");
  };

  const activarODesactivarModoEliminarPersona = () => {
    setEliminarPersona(!eliminarPersona);
  };

  return (
    <div>
      <div className={css.buttonContainer}>
        <Input
          value={nuevaPersona}
          onChange={(e) => setNuevaPersona(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarPersona()}
          placeholder="Nueva persona"
          type="text"
          className={css.input}
        />
        <Button type="primary" className={css.button} onClick={agregarPersona}>
          Agregar persona
        </Button>
        <Button onClick={activarODesactivarModoEliminarPersona}  className={`${
                      eliminarPersona ? css.eliminarActivo : ""
                    }`}>
          Eliminar persona
        </Button>        
      </div>
      <div className={css.infoContainer}>
        <label className={css.infoLabel}>Cantidad de miembros: {personas.length}</label>
        <label className={css.infoLabel}>
          Miembros: {miembrosDelHogar.join(", ")}
        </label>
      </div>

      {/* Modal de advertencia */}
      <Modal
      title={
            <>
              <ExclamationCircleOutlined
                style={{ color: "red", marginRight: 8 }}
              />
              Nombre duplicado
            </>
          }
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Entendido"
        cancelButtonProps={{ style: { display: "none" } }} // Oculta el botón "Cancelar"
      >
        <p>Ya existe una persona con ese nombre. Por favor, elige otro.</p>
      </Modal>
    </div>
  );
};

export default MiembrosInput;
