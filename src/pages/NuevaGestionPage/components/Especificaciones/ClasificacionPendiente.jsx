import { Tag } from "antd";
import css from "../../css/ClasificacionPendiente.module.css"; // Asegurate de tener estilos

const ClasificacionPendiente = ({ pendientes, titulo, tagsMovibles }) => {
  const handleDragStart = (e, valor) => {
    if (tagsMovibles) {
      e.dataTransfer.setData("text/plain", valor); // Guardamos el valor correctamente
      e.dataTransfer.setData("categoriaOrigen", "PeNdIeNTeshhh"); // Guardamos la categoría de origen
    }
  };

  return (
    <div>
      {pendientes.length > 0 && (
        <div className={css.tituloConTags}>
          <h3>{titulo}</h3>
          {pendientes.map((pendiente, index) => (
            <Tag
              key={index}
              color="orange"
              draggable
              onDragStart={(e) => handleDragStart(e, pendiente)}
              className={tagsMovibles ? css.customTag : css.staticTag}
            >
              {pendiente}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClasificacionPendiente;
