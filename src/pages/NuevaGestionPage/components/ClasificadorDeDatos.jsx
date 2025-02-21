import { useState } from "react";
import { Typography, Card, Dropdown, Modal, Button } from "antd";
import InputDesplegable from "../../../components/InputDesplegable";
import css from "../css/ClasificadorDeDatos.module.css";
import Categoria from "./Categoria";
import { DownOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ClasificadorDeDatos = ({
  especificaciones,
  setEspecificaciones,
  propiedad,
  config,
}) => {
  const [modo, setModo] = useState("agregar");
  const [modoActivado, setModoActivado] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const agregarElemento = (nuevoElemento) => {
    setEspecificaciones((prev) => ({
      ...prev,
      [propiedad]: {
        ...prev[propiedad],
        [nuevoElemento]: prev[propiedad]?.[nuevoElemento] || [],
      },
    }));
  };

  const actualizarValores = (nombre, nuevosValores) => {
    setEspecificaciones((prev) => ({
      ...prev,
      [propiedad]: {
        ...prev[propiedad],
        [nombre]: nuevosValores,
      },
    }));
  };

  const eliminarCategoria = () => {
    setEspecificaciones((prev) => {
      const copia = { ...prev[propiedad] };
      delete copia[categoriaAEliminar];
      return { ...prev, [propiedad]: copia };
    });
    setMostrarConfirmacion(false);
  };

  const modificarCategoria = (nuevoNombre) => {
    setEspecificaciones((prev) => {
      const copiaArray = Object.entries(prev[propiedad]).map(([key, value]) =>
        key === categoriaAEditar ? [nuevoNombre, value] : [key, value]
      );
      const nuevaPropiedad = Object.fromEntries(copiaArray);
      return { ...prev, [propiedad]: nuevaPropiedad };
    });
    setCategoriaAEditar(null);
  };

  const menuItems = [
    modo !== "modificar" && {
      key: "modificar",
      label: "Modificar",
      onClick: () => manejarClickBoton("modificar"),
    },
    modo !== "eliminar" && {
      key: "eliminar",
      label: "Eliminar",
      onClick: () => manejarClickBoton("eliminar"),
    },
    modo !== "agregar" && {
      key: "agregar",
      label: "Agregar",
      onClick: () => manejarClickBoton("agregar"),
    },
  ].filter(Boolean);

  const manejarClickBoton = (modoSeleccionado) => {
    setModo(modoSeleccionado);
    setModoActivado(true);
  };

  const cancelarAccion = () => {
    setCategoriaAEditar(null);
    setCategoriaAEliminar(null);
    setModoActivado(false);
  };

  return (
    <Card className={css.card}>
      <div className={css.header}>
        <Title level={3} className={css.cardTitle}>
          Clasificar {config.elementoAClasificar}
        </Title>

        <div className={css.buttonsContainer}>
          <Dropdown.Button
            className={css.addButton}
            menu={{ items: menuItems }}
            onClick={() => manejarClickBoton(modo)}
            icon={<DownOutlined />}
            disabled={modoActivado}
          >
            {modo.charAt(0).toUpperCase() + modo.slice(1)}{" "}
            {config.temaDeClasificacionEnSingular}
          </Dropdown.Button>
        </div>
      </div>

      <div className={css.buttonsContainer}>
        {!modoActivado &&
          (Object.keys(especificaciones[propiedad]).length === 0 ? (
            <span className={css.placeholderText}>
              No hay {config.temaDeClasificacionEnPlural } agregad{config.letra}s
            </span>
          ) : (
            <span className={css.placeholderText}>
              Lista de {config.temaDeClasificacionEnPlural }:
            </span>
          ))}

        {modoActivado && modo === "agregar" && (
          <InputDesplegable
            onAdd={agregarElemento}
            placeholder={"Ingrese nuev"+ config.letra +" "+ config.temaDeClasificacionEnSingular }
            onClose={() => setModoActivado(false)}
            type="text"
          />
        )}
        {(modoActivado && !(modo === "agregar") &&
        Object.keys(especificaciones[propiedad]).length !== 0) && (
          <span className={css.placeholderText}>Seleccione un{config.letra} {config.temaDeClasificacionEnSingular }</span>        
        )}
        {(modoActivado && !(modo === "agregar") &&
        Object.keys(especificaciones[propiedad]).length === 0) && (
          <span className={css.placeholderText}>No hay {config.temaDeClasificacionEnPlural } agregad{config.letra}s</span>        
        )}
        {modoActivado && (
          <Button onClick={cancelarAccion} danger>
            Cancelar
          </Button>
        )}
      </div>

      <hr className={css.divider} />
      <div>
        {Object.entries(especificaciones[propiedad]).map(([key, values]) => (
          <div key={key} className={css.categoriaContainer}>
            {categoriaAEditar === key ? (
              <InputDesplegable
                onAdd={modificarCategoria}
                valor={key}
                placeholder={"Modificar " + config.temaDeClasificacionEnSingular }
                onClose={() => setCategoriaAEditar(null)}
                type="text"
                defaultValue={key}
              />
            ) : (
              <Categoria
                nombre={key}
                valores={values}
                tipo={config.elementoEnSingular }
                actualizarValores={actualizarValores}
                activable={!modoActivado}
              />
            )}

            {modoActivado && modo === "eliminar" && (
              <span
                className={css.textoRojo}
                onClick={() => {
                  setCategoriaAEliminar(key);
                  setMostrarConfirmacion(true);
                }}
              >
                Eliminar
              </span>
            )}
            {modoActivado && modo === "modificar" && (
              <span
                className={css.textoAzul}
                onClick={() => setCategoriaAEditar(key)}
              >
                Seleccionar
              </span>
            )}
          </div>
        ))}
      </div>
      <Modal
        title="Confirmación"
        visible={mostrarConfirmacion}
        onOk={eliminarCategoria}
        onCancel={() => setMostrarConfirmacion(false)}
      >
        <p>¿Seguro que quieres eliminar {categoriaAEliminar}?</p>        
      </Modal>
    </Card>
  );
};

export default ClasificadorDeDatos;
