import  { useState } from "react";
import { Tag } from "antd";
import NumeroInput from "../../../components/NumeroInput";
import css from "../css/GastosDeOtros.module.css";


const GastosDeOtros = ({ items, onChange }) => {
  const [numeros, setNumeros] = useState({}); // Almacena los números de cada item
  const [itemSeleccionado, setItemSeleccionado] = useState(null); // Controla qué input está abierto
  
  // Función para agregar un número a un ítem específico
  const agregarNumero = (item, numero) => {
    setNumeros((prev) => {
      const nuevoEstado = {
        ...prev,
        [item]: [...(prev[item] || []), numero],
      };
      onChange?.(nuevoEstado); // Notifica al padre
      return nuevoEstado;
    });
  };

  const eliminarNumero = (item, index) => {
    setNumeros((prev) => {
      const nuevaListaDeNumeros = [...prev[item]];
      nuevaListaDeNumeros.splice(index, 1);
      const nuevoEstado = {
        ...prev,
        [item]: nuevaListaDeNumeros,
      };
      onChange?.(nuevoEstado); // Notifica al padre
      return nuevoEstado;
    });
  };

  return (
    <div className={css.container}>
  {items.map((item, index) => (
    <div key={index} className={css.item} onClick={(e) => { 
      e.stopPropagation(); 
      setItemSeleccionado(itemSeleccionado === item ? null : item);
    }}>
      <div className={css.itemHeader}>
        <span>{item}:</span>
        <div className={css.tagsContainer}>
          {(numeros[item] || []).map((num, index) => (
            <Tag key={index} color="blue" onClick={() => eliminarNumero(item, index)}>{num}</Tag>
          ))}
        </div>
      </div>

      {itemSeleccionado === item && (
        <div className={css.visible}>
          <NumeroInput onAdd={(numero) => agregarNumero(item, numero)} placeholder="Agregar número" onClose={() => setItemSeleccionado(null)} />
        </div>
      )}
    </div>
  ))}
</div>
  );
};

export default GastosDeOtros;