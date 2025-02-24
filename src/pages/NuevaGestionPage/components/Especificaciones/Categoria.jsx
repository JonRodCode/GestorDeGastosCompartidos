import { useState } from "react";
import { Tag, Modal } from "antd";
import css from "../../css/Categoria.module.css";
import InputDesplegable from "../../../../components/InputDesplegable";

const Categoria = ({
  nombre,
  valores,
  tipo,
  actualizarValores,
  activable,
  validarEliminacion,
  fraseDeEliminacion,
  setPendientes
  
}) => {
  const [modoActivo, setModoActivo] = useState(null);

  const eliminarNumero = (index) => {
    const num = valores[index];

    if (validarEliminacion) {
      Modal.confirm({
        title: "Confirmar eliminación",
        content: (
          <>
            <p>{fraseDeEliminacion}</p>
            <p>¿Seguro que quieres eliminar {num}?</p>
          </>
        ),
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

  const handleDrop = (e) => {
    e.preventDefault();
    const valor = e.dataTransfer.getData("text/plain").trim(); // Recuperamos el valor

    if (!valor) return; // Evitar valores vacíos
    if (valores.includes(valor)) return; // Evitar duplicados dentro de la misma categoría

    // Agregar a la categoría
    actualizarValores(nombre, [...valores, valor], valor, "agregar");

    // Remover de pendientes
    setPendientes((prev) => prev.filter((item) => item !== valor));
  };

  return (
    <>
      <div className={css.tituloConTags}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}>
        
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (activable) setModoActivo("datos");
          }}
        >
          <strong>{nombre}:</strong>
        </div>
        {valores.map((valor, index) => (
          <Tag
            key={index}
            color="blue"
            className={css.customTag}
            onClick={() => eliminarNumero(index)}
          >
            {valor}
          </Tag>
        ))}
      </div>

      {modoActivo === "datos" && activable && (
        <InputDesplegable
          placeholder={"Ingrese " + tipo}
          onAdd={(num) =>
            actualizarValores(nombre, [...valores, num], num, "agregar")
          }
          onClose={() => setModoActivo(null)}
          type="text"
        />
      )}
    </>
  );
};

export default Categoria;
