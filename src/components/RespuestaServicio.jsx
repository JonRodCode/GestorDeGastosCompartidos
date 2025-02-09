import { Card, Descriptions } from "antd";

const RespuestaServicio = ({ nuevaRespuesta }) => {
  if (!nuevaRespuesta) return null;

  return (
    <div>
      <Card title="Resumen General" style={{ marginBottom: "16px" }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Sueldo Total del Hogar">
            {nuevaRespuesta.sueldoHogar}
          </Descriptions.Item>
          <Descriptions.Item label="Gasto Equitativo">
            {nuevaRespuesta.gastoEquitativo}
          </Descriptions.Item>
          <Descriptions.Item label="Gasto Igualitario">
            {nuevaRespuesta.gastoIgualitario}
          </Descriptions.Item>
          <Descriptions.Item label="Miembros Contribuyentes">
            {nuevaRespuesta.miembrosContribuyentes}
          </Descriptions.Item>
          <Descriptions.Item label="Miembros Beneficiarios">
            {nuevaRespuesta.miembrosBeneficiarios}
          </Descriptions.Item>
          <Descriptions.Item label="Total de Miembros">
            {nuevaRespuesta.totalDeMiembros}
          </Descriptions.Item>
          <Descriptions.Item label="Ajustes de Saldos">
      {nuevaRespuesta.ajustesDeSaldos.length > 0 ? (
        <ul>
          {nuevaRespuesta.ajustesDeSaldos.map((ajuste, index) => (
            <li key={index}>{ajuste}</li>
          ))}
        </ul>
      ) : (
        "No hay ajustes"
      )}
    </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Detalles por Persona">
        {nuevaRespuesta.detallePorPersona.map((persona, index) => (
          <Card key={index} title={persona.nombre} style={{ marginBottom: "10px" }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Ganancias">{persona.ganancias.join(", ")}</Descriptions.Item>
              <Descriptions.Item label="Personas a Cargo">{persona.personasACargo}</Descriptions.Item>
              <Descriptions.Item label="Sueldo Total">{persona.sueldoTotal}</Descriptions.Item>
              <Descriptions.Item label="Porcentaje del Hogar">{persona.porcentajeCorrespondienteDelHogar.toFixed(2)}%</Descriptions.Item>
              <Descriptions.Item label="Gasto Equitativo">{persona.gastoEquitativo}</Descriptions.Item>
              <Descriptions.Item label="Gasto Igualitario">{persona.gastoIgualitario}</Descriptions.Item>
              <Descriptions.Item label="Gasto Total">{persona.gastoTotal}</Descriptions.Item>
              <Descriptions.Item label="Parte Equitativa">{persona.parteEquitativaCorrespondiente}</Descriptions.Item>
              <Descriptions.Item label="Parte Igualitaria">{persona.parteIgualitariaCorrespondiente}</Descriptions.Item>
              <Descriptions.Item label="Parte Correspondiente Total">{persona.parteCorrespondienteTotal}</Descriptions.Item>
              <Descriptions.Item label="Es Deudor">{persona.esDeudor ? "Sí" : "No"}</Descriptions.Item>
              {persona.esDeudor && (
                <>
                  <Descriptions.Item label="Debe a">
                    {persona.debeAODe.join(", ")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cantidad a Pagar">
                    {persona.cantidadAPagarORecibir.join(", ")}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default RespuestaServicio;