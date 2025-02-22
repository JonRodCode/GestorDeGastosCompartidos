import { useState } from "react";
import { Typography, Card, Tag, Button } from "antd";
import InputDesplegable from "../../../../components/InputDesplegable";
import css from "../../css/Determinador.module.css";

const { Title } = Typography;

const Determinador = ({
  especificaciones,
  setEspecificaciones,
  propiedad,
  propiedadExtraAManipular,
  pendientes,
  setPendientes,
}) => {
  const [modoMover, setModoMover] = useState(false);
  const [agregando, setAgregando] = useState(false);

  const handleDragStart = (e, valor, origen) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ valor, origen }));
  };

  const handleDrop = (e, categoriaDestino) => {
    e.preventDefault();
    const { valor, origen } = JSON.parse(e.dataTransfer.getData("text/plain"));

    // ✅ Si el modo "Mover" está apagado, solo permite mover desde "Pendientes"
    if (!modoMover && origen !== "pendientes") return;
    if (especificaciones[propiedad][categoriaDestino].includes(valor)) return;

    setEspecificaciones((prev) => {
      const nuevaCategoria = [
        ...(prev[propiedad]?.[categoriaDestino] || []),
        valor,
      ];

      let nuevasCategorias = {
        ...prev[propiedad],
        [categoriaDestino]: nuevaCategoria,
      };

      // 🔄 Si el modo "Mover" está activo, elimina el valor de su categoría original
      if (modoMover && origen !== "pendientes") {
        nuevasCategorias = {
          ...nuevasCategorias,
          [origen]: nuevasCategorias[origen].filter((item) => item !== valor),
        };
      }

      return {
        ...prev,
        [propiedad]: nuevasCategorias,
      };
    });

    if (origen === "pendientes") {
      setPendientes((prev) => prev.filter((item) => item !== valor));
    }
  };

  const agregarElemento = (nuevoElemento) => {
    if (!nuevoElemento.trim()) return; // Evita agregar elementos vacíos

    setEspecificaciones((prev) => {
      const propiedadAca = prev[propiedadExtraAManipular] || {};

      // Evita duplicados en especificaciones
      if (propiedadAca[nuevoElemento] !== undefined) return prev;

      return {
        ...prev,
        [propiedadExtraAManipular]: {
          ...propiedadAca,
          [nuevoElemento]: [], // Agrega la clave con un array vacío
        },
      };
    });

    setPendientes((prev) => {
      // Evita duplicados en pendientes y especificaciones
      if (prev.includes(nuevoElemento) || 
          (especificaciones[propiedadExtraAManipular] && especificaciones[propiedadExtraAManipular][nuevoElemento] !== undefined)) {
        return prev;
      }
      return [...prev, nuevoElemento];
    });
};
  

  const cambiarAgregando = () => {
    setAgregando((prev) => {
      const nuevoEstado = !prev;
      return nuevoEstado;
    });
  };

  return (
    <>
      <Card className={css.card}>
        <div className={css.header}>
          <Title level={3} className={css.cardTitle}>
            Determinar Categorías
          </Title>
          <div className={css.buttonsContainer}>
            {agregando && (
              <>
                <span className={css.placeholderText}>
                  Agregue una categoría
                </span>
                <Button
                  className={css.addButton}
                  onClick={cambiarAgregando}
                  danger={true}
                >
                  Cancelar
                </Button>
              </>
            )}

            {!agregando && (
              <Button className={css.addButton} onClick={cambiarAgregando}>
                Agregar categoría
              </Button>
            )}
          </div>
        </div>
        <div className={css.buttonsContainer}>
          <div>
            <Button
              type="primary"
              onClick={() => setModoMover(!modoMover)}
              disabled={modoMover}
            >
              Redeterminar
            </Button>

            {modoMover && (
              <Button
                onClick={() => setModoMover(false)}
                danger
                size="small"
                ghost
              >
                Cancelar
              </Button>
            )}
          </div>

          {agregando && (
            <InputDesplegable
              onAdd={agregarElemento}
              placeholder={""}
              onClose={() => setAgregando(false)}
              type="text"
            />
          )}
        </div>
        <div className={css.contenedor}>
          {/* Bloque Principal */}
          <div className={css.bloque}>
            {Object.keys(especificaciones[propiedad]).map((categoria) => (
              <div
                key={categoria}
                className={css.categoria}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, categoria)}
              >
                <strong>{categoria}:</strong>
                {especificaciones[propiedad][categoria].map((valor, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    className={modoMover ? css.modoMoverTag : css.customTag}
                    draggable={modoMover}
                    onDragStart={(e) => handleDragStart(e, valor, categoria)}
                  >
                    {valor}
                  </Tag>
                ))}
              </div>
            ))}
          </div>

          {/* Bloque Pendientes */}
          <div className={css.bloque}>
            <strong>Pendientes a determinar:</strong>
            {pendientes.map((valor, index) => (
              <Tag
                key={index}
                color="orange"
                className={css.modoMoverTag}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, valor, "pendientes")}
              >
                {valor}
              </Tag>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default Determinador;
