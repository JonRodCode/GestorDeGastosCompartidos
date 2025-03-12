import { Upload, Button, message, Modal } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";

const PanelDeCargaDeEspecificaciones = ({
  verificarEspecificacionesNuevas,
  verificarSiHayDatos,
  verificarSiHayConflictosConLosElementosEnUso,
  verificarSiHayConflictosConLasExcepciones,
  agregarNuevasEspecificaciones,
  setEspecificaciones,
  especificaciones,
  eliminarPendientes,
  tipoDeCaptura = "objeto",
  elemento = "elemento"
}) => {
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
          let datos = JSON.parse(contenido);

          // Validación según el tipo esperado
          if (
            tipoDeCaptura === "objeto" &&
            (typeof datos !== "object" ||
              Array.isArray(datos) ||
              datos === null)
          ) {
            throw new Error("El archivo seleccionado no es válido.");
          }
          if (tipoDeCaptura === "array" && !Array.isArray(datos)) {
            throw new Error("El archivo seleccionado no es válido.");
          }

          if (tipoDeCaptura === "objeto") {
            if (!verificarSiHayDatos(especificaciones)) {
              setEspecificaciones(datos);
              message.success("Archivo cargado con éxito");
            } else {
              Modal.confirm({
                title: `Carga de ${elemento}s`,
                content:
                  "¿Desea mantener los elementos ya cargados o eliminarlos y cargar los nuevos?",
                okText: "Mantener existentes",
                cancelText: "Eliminar y cargar nuevos",
                onOk: () => {
                  console.log("El usuario decidió mantener los elementos.");
                  if (verificarEspecificacionesNuevas(datos) &&
                  !verificarSiHayConflictosConLasExcepciones(datos)) {
                    datos = agregarNuevasEspecificaciones(datos);
                    setEspecificaciones(datos);
                    message.success("Archivo cargado con éxito");

                  } else {
                    Modal.warning({
                      title: "Inconsistencia Detectada",
                      content: (
                        <>
                          <p>
                            Se encontraron discrepancias entre las
                            especificaciones.
                          </p>
                          <p>
                          Por favor, verifique que las clasificaciones actuales coincidan
                          con las nuevas y que las excepciones no se repitan.
                          Luego, intente nuevamente.
                          </p>
                        </>
                      ),
                      okText: "Entendido",
                    });
                  }
                },
                onCancel: () => {
                  if (!verificarSiHayConflictosConLosElementosEnUso(datos)) {
                    setEspecificaciones(datos);
                    eliminarPendientes();
                    message.success("Archivo cargado con éxito");
                  } else {
                    Modal.warning({
                      title: "Inconsistencia Detectada",
                      content: (
                        <>
                          <p>
                            No se cargaron las nuevas especificaciones porque
                            hay gastos que dependen exclusivamente de las
                            actuales.
                          </p>
                          <p>
                            Por favor, asegúrese de que todas las
                            clasificaciones existentes estén contempladas en las
                            nuevas especificaciones e intente nuevamente.
                          </p>
                        </>
                      ),
                      okText: "Entendido",
                    });
                  }
                },
              });
            }
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

      message.success("Datos guardados con éxito.");
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
      <Upload
        beforeUpload={() => false}
        onChange={manejarArchivo}
        showUploadList={false}
      >
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

export default PanelDeCargaDeEspecificaciones;
