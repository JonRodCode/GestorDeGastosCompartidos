import { Typography, Card, Modal } from "antd";
import css from "../../css/ClasificadorDeDatos.module.css";
import Categoria from "./Categoria";

const { Title } = Typography;

const ClasificadorDeDatosEstatico = ({
  especificaciones,
  setEspecificaciones,
  propiedad,
  config,
}) => {
  const actualizarValores = (nombre, nuevaLista, num, accion) => {
    setEspecificaciones((prev) => {
      // Buscar si el número ya existe en alguna categoría
      const existeEn = Object.entries(prev[propiedad])
        .filter(([, arr]) => arr.includes(num))
        .map(([categoria]) => categoria);

      if (accion === "agregar" && existeEn.length > 0) {
        Modal.warning({
          title: "Elemento duplicado",
          content: `El elemento "${num}" ya existe en: ${existeEn.join(", ")}.`,
        });
        return prev; // No actualiza el estado
      }

      return {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          [nombre]: nuevaLista,
        },
      };
    });
  };

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <Title level={3} className={css.cardTitle}>
          Clasificar {config.elementoAClasificar}
        </Title>
      </div>

      <div className={css.buttonsContainer}>
        {Object.keys(especificaciones[propiedad]).length === 0 ? (
          <span className={css.placeholderText}>
            No hay {config.temaDeClasificacionEnPlural} agregad{config.letra}s
          </span>
        ) : (
          <span className={css.placeholderText}>
            Lista de {config.temaDeClasificacionEnPlural}:
          </span>
        )}
      </div>

      <hr className={css.divider} />
      <div>
        {Object.entries(especificaciones[propiedad]).map(([key, values]) => (
          <div key={key} className={css.categoriaContainer}>
            <Categoria
              nombre={key}
              valores={values}
              tipo={config.elementoEnSingular}
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
