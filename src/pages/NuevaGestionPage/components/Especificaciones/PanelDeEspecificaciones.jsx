import { Card, Col, Row, Tag } from "antd";
import css from "../../css/PanelDeEspecificaciones.module.css"; // Archivo de estilos separado
const EstructuraDatos = ({ especificaciones }) => {
  const { fuenteDelGasto, categorias, determinaciones } = especificaciones;

  return (
    <div className={css.container}>
      <Row gutter={[16, 16]}>
        {/* 🔹 Columna de Determinaciones */}
        <Col span={8}>
          <Card title="Determinaciones" bordered={false} className={css.card}>
            {Object.keys(determinaciones).map((determinacion) => (
              <Card
                key={determinacion}
                type="inner"
                title={determinacion}
                className={css.subCard}
              >
                {determinaciones[determinacion].length > 0 ? (
                  determinaciones[determinacion].map((categoria) => (
                    <Tag color="red" key={categoria}>
                      {categoria}
                    </Tag>
                  ))
                ) : (
                  <Tag color="gray">Sin datos</Tag>
                )}
              </Card>
            ))}
          </Card>
        </Col>

        {/* 🔹 Columna de Categorías */}
        <Col span={8}>
          <Card title="Categorías" bordered={false} className={css.card}>
            {
            Object.keys(fuenteDelGasto).length > 0 ? (
            Object.keys(categorias).map((categoria) => (
              <Card
                key={categoria}
                type="inner"
                title={categoria}
                className={css.subCard}
              >
                {categorias[categoria].length > 0 ? (
                  categorias[categoria].map((fuente) => (
                    <Tag color="green" key={fuente}>
                      {fuente}
                    </Tag>
                  ))
                ) : (
                  <Tag color="gray">Sin datos</Tag>
                )}
              </Card>
            ))
          ) : (
            <div className={css.noDataContainer}>
    <Tag color="gray">Sin datos</Tag>
  </div>)}
          </Card>
        </Col>
        {/* 🔹 Columna de Fuentes de Gasto */}
        <Col span={8}>
          <Card title="Fuentes de Gasto" bordered={false} className={css.card}>
            {
            Object.keys(fuenteDelGasto).length > 0 ? (
            Object.keys(fuenteDelGasto).map((fuente) => (
              <Card
                key={fuente}
                type="inner"
                title={fuente}
                className={css.subCard}
              >
                {fuenteDelGasto[fuente].length > 0 ? (
                  fuenteDelGasto[fuente].map((alias) => (
                    <Tag color="blue" key={alias}>
                      {alias}
                    </Tag>
                  ))
                ) : (
                  <Tag color="gray">Sin datos</Tag>
                )}
              </Card>
            ))
          ) : (
            <div className={css.noDataContainer}>
    <Tag color="gray">Sin datos</Tag>
  </div>)
          }
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EstructuraDatos;
