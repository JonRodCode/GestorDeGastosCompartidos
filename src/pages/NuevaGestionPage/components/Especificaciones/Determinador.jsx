import { useState } from "react";
import { Typography, Card, Tag, Button, Modal } from "antd";
import InputDesplegable from "../../../../components/InputDesplegable";
import ButtonDesplegable from "../../../../components/ButtonDesplegable";
import css from "../../css/Determinador.module.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Determinador = ({
  especificaciones,
  setEspecificaciones,
  propiedad,
  propiedadExtraAManipular,
  subPropiedadExtraAManipular,
  pendientes,
  setPendientes,
  fuentesDeGastosEnUso,
  fraseDeEliminacion,
}) => {
  const [modo, setModo] = useState("agregar");
  const [modoActivado, setModoActivado] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);

  const [redeterminar, setRedeterminar] = useState(false);

  const handleDragStart = (e, valor, origen) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ valor, origen }));
  };

  const handleDrop = (e, categoriaDestino) => {
    e.preventDefault();
    const { valor, origen } = JSON.parse(e.dataTransfer.getData("text/plain"));

    // ✅ Si el modo "Mover" está apagado, solo permite mover desde "Pendientes"
    if (!redeterminar && origen !== "pendientes") return;
    if (especificaciones[propiedad][categoriaDestino].includes(valor)) return;

    setEspecificaciones((prev) => {
      const nuevaCategoria = [
        ...(prev[propiedad]?.[categoriaDestino] || []),
        valor,
      ];

      let nuevasCategorias = {
        ...prev[propiedad],
        [categoriaDestino]: nuevaCategoria,
      };

      // 🔄 Si el modo "Mover" está activo, elimina el valor de su categoría original
      if (redeterminar && origen !== "pendientes") {
        nuevasCategorias = {
          ...nuevasCategorias,
          [origen]: nuevasCategorias[origen].filter((item) => item !== valor),
        };
      }

      return {
        ...prev,
        [propiedad]: nuevasCategorias,
      };
    });

    if (origen === "pendientes") {
      setPendientes((prev) => prev.filter((item) => item !== valor));
    }
  };

  const modificarElemento = (nuevoValor, valorAnterior) => {
    if (
      !nuevoValor.trim() ||
      Object.values(especificaciones[propiedad] || {}).some((array) =>
        array.includes(nuevoValor)
      ) ||
      pendientes.includes(nuevoValor)
    ) {
      Modal.error({
        title: "Error",
        content: `La categoría "${nuevoValor}" ya existe.`,
      });
      setCategoriaAEditar(null);
      return; // Cancela la función inmediatamente
    }

    // Actualizar pendientes
    setPendientes((prev) =>
      prev.map((item) => (item === valorAnterior ? nuevoValor : item))
    );

    // Modificar especificaciones en una sola llamada
    setEspecificaciones((prev) => {
      const categoriasActualizadas = Object.fromEntries(
        Object.entries(prev.categorias).map(([key, value]) =>
          key === valorAnterior ? [nuevoValor, value] : [key, value]
        )
      );

      const categoriasModificadas = Object.fromEntries(
        Object.entries(prev.determinaciones).map(([key, value]) => [
          key,
          value.map((item) => (item === valorAnterior ? nuevoValor : item)),
        ])
      );

      return {
        ...prev,
        [propiedadExtraAManipular]: categoriasActualizadas,
        [propiedad]: categoriasModificadas,
      };
    });

    setCategoriaAEditar(nuevoValor);
  };

  const agregarElemento = (nuevoElemento) => {
    if (!nuevoElemento.trim()) return; // Evita agregar elementos vacíos

    setEspecificaciones((prev) => {
      const propiedadAManipular = prev[propiedadExtraAManipular] || {};

      // Evita duplicados en especificaciones
      if (propiedadAManipular[nuevoElemento] !== undefined) return prev;

      return {
        ...prev,
        [propiedadExtraAManipular]: {
          ...propiedadAManipular,
          [nuevoElemento]: [], // Agrega la clave con un array vacío
        },
      };
    });

    setPendientes((prev) => {
      // Evita duplicados en pendientes y especificaciones
      if (
        prev.includes(nuevoElemento) ||
        (especificaciones[propiedadExtraAManipular] &&
          especificaciones[propiedadExtraAManipular][nuevoElemento] !==
            undefined)
      ) {
        return prev;
      }
      return [...prev, nuevoElemento];
    });
  };

  const cancelarAccion = () => {
    setCategoriaAEditar(null);
    setCategoriaAEliminar(null);
    setModoActivado(false);
  };

  const eliminarDePropiedadExtra = (valorAEliminar) => {
    setEspecificaciones((prev) => {
      const nuevaPropiedadExtra = { ...prev[propiedadExtraAManipular] };
      delete nuevaPropiedadExtra[valorAEliminar]; // Elimina la clave del objeto

      return {
        ...prev,
        [propiedadExtraAManipular]: nuevaPropiedadExtra,
      };
    });
  };

  const eliminarDePropiedad = (valorAEliminar) => {
    setEspecificaciones((prev) => {
      const nuevaPropiedad = Object.fromEntries(
        Object.entries(prev[propiedad]).map(([key, array]) => [
          key,
          array.filter((v) => v !== valorAEliminar),
        ])
      );
      return {
        ...prev,
        [propiedad]: nuevaPropiedad,
      };
    });
  };

  const eliminarDePendientes = (valorAEliminar) => {
    setPendientes((prevPendientes) =>
      prevPendientes.filter((tag) => tag !== valorAEliminar)
    );
  };

  const eliminarReferenciasDeSubPropiedadExtra = (categoriaAEliminar) => {
    setEspecificaciones((prev) => {
      const copia = { ...prev[propiedadExtraAManipular] };
      // 🔹 Obtener los valores que vamos a eliminar
      const valoresEliminados = copia[categoriaAEliminar] || [];

      // 🔹 Eliminar referencias en subPropiedadExtraAManipular
      const nuevaPropiedadExtra = eliminarReferencias(copia, valoresEliminados);
      return {
        ...prev,
        [subPropiedadExtraAManipular]: nuevaPropiedadExtra,
      };
    });
  };
  // 🔹 Función auxiliar para eliminar claves de un objeto
  const eliminarReferencias = (mapa, lista) => {
    const copia = { ...mapa };
    lista.forEach((clave) => {
      delete copia[clave];
    });
    return copia;
  };

  const validarEliminarFuentesDeGastosEnUso = (categoria) => {
    const clavesEnUso = Object.keys(fuentesDeGastosEnUso);
    const fuentesDeGastos =
      especificaciones[propiedadExtraAManipular][categoria];

    const coincidencias = clavesEnUso.filter((key) =>
      fuentesDeGastos.includes(key)
    );

    if (coincidencias.length > 0) {
      Modal.warning({
        title: "Elementos en uso",
        content: `No se puede borrar "${categoria}" porque los siguientes elementos se encuentran en uso: "${coincidencias.join(
          ", "
        )}".`,
      });
      return false;
    }
    return true;
  };

  const eliminarElemento = () => {
    eliminarDePropiedadExtra(categoriaAEliminar);
    eliminarDePropiedad(categoriaAEliminar);
    eliminarDePendientes(categoriaAEliminar);
    eliminarReferenciasDeSubPropiedadExtra(categoriaAEliminar);
    setMostrarConfirmacion(false);
  };

  const ejecutarAccion = (valor) => {
    if (modoActivado && modo === "eliminar") {
      if (validarEliminarFuentesDeGastosEnUso(valor)) {
        setCategoriaAEliminar(valor);
        setMostrarConfirmacion(true);
      }
    } else if (modoActivado && modo === "modificar") {
      setCategoriaAEditar(valor);
    }
  };

  return (
    <>
      <Card className={css.card}>
        <div className={css.header}>
          <Title level={3} className={css.cardTitle}>
            Determinar Categorías
          </Title>
          <div className={css.buttonsContainer}>
            {modoActivado && modo === "agregar" && (
              <span className={css.placeholderText}>Agregar categoría</span>
            )}
            {modoActivado &&
              modo === "modificar" &&
              categoriaAEditar !== null && (
                <span className={css.placeholderText}>Modificar categoría</span>
              )}
            <ButtonDesplegable
              modo={modo}
              setModo={setModo}
              modoActivado={modoActivado}
              setModoActivado={setModoActivado}
              elementoEnSingular={"categoria"}
              accionesAdicionalesParaCancelar={cancelarAccion}
              cuandoMostrarBotonCancelar={[
                "agregar",
                categoriaAEditar !== null && "modificar",
              ].filter(Boolean)}
            />
          </div>
        </div>
        <div className={css.buttonsContainer}>
          <div>
            <Button
              type="primary"
              onClick={() => setRedeterminar(!redeterminar)}
              disabled={redeterminar}
            >
              Redeterminar
            </Button>

            {redeterminar && (
              <Button
                onClick={() => setRedeterminar(false)}
                danger
                size="small"
                ghost
              >
                Cancelar
              </Button>
            )}
          </div>
          {modoActivado && modo !== "agregar" && categoriaAEditar === null && (
            <Button onClick={cancelarAccion} danger>
              Cancelar
            </Button>
          )}

          {modoActivado &&
            ((modo === "modificar" && categoriaAEditar !== null) ||
              modo === "agregar") && (
              <InputDesplegable
                onAdd={(num) => {
                  if (modo === "agregar") {
                    agregarElemento(num);
                  } else if (modo === "modificar") {
                    modificarElemento(num, categoriaAEditar);
                  }
                }}
                placeholder={"Ingrese un valor"}
                onClose={() => setModoActivado(false)}
                type="text"
                valor={categoriaAEditar}
                estatico={true}
              />
            )}
        </div>
        <div className={css.contenedor}>
          {/* Bloque Principal */}
          <div className={css.bloque}>
            {Object.keys(especificaciones[propiedad]).map((determinacion) => (
              <div
                key={determinacion}
                className={css.categoria}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, determinacion)}
              >
                <strong>{determinacion}:</strong>
                {especificaciones[propiedad][determinacion].map(
                  (valor, index) => (
                    <Tag
                      key={index}
                      color="blue"
                      className={
                        modoActivado
                          ? css.modoSeleccionable
                          : redeterminar
                          ? css.modoMoverTag
                          : css.customTag
                      }
                      draggable={redeterminar}
                      onDragStart={(e) =>
                        handleDragStart(e, valor, determinacion)
                      }
                      onClick={() => {
                        ejecutarAccion(valor);
                      }}
                    >
                      {valor}
                    </Tag>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Bloque Pendientes */}
          <div className={css.bloque}>
            <strong>Pendientes a determinar:</strong>
            {pendientes.map((valor, index) => (
              <Tag
                key={index}
                color="orange"
                className={
                  modoActivado ? css.modoSeleccionable : css.modoMoverTag
                }
                draggable={!modoActivado}
                onDragStart={(e) => handleDragStart(e, valor, "pendientes")}
                onClick={() => {
                  ejecutarAccion(valor);
                }}
              >
                {valor}
              </Tag>
            ))}
          </div>
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
          onOk={eliminarElemento}
          onCancel={() => setMostrarConfirmacion(false)}
        >
          <p>{fraseDeEliminacion}</p>
          <p>¿Seguro que quieres eliminar {categoriaAEliminar}?</p>
        </Modal>
      </Card>
    </>
  );
};

export default Determinador;
