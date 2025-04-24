import { useState } from "react";
import { Typography, Card, Modal, Button } from "antd";
import InputDesplegable from "../../../../../components/InputDesplegable";
import ButtonDesplegable from "../../../../../components/ButtonDesplegable";
import css from "../../css/ClasificadorDeDatos.module.css";
import Categoria from "./Categoria";
import ClasificacionPendiente from "./ClasificacionPendiente";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ClasificadorDeDatos = ({
  especificaciones,
  setEspecificaciones,
  propiedadManipuladaSuperior,
  propiedad,
  propiedadExtraAManipular,
  setPendientes,
  setPendienteConsumos,
  fuentesDeGastosPendientes,
  setfuentesDeGastosPendientes,
  fuentesDeGastosEnUso,
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
        (especificaciones[propiedad] &&
          especificaciones[propiedad][nuevoElemento] !== undefined)
      ) {
        return prev;
      }
      return [...prev, nuevoElemento];
    });
  };

  const actualizarCategoriasYValores = (categoria, nombre, nuevosValores, num) => {
    setEspecificaciones((prev) => {
      // 1. Eliminar el valor de la categoría actual
      const valoresActuales = prev[propiedad][categoria] || [];
      const nuevosValoresCategoria = valoresActuales .filter((item) => item !== num);

     
      // 3. Crear la nueva especificación con todos los cambios
      const nuevaEspecificacion = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          [categoria]: nuevosValoresCategoria,  // Categoría sin el valor eliminado
          [nombre]: nuevosValores,  // Nueva categoría con el valor agregado
        }
      };

      return nuevaEspecificacion;
    });
};
const esUnValorValido = (valor) => {
  return (
      (especificaciones[propiedad] &&
          Object.values(especificaciones[propiedad]).some(arr => arr.includes(valor))) ||
      fuentesDeGastosPendientes.includes(valor) // Aceptar también valores de pendientes
  );
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
        if (!nuevaEspecificacion[propiedadExtraAManipular][num]) {
          nuevaEspecificacion[propiedadExtraAManipular][num] = []; // Solo si no existe
        }
        setPendienteConsumos((prev) =>
          prev.filter((valor) => !nuevaEspecificacion[propiedadExtraAManipular][num].includes(valor))
        );
        
        
      } else if (
        tipo === "eliminar" &&
        nuevaEspecificacion[propiedadExtraAManipular][num]
      ) {
        delete nuevaEspecificacion[propiedadExtraAManipular][num];
      }

      return nuevaEspecificacion;
    });
  };

  const copiarPropiedades = (prev, propiedad, propiedadExtraAManipular) => {
    return {
      copia: { ...prev[propiedad] },
      copiaDePropiedadExtra: { ...prev[propiedadExtraAManipular] },
    };
  };

  const eliminarReferenciasEnPropiedadExtra = (
    copiaDePropiedadExtra,
    valoresEliminados
  ) => {
    return eliminarReferencias(copiaDePropiedadExtra, valoresEliminados);
  };

  const actualizarPropiedadManipuladaSuperior = (
    prev,
    propiedadManipuladaSuperior,
    categoriaAEliminar
  ) => {
    return Object.fromEntries(
      Object.entries(prev[propiedadManipuladaSuperior]).map(([key, value]) => [
        key,
        Array.isArray(value)
          ? value.filter((item) => item !== categoriaAEliminar)
          : value,
      ])
    );
  };

  const validarEliminarFuentesDeGastosEnUso = (categoria) => {
    const clavesEnUso = Object.keys(fuentesDeGastosEnUso);
    const fuentesDeGastos = especificaciones[propiedad][categoria];
    
    if (!Array.isArray(fuentesDeGastos)) {
      return false;
  }
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

  const eliminarCategoria = () => {
    validarEliminarFuentesDeGastosEnUso();

    setEspecificaciones((prev) => {
      const { copia, copiaDePropiedadExtra } = copiarPropiedades(
        prev,
        propiedad,
        propiedadExtraAManipular
      );
      const valoresEliminados = copia[categoriaAEliminar] || [];

      const nuevaPropiedadExtra = eliminarReferenciasEnPropiedadExtra(
        copiaDePropiedadExtra,
        valoresEliminados
      );
      delete copia[categoriaAEliminar];

      const nuevaPropiedad = actualizarPropiedadManipuladaSuperior(
        prev,
        propiedadManipuladaSuperior,
        categoriaAEliminar
      );

      return {
        ...prev,
        [propiedad]: copia,
        [propiedadExtraAManipular]: nuevaPropiedadExtra,
        [propiedadManipuladaSuperior]: nuevaPropiedad,
      };
    });
    setPendientes((prev) => prev.filter((item) => item !== categoriaAEliminar));
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
    if (
      !nuevoNombre.trim() ||
      especificaciones[propiedad]?.[nuevoNombre] !== undefined
    ) {
      Modal.error({
        title: "Error",
        content: `La categoría "${nuevoNombre}" ya existe.`,
      });
      return; // Cancela la función inmediatamente
    }

    // Modificar en pendientes si está ahí
    setPendientes((prev) =>
      prev.includes(categoriaAEditar)
        ? prev.map((item) => (item === categoriaAEditar ? nuevoNombre : item))
        : prev
    );

    // Modificar dentro de especificaciones[propiedadManipuladaSuperior]
    setEspecificaciones((prev) => {
      const nuevaPropiedad = Object.fromEntries(
        Object.entries(prev[propiedad]).map(([key, value]) =>
          key === categoriaAEditar ? [nuevoNombre, value] : [key, value]
        )
      );

      const nuevaPropiedadSuperior = Object.fromEntries(
        Object.entries(prev[propiedadManipuladaSuperior]).map(
          ([key, array]) => [
            key,
            array.map((item) =>
              item === categoriaAEditar ? nuevoNombre : item
            ),
          ]
        )
      );

      return {
        ...prev,
        [propiedad]: nuevaPropiedad,
        [propiedadManipuladaSuperior]: nuevaPropiedadSuperior,
      };
    });

    setCategoriaAEditar(null);
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
          <ButtonDesplegable
            modo={modo}
            setModo={setModo}
            modoActivado={modoActivado}
            setModoActivado={setModoActivado}
            elementoEnSingular={config.temaDeClasificacionEnSingular}
          />
        </div>
      </div>
      <div className={css.buttonsContainer}>
      <ClasificacionPendiente
        pendientes={fuentesDeGastosPendientes}
        titulo={"Pendientes de clasificar: "}
        tagsMovibles={true}
      />

{modoActivado && fuentesDeGastosPendientes.length !== 0 && (
          <Button onClick={cancelarAccion} danger>
            Cancelar
          </Button>)}
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
            estatico={true}
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
        {modoActivado && fuentesDeGastosPendientes.length === 0 && (
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
                actualizarCategoriasYFuentes={actualizarCategoriasYValores}
                activable={!modoActivado}
                validarEliminacion={true}
                fraseDeEliminacion={config.fraseDeEliminacionParaSingular}
                pendientes={fuentesDeGastosPendientes}
                setPendientes={setfuentesDeGastosPendientes}
                elementosEnUso={fuentesDeGastosEnUso}
                esUnValorValido={esUnValorValido}
                temaCentral="gasto"
              />
            )}

            {modoActivado && modo === "eliminar" && (
              <span
                className={css.textoRojo}
                onClick={() => {
                  if (validarEliminarFuentesDeGastosEnUso(key)) {
                    setCategoriaAEliminar(key);
                    setMostrarConfirmacion(true);
                  }
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
