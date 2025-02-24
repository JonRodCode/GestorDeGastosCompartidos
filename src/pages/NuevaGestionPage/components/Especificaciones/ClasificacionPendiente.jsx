import { Tag } from "antd";
import css from "../../css/ClasificacionPendiente.module.css"; // Asegurate de tener estilos

const ClasificacionPendiente = ({ pendientes }) => {
    const handleDragStart = (e, valor) => {
        e.dataTransfer.setData("text/plain", valor); // Guardamos el valor correctamente
      };   
  
      return (
        <div>
          {pendientes.length > 0 && (
            <div className={css.tituloConTags}>
              <h3>Pendientes de clasificar</h3>
              {pendientes.map((pendiente, index) => (
                <Tag
                  key={index}
                  color="blue"
                  draggable
                  onDragStart={(e) => handleDragStart(e, pendiente)}
                  className={css.customTag}
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
