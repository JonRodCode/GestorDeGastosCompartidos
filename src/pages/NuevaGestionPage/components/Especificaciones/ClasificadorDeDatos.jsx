import { useState } from "react";
import { Typography, Card, Dropdown, Modal, Button } from "antd";
import InputDesplegable from "../../../../components/InputDesplegable";
import css from "../../css/ClasificadorDeDatos.module.css";
import Categoria from "./Categoria";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ClasificadorDeDatos = ({
  especificaciones,
  setEspecificaciones,
  propiedadManipuladaSuperior,
  propiedad,
  propiedadExtraAManipular,
  setPendientes,
  config,
}) => {
  const [modo, setModo] = useState("agregar");
  const [modoActivado, setModoActivado] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const agregarElemento = (nuevoElemento) => {
    if (!nuevoElemento.trim()) return; // Evita agregar elementos vacíos
  
    setEspecificaciones((prev) => {
      // Evita duplicados en especificaciones[propiedad]
      if (prev[propiedad]?.[nuevoElemento] !== undefined) return prev;
  
      return {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          [nuevoElemento]: [], // Agrega la clave con un array vacío
        },
      };
    });
  
    setPendientes((prev) => {
      // Evita duplicados en pendientes y especificaciones[propiedad]
      if (
        prev.includes(nuevoElemento) ||
        (especificaciones[propiedad] && especificaciones[propiedad][nuevoElemento] !== undefined)
      ) {
        return prev;
      }
      return [...prev, nuevoElemento];
    });
  };
  
  const actualizarValores = (nombre, nuevosValores, num, tipo) => {
    if (tipo === "agregar") {
      const copia = { ...especificaciones[propiedad] };
      for (const k in copia) {
        if (copia[k].includes(num)) {
          Modal.warning({
            title: "Elemento duplicado",
            content: `El elemento "${num}" ya existe en la categoría "${k}".`,
          });
          return especificaciones;
        }
      }
    }
    setEspecificaciones((prev) => {
      const nuevaEspecificacion = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          [nombre]: nuevosValores,
        },
        [propiedadExtraAManipular]: {
          ...(prev[propiedadExtraAManipular] || {}),
        },
      };

      if (tipo === "agregar") {
        nuevaEspecificacion[propiedadExtraAManipular][num] = [];
      } else if (
        tipo === "eliminar" &&
        nuevaEspecificacion[propiedadExtraAManipular][num]
      ) {
        delete nuevaEspecificacion[propiedadExtraAManipular][num];
      }

      return nuevaEspecificacion;
    });
  };

  const eliminarCategoria = () => {
    setEspecificaciones((prev) => {
      // 🔹 Copias de las propiedades que vamos a modificar
      const copia = { ...prev[propiedad] };
      const copiaDePropiedadExtra = { ...prev[propiedadExtraAManipular] };
  
      // 🔹 Obtener los valores que vamos a eliminar
      const valoresEliminados = copia[categoriaAEliminar] || [];
  
      // 🔹 Eliminar referencias en propiedadExtraAManipular
      const nuevaPropiedadExtra = eliminarReferencias(
        copiaDePropiedadExtra,
        valoresEliminados
      );
  
      // 🔹 Eliminar la categoría de propiedad
      delete copia[categoriaAEliminar];
  
      // 🔹 Filtrar el elemento de propiedadManipuladaSuperior
      const nuevaPropiedad = Object.fromEntries(
        Object.entries(prev[propiedadManipuladaSuperior]).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.filter((item) => item !== categoriaAEliminar) : value,
        ])
      );
  
      return {
        ...prev,
        [propiedad]: copia, // 🔹 Actualizamos propiedad
        [propiedadExtraAManipular]: nuevaPropiedadExtra, // 🔹 Actualizamos propiedadExtraAManipular
        [propiedadManipuladaSuperior]: nuevaPropiedad, // 🔹 Actualizamos propiedadManipuladaSuperior
      };
    });
  
    // 🔹 Actualizar pendientes
    setPendientes((prev) => prev.filter((item) => item !== categoriaAEliminar));
  
    // 🔹 Cerrar confirmación
    setMostrarConfirmacion(false);
  };
  

  const eliminarReferencias = (mapa, lista) => {
    const copia = { ...mapa };
    lista.forEach((clave) => {
      delete copia[clave];
    });
    return copia;
  };

  const modificarCategoria = (nuevoNombre) => {
    if (!nuevoNombre.trim() || nuevoNombre === categoriaAEditar || especificaciones[propiedad]?.[nuevoNombre] !== undefined) {
      Modal.error({
        title: "Error",
        content: `La categoría "${nuevoNombre}" ya existe.`,
      });
      return; // 🔹 Cancela la función inmediatamente
    }
  
    // 🟢 Modificar en pendientes si está ahí
    setPendientes((prev) =>
      prev.includes(categoriaAEditar)
        ? prev.map((item) => (item === categoriaAEditar ? nuevoNombre : item))
        : prev
    );
  
    // 🔵 Modificar dentro de especificaciones[propiedadManipuladaSuperior]
    setEspecificaciones((prev) => {
      const nuevaPropiedad = Object.fromEntries(
        Object.entries(prev[propiedad]).map(([key, value]) =>
          key === categoriaAEditar ? [nuevoNombre, value] : [key, value]
        )
      );
  
      const nuevaPropiedadSuperior = Object.fromEntries(
        Object.entries(prev[propiedadManipuladaSuperior]).map(([key, array]) => [
          key,
          array.map((item) => (item === categoriaAEditar ? nuevoNombre : item)),
        ])
      );
  
      return {
        ...prev,
        [propiedad]: nuevaPropiedad,
        [propiedadManipuladaSuperior]: nuevaPropiedadSuperior,
      };
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
              No hay {config.temaDeClasificacionEnPlural} agregad{config.letra}s
            </span>
          ) : (
            <span className={css.placeholderText}>
              Lista de {config.temaDeClasificacionEnPlural}:
            </span>
          ))}

        {modoActivado && modo === "agregar" && (
          <InputDesplegable
            onAdd={agregarElemento}
            placeholder={
              "Ingrese nuev" +
              config.letra +
              " " +
              config.temaDeClasificacionEnSingular
            }
            onClose={() => setModoActivado(false)}
            type="text"
          />
        )}
        {modoActivado &&
          !(modo === "agregar") &&
          Object.keys(especificaciones[propiedad]).length !== 0 && (
            <span className={css.placeholderText}>
              Seleccione un{config.letra} {config.temaDeClasificacionEnSingular}
            </span>
          )}
        {modoActivado &&
          !(modo === "agregar") &&
          Object.keys(especificaciones[propiedad]).length === 0 && (
            <span className={css.placeholderText}>
              No hay {config.temaDeClasificacionEnPlural} agregad{config.letra}s
            </span>
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
                placeholder={
                  "Modificar " + config.temaDeClasificacionEnSingular
                }
                onClose={() => setCategoriaAEditar(null)}
                type="text"
                defaultValue={key}
              />
            ) : (
              <Categoria
                nombre={key}
                valores={values}
                tipo={config.elementoEnSingular}
                actualizarValores={actualizarValores}
                activable={!modoActivado}
                validarEliminacion={true}
                fraseDeEliminacion={config.fraseDeEliminacionParaSingular}
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
        title={
          <>
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            Confirmar eliminación
          </>
        }
        open={mostrarConfirmacion}
        onOk={eliminarCategoria}
        onCancel={() => setMostrarConfirmacion(false)}
      >
        <p>{config.fraseDeEliminacion}</p>
        <p>¿Seguro que quieres eliminar {categoriaAEliminar}?</p>
      </Modal>
    </Card>
  );
};

export default ClasificadorDeDatos;
