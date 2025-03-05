import { Table, Input, Button, Modal, Form, InputNumber } from "antd";
import { useState } from "react";

const NuevaGestionAnalisisClasificacion = () => {
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("miObjeto"))
  );
  const [filteredData, setFilteredData] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState(null); // Guardamos los datos de la fila seleccionada
  const [form] = Form.useForm(); // Formulario de Ant Design

  // Filtro por cada columna
  const handleFilterChange = (value, key) => {
    const filtered = data.filter((item) =>
      item[key].toString().toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEdit = (record) => {
    setEditData(record); // Guardamos los datos de la fila seleccionada
    form.setFieldsValue(record); // Establecemos los valores del formulario con los datos de la fila seleccionada
    setIsModalVisible(true); // Abrimos el modal
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        // Actualizamos solo la fila editada
        const updatedData = data.map((item) =>
          item.id === editData.id ? { ...item, ...values } : item
        );
        // Actualizamos los datos filtrados
        setData(updatedData);
        setFilteredData(updatedData);

        // Cerramos el modal
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validación fallida:", info);
      });
  };

  const columns = [
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Tipo"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys([e.target.value])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button type="link" onClick={() => clearFilters && clearFilters()} style={{ width: 90 }}>
            Limpiar
          </Button>
          <Button type="link" onClick={() => confirm()} style={{ width: 90 }}>
            Filtrar
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.tipo.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Persona",
      dataIndex: "persona",
      key: "persona",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Persona"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys([e.target.value])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button type="link" onClick={() => clearFilters && clearFilters()} style={{ width: 90 }}>
            Limpiar
          </Button>
          <Button type="link" onClick={() => confirm()} style={{ width: 90 }}>
            Filtrar
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.persona.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Fuente del Gasto",
      dataIndex: "fuenteDelGasto",
      key: "fuenteDelGasto",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Fuente"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys([e.target.value])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button type="link" onClick={() => clearFilters && clearFilters()} style={{ width: 90 }}>
            Limpiar
          </Button>
          <Button type="link" onClick={() => confirm()} style={{ width: 90 }}>
            Filtrar
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.fuenteDelGasto.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Categoria"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys([e.target.value])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button type="link" onClick={() => clearFilters && clearFilters()} style={{ width: 90 }}>
            Limpiar
          </Button>
          <Button type="link" onClick={() => confirm()} style={{ width: 90 }}>
            Filtrar
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.categoria.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <InputNumber
            placeholder="Buscar Monto"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys([value])}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button type="link" onClick={() => clearFilters && clearFilters()} style={{ width: 90 }}>
            Limpiar
          </Button>
          <Button type="link" onClick={() => confirm()} style={{ width: 90 }}>
            Filtrar
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.monto.toString().toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)} type="link">
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1>Gestión de Análisis de Clasificación</h1>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="key"
        onChange={(pagination, filters, sorter) => console.log("onChange", pagination, filters, sorter)}
      />

      {/* Modal para editar datos */}
      <Modal
        title="Editar Fila"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Guardar
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tipo"
            name="tipo"
            rules={[{ required: true, message: "Por favor ingrese el tipo" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Persona"
            name="persona"
            rules={[{ required: true, message: "Por favor ingrese la persona" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fuente del Gasto"
            name="fuenteDelGasto"
            rules={[{ required: true, message: "Por favor ingrese la fuente del gasto" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Categoria"
            name="categoria"
            rules={[{ required: true, message: "Por favor ingrese la categoría" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Monto"
            name="monto"
            rules={[{ required: true, message: "Por favor ingrese el monto" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NuevaGestionAnalisisClasificacion;
