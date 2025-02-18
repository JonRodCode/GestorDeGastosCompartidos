import { useState } from 'react';
import { Input, Button } from 'antd';
import css from '../css/MiembrosInput.module.css';

const MiembrosInput = ({ personas, setPersonas, miembrosDelHogar, setMiembrosDelHogar }) => {
  const [nuevaPersona, setNuevaPersona] = useState("");

  const agregarPersona = () => {
    if (!nuevaPersona.trim()) return;
    const nuevaCantidadDeMiembros = personas.length + 1;
    setPersonas(prevPersonas => [...prevPersonas, { id: nuevaCantidadDeMiembros, nombre: nuevaPersona }]);
    setMiembrosDelHogar(prevMiembrosDelHogar => [...prevMiembrosDelHogar, nuevaPersona]);
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
    </div>
  );
};

export default MiembrosInput;