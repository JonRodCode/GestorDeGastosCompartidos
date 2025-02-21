import { useState } from "react";
import { Tag } from "antd";
import NumeroInput from "../../../components/InputDesplegable";
import css from "../css/Categoria.module.css";

const Categoria = ({ nombre, valores, tipo, actualizarValores, activable }) => {
  const [modoActivo, setModoActivo] = useState(null);

  const eliminarNumero = (index) => {
    const nuevaLista = valores.filter((_, i) => i !== index);
    actualizarValores(nombre, nuevaLista);
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (activable) setModoActivo("datos");
        }}
      >
        <div className={css.tituloConTags}>
          <strong>{nombre}:</strong>
          {valores.map((valor, index) => (
            <Tag key={index} color="blue" className={css.customTag} onClick={() => eliminarNumero(index)}>
            {valor}
          </Tag>
          
          ))}
        </div>
      </div>
      {modoActivo === "datos" && activable && (
        <NumeroInput
          placeholder={"Ingrese " + tipo}
          onAdd={(num) => actualizarValores(nombre, [...valores, num])}
          onClose={() => setModoActivo(null)}
          type="text"
        />
      )}
    </>
  );
};

export default Categoria;
