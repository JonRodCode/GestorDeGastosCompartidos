import {
  Button,
  Modal,
  Form,
  Checkbox,
  Select,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import FiltroDeGastos from "./FiltroDeGastos";
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

  const columns = [
    {
      title: " ",
      dataIndex: "marcado",
      key: "marcado",
      align: "center",
      filters: [
        { text: "Marcado", value: true },
        { text: "No marcado", value: false },
      ],
      onFilter: (value, record) => record.marcado === value,
      render: (marcado) => <Checkbox checked={marcado} disabled />,
    },

    {
      title: "Persona",
      dataIndex: "persona",
      key: "persona",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Persona"
        />
      ),
      onFilter: (value, record) =>
        record.persona.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "Tipo de Importe",
      dataIndex: "tipoDeImporte",
      key: "tipoDeImporte",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Tipo de Importe"
        />
      ),
      onFilter: (value, record) =>
        record.tipoDeImporte
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Tipo"
        />
      ),
      onFilter: (value, record) =>
        record.tipo.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Categoria"
        />
      ),
      onFilter: (value, record) =>
        record.categoria.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Fuente del Gasto",
      dataIndex: "fuenteDelGasto",
      key: "fuenteDelGasto",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Fuente del Gasto"
        />
      ),
      onFilter: (value, record) =>
        record.fuenteDelGasto
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Detalle",
      dataIndex: "detalle",
      key: "detalle",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Detalle"
        />
      ),
      onFilter: (value, record) =>
        record.detalle.toString().toLowerCase().includes(value.toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Monto"
        />
      ),
      onFilter: (value, record) =>
        record.monto
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Fecha"
        />
      ),
      onFilter: (value, record) =>
        record.fecha
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Tarjeta",
      dataIndex: "tarjeta",
      key: "tarjeta",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Tarjeta"
        />
      ),
      onFilter: (value, record) =>
        record.tarjeta
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Tipo de Tarjeta",
      dataIndex: "tipoTarjeta",
      key: "tipoTarjeta",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Tipo de Tarjeta"
        />
      ),
      onFilter: (value, record) =>
        record.monto
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Tarjeta de...",
      dataIndex: "aNombreDe",
      key: "aNombreDe",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="nombre de persona"
        />
      ),
      onFilter: (value, record) =>
        record.aNombreDe
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Banco",
      dataIndex: "banco",
      key: "banco",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Banco"
        />
      ),
      onFilter: (value, record) =>
        record.banco
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "N° finales de tarj.",
      dataIndex: "numFinalTarjeta",
      key: "numFinalTarjeta",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="números"
        />
      ),
      onFilter: (value, record) =>
        record.numFinalTarjeta
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Consumo",
      dataIndex: "nombreConsumo",
      key: "nombreConsumo",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Consumos"
        />
      ),
      onFilter: (value, record) =>
        record.nombreConsumo
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Cuota",
      dataIndex: "cuotaActual",
      key: "cuotaActual",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Cuota"
        />
      ),
      onFilter: (value, record) =>
        record.cuotaActual
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Total de cuotas",
      dataIndex: "totalDeCuotas",
      key: "totalDeCuotas",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="total de cuotas"
        />
      ),
      onFilter: (value, record) =>
        record.totalDeCuotas
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      render: (text) => text || "---",
    },

    {
      title: "Determinación",
      dataIndex: "determinacion",
      key: "determinacion",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Determinación"
        />
      ),
      onFilter: (value, record) =>
        record.determinacion
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) => text.replace(/([a-z])([A-Z])/g, "$1 $2"),
    },
    {
      title: "Responsable",
      dataIndex: "personaResponsable",
      key: "personaResponsable",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Responsable"
        />
      ),
      onFilter: (value, record) =>
        record.personaResponsable
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) => text || "---",
    },
    {
      title: "Excepción",
      dataIndex: "excepcion",
      key: "excepcion",
      align: "center",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FiltroDeGastos
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          elemento="Excepción"
        />
      ),
      onFilter: (value, record) =>
        record.excepcion
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      title: "Redeterminar",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)} type="link">
          Seleccionar
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({ otraPersona: editData.personaResponsable });
    }
  }, [editData, form]);

  return (
    <>
      <Title level={3}>Gastos Clasificados</Title>

      <TablaDeGastos
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        cantidadDeDatosPendientesPorCompletar={
          cantidadDeDatosPendientesPorCompletar
        }
        filteredData={filteredData}
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
