import React, { useState } from "react";
import { Card, Input, Button, Row, Col, Typography, Space, Tag } from "antd";
import css from "../css/Persona.module.css";
import NumeroInput from "./NumeroInput";
import MapaGastosDeOtros from "./MapaGastosDeOtros"

const { Title } = Typography;

const Persona = (props) => {
  const [ganancias, setGanancias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [personasACargo, setPersonasACargo] = useState(0);
  const [modoActivo, setModoActivo] = useState(null);
  

  return (
    <Card title={props.name} onClick={() => setModoActivo(null)}>
      <Row gutter={16}>
        {/* Sección derecha - Mostrar Ganancias en línea */}
        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("ganancia"); }}>
            <strong>Ganancia:</strong>
            <div className={css.tagsContainer}>
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
            />
          )}
        </Col>

        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("gasto"); }}>
            <strong>Gastos:</strong>
            <div className={css.tagsContainer}>
              {gastos.map((valor, index) => (
                <Tag key={index} color="red">
                  {valor}
                </Tag>
              ))}
            </div>
          </div>
          {modoActivo === "gasto" && (
            <NumeroInput
              placeholder="Ingrese un gasto"
              onAdd={(num) => setGastos([...gastos, num])}
              onClose={() => setModoActivo(null)}
            />
          )}
        </Col>
        <Col span={24}>
        <div className={css.numerosContainer}>
        <strong>Cantidad de personas a cargo:</strong>
        <div className={css.tagsContainer}>
        <Input
          value={personasACargo}
          onChange={(e) => setPersonasACargo(e.target.value)}
          placeholder="Ingrese un número"
          type="number"
        />
        </div>
        </div>
        </Col>
      </Row>
      
    </Card>
  );
};

export default Persona;