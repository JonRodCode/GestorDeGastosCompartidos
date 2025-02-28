import { Upload, Button,  message, Modal } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";

const PanelDeCargaDeDatos = ({ verificarEspecificacionesNuevas, setEspecificaciones, especificaciones, tipoDeCaptura = "objeto", elemento = "", setCargoDatos }) => {
    
  const hayDatos = (objeto) => {
    return Object.entries(objeto).some(([key, value]) => {
      if (key === "determinaciones" && typeof value === "object" && value !== null) {0
        return Object.values(value).some((arr) => Array.isArray(arr) && arr.length > 0);
      } else if (Array.isArray(value)) {
        return value.length > 0; 
      } else if (typeof value === "object" && value !== null) {
        return Object.keys(value).length > 0 || hayDatos(value);
      }
      return false;
    });
  }

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
          const datos = JSON.parse(contenido);
  
          // Validación según el tipo esperado
          if (tipoDeCaptura === "objeto" && (typeof datos !== "object" || Array.isArray(datos) || datos === null)) {
            throw new Error("El archivo seleccionado no es válido.");
          }
          if (tipoDeCaptura === "array" && !Array.isArray(datos)) {
            throw new Error("El archivo seleccionado no es válido.");
          }

          if (tipoDeCaptura === "objeto") {
            if (!hayDatos(especificaciones)) {
              setEspecificaciones(datos);
              message.success("Archivo cargado con éxito");
            }
            else {
              console.log(especificaciones);
              console.log(especificaciones.length);
              Modal.confirm({
                title: `Carga de ${elemento}s`,
                content: "¿Desea mantener los elementos ya cargados o eliminarlos y cargar los nuevos?",
                okText: "Mantener existentes",
                cancelText: "Eliminar y cargar nuevos",
                onOk: () => {
                  console.log("El usuario decidió mantener los elementos.");

                  if (verificarEspecificacionesNuevas(datos)){
                    setEspecificaciones(datos);
                    message.success("Archivo cargado con éxito");
                  }
                  else{
                    message.success("INCONSISTENCIAAAAA");
                  }
                },
                onCancel: () => {
                  setEspecificaciones(datos);
                  message.success("Archivo cargado con éxito");
                }
              });
            }
          } 
  
          if (setCargoDatos){
            setCargoDatos(true);
          }
        } catch (error) {
          message.error(error.message);
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
        <Button icon={<UploadOutlined />}>Cargar {elemento}</Button>
      </Upload>

      {/* Botón para guardar */}
      <Button
        icon={<SaveOutlined />}
        onClick={guardarArchivo}
        style={{ marginTop: 10 }}
        type="primary"
      >
        Guardar {elemento}
      </Button>
    </>
  );
};

export default PanelDeCargaDeDatos;

