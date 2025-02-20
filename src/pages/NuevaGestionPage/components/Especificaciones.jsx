import { useState } from "react";
import { Typography, Button, Card } from "antd";
import InputDesplegable from "../../../components/InputDesplegable";
import css from "../css/Especificaciones.module.css";
import Categoria from "./Categoria";

const { Title } = Typography;

const Especificaciones = ({ especificaciones, setEspecificaciones }) => {
  const [mostrarInput, setMostrarInput] = useState(false);

  const agregarFuente = (nuevaFuente) => {
    setEspecificaciones((prev) => ({
      ...prev,
      fuenteDelGasto: {
        ...prev.fuenteDelGasto,
        [nuevaFuente]: prev.fuenteDelGasto[nuevaFuente] || [],
      },
    }));
    setMostrarInput(false);
  };

  const actualizarValores = (nombre, nuevosValores) => {
    setEspecificaciones((prev) => ({
      ...prev,
      fuenteDelGasto: {
        ...prev.fuenteDelGasto,
        [nombre]: nuevosValores,
      },
    }));
  };

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <Title level={3} className={css.cardTitle}>
          Clasificar fuentes de gasto
        </Title>
        <Button
          type="primary"
          onClick={() => setMostrarInput(true)}
          className={css.addButton}
          disabled={mostrarInput}
        >
          Agregar categoria
        </Button>
      </div>
      <hr className={css.divider} />
      {mostrarInput && (
        <InputDesplegable
          onAdd={agregarFuente}
          placeholder="Ingrese nueva categoria"
          onClose={() => setMostrarInput(false)}
          type="text"
        />
      )}
      
      <div>
        {Object.entries(especificaciones.fuenteDelGasto).map(([key, values]) => (
          <div key={key}>
            <Categoria nombre={key}
            valores={values}
            tipo="fuente de gasto"
            actualizarValores={actualizarValores}/>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Especificaciones;
