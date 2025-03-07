import {
  Table,
  Button,
  Modal,
  Form,
  Checkbox,
  Select,
  Typography,
  Menu,
  Dropdown,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import FiltroDeGastos from "./FiltroDeGastos";
import css from "../css/GastosClasificados.module.css";

const { Title } = Typography;

const GastosClasificados = ({
  data,
  setData,
  gastosEditados,
  setGastosEditados,
  visibleColumns,
  setVisibleColumns
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form] = Form.useForm();

  

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

            if (gastoOriginal) {
              if (values.determinacion !== gastoOriginal.determinacion) {
                nuevaExcepcion = "Puntual"; // Si cambió la determinación, la excepción es "Puntual"
              } else {
                nuevaExcepcion = gastoOriginal.excepcion; // Si volvió a su valor original, restauramos la excepción
              }
            }

            return {
              ...item,
              determinacion: values.determinacion,
              excepcion: nuevaExcepcion,
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
      title: "Exceptuar",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)} type="link">
          Editar
        </Button>
      ),
    },
  ];

  const handleMenuClick = (e) => {
    const columnName = e.key;
    const visibleColumnCount =
      Object.values(visibleColumns).filter(Boolean).length;

    if (visibleColumnCount <= 5 && visibleColumns[columnName]) {
      message.info("Alcanzado el número de columnas invisibles.");
      return; 
    }
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName], 
    }));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="marcado">
        {" "}
        Marcado {visibleColumns.marcado ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="persona">
        Persona {visibleColumns.persona ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="tipoDeImporte">
        Tipo de Importe {visibleColumns.tipoDeImporte ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="tipo">
        Tipo {visibleColumns.tipo ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="categoria">
        Categoría {visibleColumns.categoria ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="fuenteDelGasto">
        Fuente del Gasto {visibleColumns.fuenteDelGasto ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="detalle">
        Detalle {visibleColumns.detalle ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="monto">
        Monto {visibleColumns.monto ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="fecha">
        Fecha {visibleColumns.fecha ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="tarjeta">
        Tarjeta {visibleColumns.tarjeta ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="tipoTarjeta">
        Tipo de Tarjeta {visibleColumns.tipoTarjeta ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="aNombreDe">
        Tarjeta de... {visibleColumns.aNombreDe ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="banco">
        Banco {visibleColumns.banco ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="numFinalTarjeta">
        N° Finales de tarjeta {visibleColumns.numFinalTarjeta ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="nombreConsumo">
        Consumo {visibleColumns.nombreConsumo ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="cuotaActual">
        Cuota {visibleColumns.cuotaActual ? "" : "(Oculto)"}
      </Menu.Item>
      <Menu.Item key="totalDeCuotas">
        Total de cuotas {visibleColumns.totalDeCuotas ? "" : "(Oculto)"}
      </Menu.Item>
    </Menu>
  );
  const filteredColumns = columns.filter((col) => visibleColumns[col.key]);

  return (
    <>
      <Title level={3}>Gastos Clasificados</Title>
      <div className={css.tableContainer}>
        <Dropdown overlay={menu}>
          <Button>
            Mostrar/Ocultar Columnas <DownOutlined />
          </Button>
        </Dropdown>
        <Table
          dataSource={filteredData}
          columns={filteredColumns}
          rowKey="key"
          onChange={(pagination, filters, sorter) =>
            console.log("onChange", pagination, filters, sorter)
          }
          pagination={{
            pageSize: 10, 
          }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title="Exceptuar Determinación del Gasto"
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
                <Select.Option value="GastoEquitativo">
                  Gasto Equitativo
                </Select.Option>
                <Select.Option value="GastoIgualitario">
                  Gasto Igualitario
                </Select.Option>
                <Select.Option value="GastoPersonal">
                  Gasto Personal
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className={css.infoItem}>
              <strong>Excepción:</strong> {editData?.excepcion}
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default GastosClasificados;
