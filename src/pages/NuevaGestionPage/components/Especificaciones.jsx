import { useState } from 'react';
import { Tag } from "antd";
import NumeroInput from "../../../components/InputDesplegable";
import css from "../css/Especificaciones.module.css";

const Especificaciones = () => {
    const [ganancias, setGanancias] = useState([]);
    const [modoActivo, setModoActivo] = useState(null);

  return (
    <>
        <div onClick={(e) => { e.stopPropagation(); setModoActivo("ganancia"); }}>
        <div className={css.tituloConTags}>
              <strong>Ganancia:</strong>
              {ganancias.map((valor, index) => (
      <Tag key={index} color="blue">
        {valor}
      </Tag>
    ))}
              </div>
              </div>
              {modoActivo === "ganancia" && (
            <NumeroInput
              placeholder="Ingrese una ganancia"
              onAdd={(num) => setGanancias([...ganancias, num])}
              onClose={() => setModoActivo(null)}
              type="text"
            />
          )}
    </>
  );
};

export default Especificaciones;