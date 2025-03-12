import { useState } from "react";
import { Button, Upload, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ResumenHogar from "./components/ResumenHogar";
import TablaDeGastos from "../../../components/TablaDeGastos";
import css from "./css/DistribucionFinal.module.css";

const { Title } = Typography;

const { Dragger } = Upload;

const NuevaGestionDistribucionFinal = () => {
  const [gastos, setGastos] = useState(JSON.parse(sessionStorage.getItem("gastosClasificadosFinales")));
  //const [listaDePersonas, setListaDePersonas] = useState(JSON.parse(sessionStorage.getItem("listaDePersonasConGanancias")));
  const [resumen, setResumen] = useState(
    JSON.parse(sessionStorage.getItem("resumenDeDistribucion"))
  );
  const [activeView, setActiveView] = useState("view1");
  const [visibleColumns, setVisibleColumns] = useState({
    persona: true,
    tipoDeImporte: true,
    tipo: true,
    categoria: true,
    fuenteDelGasto: true,
    detalle: true,
    monto: true,
    fecha: false,
    tarjeta: false,
    tipoTarjeta: false,
    aNombreDe: false,
    banco: false,
    numFinalTarjeta: false,
    nombreConsumo: false,
    cuotaActual: false,
    totalDeCuotas: false,
    determinacion: true,
    excepcion: true,
    acciones: true,
  });

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
        {activeView === "view1" && (
          <>
            <Title level={3}>Resumen General</Title>
          <ResumenHogar resumen={resumen} /></>
          )}
          {activeView === "view2" && (<>
            <Title level={3}>Gastos del Resumen</Title>
          <TablaDeGastos
          visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filteredData={gastos}
        edicionHabilitada={false}
          />
          </>)}

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
