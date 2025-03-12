import { useState, useEffect } from "react";
import { Table, Dropdown, Button, Menu, message, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";
import css from "../css/TablaDeGastos.module.css";
import FiltroDeGastos from "./FiltroDeGastos";

const TablaDeGastos = ({
  visibleColumns,
  setVisibleColumns,
  cantidadDeDatosPendientesPorCompletar,
  filteredData,
  handleEdit,
  edicionHabilitada = true,
}) => {
  const [totalMonto, setTotalMonto] = useState(0);

  const calcularTotal = (data) => {
    const nuevoTotal = data.reduce((acc, gasto) => {
      const monto = Number(gasto.monto);
      return acc + (isNaN(monto) ? 0 : monto);
    }, 0);
    setTotalMonto(nuevoTotal);
  };
  
  useEffect(() => {
    calcularTotal(filteredData);
  }, []);

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

    ...(edicionHabilitada
      ? [
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
        ]
      : []),
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
      <Menu.Item key="personaResponsable">
        Responsable {visibleColumns.personaResponsable ? "" : "(Oculto)"}
      </Menu.Item>
    </Menu>
  );
  const filteredColumns = columns.filter((col) => visibleColumns[col.key]);

  return (
    <>
      <div className={css.tableContainer}>
        <div className={css.headerGastos}>
          <Dropdown overlay={menu}>
            <Button>
              Mostrar/Ocultar Columnas <DownOutlined />
            </Button>
          </Dropdown>
          {edicionHabilitada &&
          <p className={css.totalMonto}>
            Gastos con datos pendientes de completar:
            <span
              className={
                cantidadDeDatosPendientesPorCompletar === 0
                  ? css.numeroCero
                  : css.numero
              }
            >
              {cantidadDeDatosPendientesPorCompletar}
            </span>
          </p>}
          {!edicionHabilitada && 
          <div className={css.totalMonto}>
          Monto Total Filtrado: <span className={css.valorMonto}>${totalMonto.toFixed(2)}</span>
        </div>
        }
        </div>
        <Table
          dataSource={filteredData}
          columns={filteredColumns}
          rowKey="key"
          onChange={(pagination, filters, sorter, extra) =>{
            console.log("onChange", pagination, filters, sorter)
            calcularTotal(extra.currentDataSource);
          }}
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};

export default TablaDeGastos;
