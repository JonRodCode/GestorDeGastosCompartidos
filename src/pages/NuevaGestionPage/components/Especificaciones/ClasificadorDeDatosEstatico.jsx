import { Typography, Card, Modal } from "antd";
import css from "../../css/ClasificadorDeDatos.module.css";
import Categoria from "./Categoria";
import ClasificacionPendiente from "./clasificacionPendiente";

const { Title } = Typography;

const ClasificadorDeDatosEstatico = ({
  especificaciones,
  setEspecificaciones,
  propiedad,
  pendientes,
  setPendientes,
  elementosEnUso,
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

  const esUnValorValido = (valor) => {
    return (
        (especificaciones[propiedad] &&
            Object.values(especificaciones[propiedad]).some(arr => arr.includes(valor))) ||
            pendientes.includes(valor) // Aceptar también valores de pendientes
    );
  };
  const actualizarCategoriasYValores = (categoria, nombre, nuevosValores, num) => {
    setEspecificaciones((prev) => {
      // 1. Eliminar el valor de la categoría actual
      const valoresActuales = prev[propiedad][categoria] || [];
      const nuevosValoresCategoria = valoresActuales .filter((item) => item !== num);

     
      // 3. Crear la nueva especificación con todos los cambios
      const nuevaEspecificacion = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          [categoria]: nuevosValoresCategoria,  // Categoría sin el valor eliminado
          [nombre]: nuevosValores,  // Nueva categoría con el valor agregado
        }
      };

      return nuevaEspecificacion;
    });
};

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <Title level={3} className={css.cardTitle}>
          Clasificar {config.elementoAClasificar}
        </Title>
      </div>
      <ClasificacionPendiente
        pendientes={pendientes}
        setPendientes={setPendientes}
      />

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
              actualizarCategoriasYFuentes={actualizarCategoriasYValores}
              activable={true}
              esUnValorValido={esUnValorValido}
              validarEliminacion={true}
              setPendientes={setPendientes}
              elementosEnUso={elementosEnUso}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ClasificadorDeDatosEstatico;
