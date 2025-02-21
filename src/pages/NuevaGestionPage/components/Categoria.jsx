import { useState } from "react";
import { Tag, Modal } from "antd";
import css from "../css/Categoria.module.css";
import InputDesplegable from "../../../components/InputDesplegable";

const Categoria = ({ nombre, valores, tipo, actualizarValores, activable, validarEliminacion }) => {
  const [modoActivo, setModoActivo] = useState(null);

  const eliminarNumero = (index) => {
    const num = valores[index];
  
    if (validarEliminacion) {
      Modal.confirm({
        title: "Confirmar eliminación",
        content: `¿Seguro que quieres eliminar ${num}?`,
        onOk() {
          const nuevaLista = valores.filter((_, i) => i !== index);
          actualizarValores(nombre, nuevaLista, num, "eliminar");
        },
      });
    } else {
      const nuevaLista = valores.filter((_, i) => i !== index);
      actualizarValores(nombre, nuevaLista, num, "eliminar");
    }
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
        <InputDesplegable
          placeholder={"Ingrese " + tipo}
          onAdd={(num) => actualizarValores(nombre, [...valores, num],num, "agregar")}
          onClose={() => setModoActivo(null)}
          type="text"
        />
      )}
    </>
  );
};

export default Categoria;
