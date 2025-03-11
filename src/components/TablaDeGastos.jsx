import {Table, Dropdown, Button, Menu, message} from "antd";
import { DownOutlined } from "@ant-design/icons";
import css from "../css/TablaDeGastos.module.css";

const TablaDeGastos = ({columns,visibleColumns, setVisibleColumns, cantidadDeDatosPendientesPorCompletar,filteredData}) => {
    
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
          <p>
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
          </p>
        </div>
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
        </>
    )
}

export default TablaDeGastos;