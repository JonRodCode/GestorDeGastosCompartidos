import { Upload, Button,  message } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";

const PanelDeCargaDeDatos = ({ setEspecificaciones, especificaciones }) => {
  
  const manejarArchivo = (info) => {
    const archivo = info.file;
    const extension = archivo.name.split(".").pop().toLowerCase();

    if (extension !== "txt" && extension !== "json") {
      message.error("❌ Solo se permiten archivos .txt o .json");
      return;
    }
    
    if (archivo) {
      const lector = new FileReader();
      lector.onload = (e) => {
        try {
          const contenido = e.target.result;
          const nuevoEstado = JSON.parse(contenido);
          setEspecificaciones(nuevoEstado);
          message.success("Archivo cargado con éxito");
        } catch (error) {
          message.error("Error al parsear el archivo");
          console.error("Error al parsear el archivo:", error);
        }
      };
      lector.readAsText(archivo);
    }
  };

  const guardarArchivo = async () => {
    try {
      if (!window.showSaveFilePicker) {
        message.error("❌ Tu navegador no soporta la selección de archivos.");
        return;
      }
  
      const opciones = {
        suggestedName: "especificaciones.json",
        types: [
          {
            description: "Archivo JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      };
  
      const handle = await window.showSaveFilePicker(opciones);
      if (!handle) return; // Si el usuario canceló, no hacer nada.
  
      const writable = await handle.createWritable();
      const contenido = JSON.stringify(especificaciones, null, 2);
  
      await writable.write(contenido);
      await writable.close();
  
      message.success("✅ Datos guardados con éxito.");
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("⚠️ Guardado cancelado por el usuario.");
        return; // No mostrar error si fue cancelado.
      }
      console.error("❌ Error al guardar el archivo:", error);
      message.error("❌ No se pudo guardar el archivo.");
    }
  };

  return (
    <>
      {/* Botón para cargar */}
      <Upload beforeUpload={() => false} onChange={manejarArchivo} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Cargar</Button>
      </Upload>

      {/* Botón para guardar */}
      <Button
        icon={<SaveOutlined />}
        onClick={guardarArchivo}
        style={{ marginTop: 10 }}
        type="primary"
      >
        Guardar
      </Button>
    </>
  );
};

export default PanelDeCargaDeDatos;

