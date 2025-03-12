import {
  Modal,
  Form,
  Select,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import TablaDeGastos from "../../../../components/TablaDeGastos";
import css from "../css/GastosClasificados.module.css";

const { Title } = Typography;

const opcionesDeterminacion = [
  { value: "GastoEquitativo", label: "Gasto Equitativo" },
  { value: "GastoIgualitario", label: "Gasto Igualitario" },
  { value: "GastoPersonal", label: "Gasto Personal" },
  { value: "GastoDeOtraPersona", label: "Gasto de Otra Persona" },
];

const GastosClasificados = ({
  data,
  setData,
  gastosEditados,
  setGastosEditados,
  visibleColumns,
  setVisibleColumns,
  listaDePersonas,
  cantidadDeDatosPendientesPorCompletar,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form] = Form.useForm();
  const determinacionSeleccionada = Form.useWatch("determinacion", form);

  const handleEdit = (record) => {
    setEditData(record);
    form.setFieldsValue({ determinacion: record.determinacion });

    // Si el gasto aún no fue editado, lo guardamos en el array de cambios originales
    if (!gastosEditados.some((g) => g.id === record.id)) {
      setGastosEditados([
        ...gastosEditados,
        {
          id: record.id,
          determinacion: record.determinacion,
          excepcion: record.excepcion,
        },
      ]);
    }

    setIsModalVisible(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedData = data.map((item) => {
          if (item.id === editData.id) {
            // Buscar el gasto en gastosEditados para obtener el valor original
            const gastoOriginal = gastosEditados.find((g) => g.id === item.id);

            let nuevaExcepcion = item.excepcion;
            let personaResponsable = item.personaResponsable;

            if (gastoOriginal) {
              if (values.determinacion !== gastoOriginal.determinacion) {
                nuevaExcepcion = "Puntual"; // Si cambió la determinación, la excepción es "Puntual"
              } else {
                nuevaExcepcion = gastoOriginal.excepcion; // Si volvió a su valor original, restauramos la excepción
              }
            }
            if (values.determinacion === "GastoDeOtraPersona") {
              personaResponsable = values.otraPersona;
            }

            return {
              ...item,
              determinacion: values.determinacion,
              excepcion: nuevaExcepcion,
              personaResponsable, // Agregar personaResponsable al objeto final
            };
          }
          return item;
        });

        setData(updatedData);
        setFilteredData(updatedData);
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validación fallida:", info);
      });
  };  

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({ otraPersona: editData.personaResponsable });
    }
  }, [editData, form]);

  return (
    <>
      <Title level={3}>Gastos Clasificados</Title>

      <TablaDeGastos
        handleEdit={handleEdit}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        cantidadDeDatosPendientesPorCompletar={
          cantidadDeDatosPendientesPorCompletar
        }
        filteredData={filteredData}
        edicionHabilitada={true}
      />
      <Modal
        title="Exceptuar Determinación del Gasto - (Redeterminar)"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        className={css.modalContainer}
      >
        <Form form={form} layout="vertical" className={css.formContainer}>
          <div className={css.infoSection}>
            <div className={css.infoItem}>
              <strong>Persona:</strong> {editData?.persona}
            </div>
            <div className={css.infoItem}>
              <strong>Tipo de Importe:</strong> {editData?.tipoDeImporte}
            </div>
            <div className={css.infoItem}>
              <strong>Tipo:</strong> {editData?.tipo}
            </div>
            <div className={css.infoItem}>
              <strong>Detalle:</strong> {editData?.detalle}
            </div>
            <div className={css.infoItem}>
              <strong>Fuente del Gasto:</strong> {editData?.fuenteDelGasto}
            </div>
            <div className={css.infoItem}>
              <strong>Categoría:</strong> {editData?.categoria}
            </div>
            <div className={css.infoItem}>
              <strong>Monto:</strong> {editData?.monto}
            </div>
            <div className={css.infoItem}>
              <strong>Fecha:</strong> {editData?.fecha}
            </div>
            <div className={css.infoItem}>
              <strong>Tarjeta:</strong> {editData?.tarjeta}
            </div>
            <div className={css.infoItem}>
              <strong>Tipo de Tarjeta:</strong> {editData?.tipoTarjeta}
            </div>
            <div className={css.infoItem}>
              <strong>Banco:</strong> {editData?.banco}
            </div>
            <div className={css.infoItem}>
              <strong>A nombre de:</strong> {editData?.aNombreDe}
            </div>
            <div className={css.infoItem}>
              <strong>Nombre de Consumo:</strong> {editData?.nombreConsumo}
            </div>
            <div className={css.infoItem}>
              <strong>Número final de Tarjeta:</strong>{" "}
              {editData?.numFinalTarjeta}
            </div>
            <div className={css.infoItem}>
              <strong>Total de Cuotas:</strong> {editData?.totalDeCuotas}
            </div>
            <div className={css.infoItem}>
              <strong>Cuota Actual:</strong> {editData?.cuotaActual}
            </div>
            <div className={css.infoItem}>
              <strong>Determinacion: </strong>
              <Form.Item name="determinacion">
                <Select className={css.selectInput}>
                  {opcionesDeterminacion.map((opcion) => (
                    <Select.Option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className={css.infoItem}>
              <strong>Excepción:</strong> {editData?.excepcion}
            </div>
            <div className={css.infoItemUltimo}>
              {determinacionSeleccionada === "GastoDeOtraPersona" && (
                <>
                  <strong>Persona responsable del gasto:</strong>
                  <Form.Item name="otraPersona">
                    {listaDePersonas.filter(
                      (persona) => persona.nombre !== editData?.persona
                    ).length > 0 ? (
                      <Select
                        className={css.selectInput}
                        placeholder="Seleccione una persona"
                      >
                        {listaDePersonas
                          .filter(
                            (persona) => persona.nombre !== editData?.persona
                          )
                          .map((persona) => (
                            <Select.Option
                              key={persona.nombre}
                              value={persona.nombre}
                            >
                              {persona.nombre}
                            </Select.Option>
                          ))}
                      </Select>
                    ) : (
                      <div className={css.mensajeError}>
                        No hay datos para seleccionar. Por favor agregar en la
                        sección &quot;Personas&quot;.
                      </div>
                    )}
                  </Form.Item>
                </>
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default GastosClasificados;
