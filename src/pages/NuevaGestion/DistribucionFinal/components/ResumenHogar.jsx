import { Card, Descriptions } from "antd";
import css from "../css/ResumenHogar.module.css";

const ResumenHogar = ({resumen}) => {

    return (
        <>
         <Card >
           <Descriptions column={1} bordered>
            <Descriptions.Item label="Sueldo Total del Hogar">
              {resumen.sueldoHogar}
            </Descriptions.Item>
            <Descriptions.Item label="Gasto Equitativo">
              {resumen.gastoEquitativo}
            </Descriptions.Item>
            <Descriptions.Item label="Gasto Igualitario">
              {resumen.gastoIgualitario}
            </Descriptions.Item>
            <Descriptions.Item label="Miembros Contribuyentes">
              {resumen.miembrosContribuyentes}
            </Descriptions.Item>
            <Descriptions.Item label="Miembros Beneficiarios">
              {resumen.miembrosBeneficiarios}
            </Descriptions.Item>
            <Descriptions.Item label="Total de Miembros">
              {resumen.totalDeMiembros}
            </Descriptions.Item>
            <Descriptions.Item label="Ajustes de Saldos">
              {resumen.ajustesDeSaldos.length > 0 ? (
                <ul>
                  {resumen.ajustesDeSaldos.map((ajuste, index) => (
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
          {resumen.detallePorPersona.map((persona, index) => (
            <Card
              key={index}
              title={persona.nombre}
              style={{ marginBottom: "10px" }}
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Ganancias">
                  {persona.ganancias.join(", ")}
                </Descriptions.Item>
                <Descriptions.Item label="Personas a Cargo">
                  {persona.personasACargo}
                </Descriptions.Item>
                <Descriptions.Item label="Sueldo Total">
                  {persona.sueldoTotal}
                </Descriptions.Item>
                <Descriptions.Item label="Porcentaje del Hogar">
                  {persona.porcentajeCorrespondienteDelHogar
                    ? Number(persona.porcentajeCorrespondienteDelHogar).toFixed(
                        2
                      )
                    : "0.00"}
                  %
                </Descriptions.Item>
                <Descriptions.Item label="Gasto Equitativo">
                  {persona.gastoEquitativo}
                </Descriptions.Item>
                <Descriptions.Item label="Gasto Igualitario">
                  {persona.gastoIgualitario}
                </Descriptions.Item>
                <Descriptions.Item label="Gasto Total">
                  {persona.gastoTotal}
                </Descriptions.Item>
                <Descriptions.Item label="Parte Equitativa">
                  {persona.parteEquitativaCorrespondiente}
                </Descriptions.Item>
                <Descriptions.Item label="Parte Igualitaria">
                  {persona.parteIgualitariaCorrespondiente}
                </Descriptions.Item>
                <Descriptions.Item label="Parte Correspondiente Total">
                  {persona.parteCorrespondienteTotal}
                </Descriptions.Item>
                <Descriptions.Item label="Es Deudor">
                  {persona.esDeudor ? "Sí" : "No"}
                </Descriptions.Item>
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
        </>
    )
};

export default ResumenHogar;