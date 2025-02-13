import  { useState, useImperativeHandle, forwardRef } from "react";
import { Tag } from "antd";
import NumeroInput from "./NumeroInput";
import css from "../css/GastosDeOtros.module.css";


const GastosDeOtros = forwardRef(({ items }, ref) => {
  const [numeros, setNumeros] = useState({}); // Almacena los números de cada item
  const [itemSeleccionado, setItemSeleccionado] = useState(null); // Controla qué input está abierto
  
  // Función para agregar un número a un ítem específico
  const agregarNumero = (item, numero) => {
    setNumeros((prev) => ({
      ...prev,
      [item]: [...(prev[item] || []), numero],
    }));
  };

  const eliminarNumero = (item, index) =>{
    const nuevaListaDeNumeros = [...numeros[item]];
    nuevaListaDeNumeros.splice(index,1);
    setNumeros(prevNumeros => ({
      ...prevNumeros,
      [item] : nuevaListaDeNumeros,
    }));
  };

  useImperativeHandle(ref, () => ({
    obtenerDatos() {
      return numeros;
    }
  }));

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
});

GastosDeOtros.displayName = "GastosDeOtros";

export default GastosDeOtros;