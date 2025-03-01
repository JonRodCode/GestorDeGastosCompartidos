import { useState } from 'react';
import { Input, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import css from '../css/MiembrosInput.module.css';

const MiembrosInput = ({ personas, setPersonas, miembrosDelHogar, setMiembrosDelHogar }) => {
  const [nuevaPersona, setNuevaPersona] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  
  const agregarPersona = () => {
    const nombreLimpio = nuevaPersona.trim();
    if (!nombreLimpio) return;

    const nombreRepetido = personas.some(persona => persona.nombre.toLowerCase() === nombreLimpio.toLowerCase());

    if (nombreRepetido) {
      setModalVisible(true);
      return;
    }

    const nuevaCantidadDeMiembros = personas.length + 1;
    setPersonas(prevPersonas => [...prevPersonas, { id: nuevaCantidadDeMiembros, nombre: nombreLimpio, gastos: [] }]);
    setMiembrosDelHogar(prevMiembrosDelHogar => [...prevMiembrosDelHogar, nombreLimpio]);
    setNuevaPersona("");
  };

  const eliminarUltimaPersona = () => {
    if (personas.length === 0) return;
    const ultimaPersona = personas[personas.length - 1];
    setPersonas(prevPersonas => prevPersonas.slice(0, -1));
    setMiembrosDelHogar(prevMiembrosDelHogar => prevMiembrosDelHogar.filter(nombre => nombre !== ultimaPersona.nombre));
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
        <Button type="primary" className={css.button} onClick={eliminarUltimaPersona}>
          Eliminar última persona
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
