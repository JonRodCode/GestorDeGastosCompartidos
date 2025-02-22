import { Typography, Card} from "antd";
import css from "../../css/ClasificadorDeDatos.module.css";
import Categoria from "./Categoria";

const { Title } = Typography;

const ClasificadorDeDatosEstatico = ({
  especificaciones,
  setEspecificaciones,
  propiedad,
  config,
}) => {
  
   const actualizarValores = (nombre, nuevosValores) => {
    setEspecificaciones((prev) => ({
      ...prev,
      [propiedad]: {
        ...prev[propiedad],
        [nombre]: nuevosValores,
      },
    }));
  };  

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <Title level={3} className={css.cardTitle}>
          Clasificar {config.elementoAClasificar}
        </Title>        
      </div>

      <div className={css.buttonsContainer}>
        {(Object.keys(especificaciones[propiedad]).length === 0 ? (
            <span className={css.placeholderText}>
              No hay {config.temaDeClasificacionEnPlural } agregad{config.letra}s
            </span>
          ) : (
            <span className={css.placeholderText}>
              Lista de {config.temaDeClasificacionEnPlural }:
            </span>
          ))}    
      </div>

      <hr className={css.divider} />
      <div>
        {Object.entries(especificaciones[propiedad]).map(([key, values]) => (
          <div key={key} className={css.categoriaContainer}>
            
              <Categoria
                nombre={key}
                valores={values}
                tipo={config.elementoEnSingular }
                actualizarValores={actualizarValores}
                activable={true}                
                validarEliminacion={true}
              />                 
          </div>
        ))}
      </div>      
    </Card>
  );
};

export default ClasificadorDeDatosEstatico;