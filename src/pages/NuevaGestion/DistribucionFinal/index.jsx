import { useState } from "react";
import { Card, Descriptions, Button, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import css from "./css/DistribucionFinal.module.css"

const { Dragger } = Upload;

const NuevaGestionDistribucionFinal = () => {
  //const [gastos, setGastos] = useState(JSON.parse(sessionStorage.getItem("gastosClasificadosFinales")));
  //const [listaDePersonas, setListaDePersonas] = useState(JSON.parse(sessionStorage.getItem("listaDePersonasConGanancias")));
  const [resumen, setResumen] = useState(
    JSON.parse(sessionStorage.getItem("resumenDeDistribucion"))
  );
  const [activeView, setActiveView] = useState("view1");

  
  const guardarComoArchivo = () => {
    const jsonStr = JSON.stringify(resumen, null, 2); // Convertimos el estado en JSON
    const blob = new Blob([jsonStr], { type: "application/json" }); // Creamos un blob con el tipo 'application/json'
    const url = URL.createObjectURL(blob); // Creamos una URL para el blob
    const a = document.createElement("a"); // Creamos un enlace <a>
    a.href = url; // Establecemos la URL como href del enlace
    a.download = "resumen.json"; // Establecemos el nombre del archivo a descargar
    a.click(); // Disparamos el clic para descargar el archivo
    URL.revokeObjectURL(url); // Revocamos la URL después de la descarga
  };

  // Función para cargar un archivo JSON
  const cargarDesdeArchivo = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result); // Convertimos el contenido del archivo a un objeto JSON
        setResumen(jsonData); // Actualizamos el estado con los datos cargados
      } catch (error) {
        alert("Error al leer el archivo JSON", error);
      }
    };
    reader.readAsText(file); // Leemos el archivo como texto
  };

  return (
    <>
      <div>
      <h1>Resumen de Gestión</h1>
      <div className={css.buttonContainer}>
        <Button
          className={
            activeView === "view1" ? css.activeButton : css.defaultButton
          }
          onClick={() => setActiveView("view1")}
        >
          Resumen
        </Button>
        <Button
          className={
            activeView === "view2" ? css.activeButton : css.defaultButton
          }
          onClick={() => setActiveView("view2")}
        >
          Gastos
        </Button>
      </div>
      {activeView === "view1" && (<>

        <Card title="Resumen General" style={{ marginBottom: "16px" }}>
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
        </Card></>)}

        <div style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={guardarComoArchivo}
            style={{ marginRight: "8px" }}
          >
            Guardar como archivo
          </Button>

          <Dragger
            name="file"
            accept=".json"
            customRequest={({ file, onSuccess }) => {
              cargarDesdeArchivo(file);
              onSuccess();
            }}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Haz clic o arrastra un archivo JSON aquí para cargarlo
            </p>
          </Dragger>
        </div>
      </div>
    </>
  );
};

export default NuevaGestionDistribucionFinal;
