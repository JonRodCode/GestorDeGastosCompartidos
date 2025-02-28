import { useState, useEffect } from "react";
import { Tag, Modal } from "antd";
import css from "../../css/Categoria.module.css";
import InputDesplegable from "../../../../components/InputDesplegable";

const Categoria = ({
  nombre,
  valores,
  tipo,
  actualizarValores,
  actualizarCategoriasYFuentes,
  activable,
  validarEliminacion,
  esUnValorValido,
  fraseDeEliminacion = "",
  setPendientes,
  elementosEnUso = {},
  accionarTrasReclasificar = false,
  temaCentral = "elemento",
  setElementoAReclasificar,
}) => {
  const [modoActivo, setModoActivo] = useState(null);
  const [ejecutarReclasificacion, setEjecutarReclasificacion] = useState(false);
  const [nuevoValor, setNuevoValor] = useState([]);
  const validarEnFuentesDeGastos = (num) => {
    if (Object.keys(elementosEnUso).includes(num)) {
      const vecesEnUso = elementosEnUso[num];

      Modal.warning({
        title: "Elemento en uso",
        content: `No se puede borrar "${num}" porque se encuentra en uso en ${
          vecesEnUso + " " + temaCentral
        }${vecesEnUso > 1 ? "s" : ""}.`,
      });

      return true; // Indica que el elemento está en uso
    }

    return false; // Indica que el elemento no está en uso
  };

  const eliminarNumero = (index) => {
    const num = valores[index];

    if (validarEnFuentesDeGastos(num)) {
      return;
    }

    if (validarEliminacion) {
      Modal.confirm({
        title: "Confirmar eliminación",
        okText: "Sí, eliminar",
        cancelText: "Cancelar",
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

  const handleDragStart = (e, valor) => {
    e.dataTransfer.setData("text/plain", valor);
    e.dataTransfer.setData("categoriaOrigen", nombre);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const valor = e.dataTransfer.getData("text/plain").trim(); // Recuperamos el valor
    const categoriaDePartida = e.dataTransfer.getData("categoriaOrigen").trim();

    if (!valor) return; // Evitar valores vacíos
    if (!esUnValorValido(valor)) {
      return;
    }
    if (valores.includes(valor)) return; // Evitar duplicados dentro de la misma categoría

    if (categoriaDePartida === "PeNdIeNTeshhh") {
      actualizarValores(nombre, [...valores, valor], valor, "agregar");
      // Remover de pendientes
      setPendientes((prev) => prev.filter((item) => item !== valor));
      setNuevoValor([valor, nombre]);
      return;
    }

    else if (categoriaDePartida !== nombre) {
      
      if (
        accionarTrasReclasificar &&
        Object.keys(elementosEnUso).includes(valor)
      ) {
        console.log("ACAAAANOOOO")
        const vecesEnUso = elementosEnUso[valor];
        Modal.confirm({
          title: "Confirmar reclasificación",
          okText: "Continuar",
          cancelText: "Cancelar",
          content: (
            <>
              <p>
                {'"'}
                {valor}
                {'"'} está en uso en {vecesEnUso} {temaCentral}
                {vecesEnUso > 1 ? "s" : ""}.
              </p>
              <p>
                Si continúa, se reclasificará y actualizará en todas sus
                apariciones.
              </p>
            </>
          ),
          onOk() {
            setEjecutarReclasificacion(true); 
              actualizarCategoriasYFuentes(
                categoriaDePartida,
                nombre,
                [...valores, valor],
                valor
              );
            // Remover de pendientes
            setNuevoValor([valor, nombre]);
          },
          onCancel() {
            return;
          },
        });
      }
      else{
        actualizarCategoriasYFuentes(
          categoriaDePartida,
          nombre,
          [...valores, valor],
          valor
        );
      // Remover de pendientes
      setNuevoValor([valor, nombre]);

      }
    } 
  };
  useEffect(() => {
    if (ejecutarReclasificacion) {
      setElementoAReclasificar(nuevoValor);
      setEjecutarReclasificacion(false); // Resetear para evitar ejecuciones repetidas
    }
  }, [ejecutarReclasificacion]);

  return (
    <>
      <div
        className={css.tituloConTags}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
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
            draggable
            onDragStart={(e) => handleDragStart(e, valor)}
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
