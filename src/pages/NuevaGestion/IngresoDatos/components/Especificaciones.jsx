import { useEffect, useState } from "react";
import css from "../css/Especificaciones.module.css";
import ClasificadorDeDatos from "./Especificaciones/ClasificadorDeDatos";
import ClasificadorDeDatosEstatico from "./Especificaciones/ClasificadorDeDatosEstatico";
import Determinador from "./Especificaciones/Determinador";
import Excepciones from "./Especificaciones/Excepciones";
import PanelDeCargaDeEspecificaciones from "./Especificaciones/PanelDeCargaDeEspecificaciones";
import PanelDeEspecificaciones from "./Especificaciones/PanelDeEspecificaciones";
PanelDeCargaDeEspecificaciones;
import { Segmented, Modal } from "antd";

const Especificaciones = ({
  especificaciones,
  setEspecificaciones,
  vista,
  setVista,
  categoriasPendientes,
  setCategoriasPendientes,
  fuentesDeGastosPendientes,
  setFuenteDeGastosPendientes,
  fuentesDeGastosEnUsoPorPersona,
  consumosPendientesParaClasificar,
  setConsumosPendientesParaClasificar,
  consumosEnUsoPorPersona,
  setElementoAReclasificar,
  mostrarInputEspecificaciones,
}) => {
  const [contadorDeExcepciones, setContadoDeExcepciones] = useState(0);
  const [fuentesDeGastosEnUso, setFuentesDeGastosEnUso] = useState({});
  const [consumosEnUso, setConsumosEnUso] = useState({});
  const fraseDeEliminacion =
    "Se eliminarán todas las fuentes de gastos asociadas a la categoria seleccionada y todos los consumos asociados a cada una de esas fuentes de gastos.";

  const agruparElementosEnUso = (elementosEnUsoPorPersona) => {
    const elementosAgrupados = {};

    Object.values(elementosEnUsoPorPersona).forEach((elementos) => {
      Object.entries(elementos).forEach(([elemento, cantidad]) => {
        elementosAgrupados[elemento] =
          (elementosAgrupados[elemento] || 0) + cantidad;
      });
    });

    return elementosAgrupados;
  };

  useEffect(() => {
    setFuentesDeGastosEnUso(
      agruparElementosEnUso(fuentesDeGastosEnUsoPorPersona)
    );
  }, [fuentesDeGastosEnUsoPorPersona]);

  useEffect(() => {
    setConsumosEnUso(agruparElementosEnUso(consumosEnUsoPorPersona));
  }, [consumosEnUsoPorPersona]);

  const verificarCategorias = (existentes, nuevas, pendientes) => {
    let valido = true;
    const pendientesFiltrados = [...pendientes];
  
    Object.keys(nuevas.categorias).forEach((categoria) => {
      if (pendientes.includes(categoria)) {
        // Marcar para eliminación sin modificar el estado
        const index = pendientesFiltrados.indexOf(categoria);
        if (index !== -1) pendientesFiltrados.splice(index, 1);
      } else {
        const existenteEn = Object.entries(existentes.determinaciones).find(
          ([_, lista]) => lista.includes(categoria)
        );
        const determinacionCorrespondiente = Object.entries(
          nuevas.determinaciones
        ).find(([_, lista]) => lista.includes(categoria));
  
        if (existenteEn) {
          const grupoExistente = existenteEn[0];
          const grupoNuevo = determinacionCorrespondiente?.[0];
          if (grupoExistente !== grupoNuevo) {
            valido = false;
          }
        }
      }
    });
  
    return { valido, pendientesFiltrados };
  };
  
  const verificarFuentesDeGasto = (existentes, nuevas, pendientes) => {
    let valido = true;
    const pendientesFiltrados = [...pendientes];
  
    Object.keys(nuevas.fuenteDelGasto).forEach((fuente) => {
      if (pendientes.includes(fuente)) {
        const index = pendientesFiltrados.indexOf(fuente);
        if (index !== -1) pendientesFiltrados.splice(index, 1);
      } else {
        const existenteEn = Object.entries(existentes.categorias).find(
          ([_, lista]) => lista.includes(fuente)
        );
  
        const categoriaCorrespondiente = Object.entries(nuevas.categorias).find(
          ([_, lista]) => lista.includes(fuente)
        );
  
        if (existenteEn) {
          const grupoExistente = existenteEn[0];
          const grupoNuevo = categoriaCorrespondiente?.[0];
          if (grupoExistente !== grupoNuevo) {
            valido = false;
          }
        }
      }
    });
  
    return { valido, pendientesFiltrados };
  };
  
  const verificarConsumos = (existentes, nuevas, pendientes) => {
    let valido = true;
    const pendientesFiltrados = [...pendientes];
  
    const nuevosConsumos = Object.values(nuevas.fuenteDelGasto).flat();
  
    nuevosConsumos.forEach((consumo) => {
      if (pendientes.includes(consumo)) {
        const index = pendientesFiltrados.indexOf(consumo);
        if (index !== -1) pendientesFiltrados.splice(index, 1);
      } else {
        const existenteEn = Object.entries(existentes.fuenteDelGasto).find(
          ([_, lista]) => lista.includes(consumo)
        );
  
        if (existenteEn) {
          const fuenteExistente = existenteEn[0];
          const fuenteNueva = Object.entries(nuevas.fuenteDelGasto).find(
            ([_, lista]) => lista.includes(consumo)
          )?.[0];
  
          if (fuenteExistente !== fuenteNueva) {
            valido = false;
          }
        }
      }
    });
  
    return { valido, pendientesFiltrados };
  };
  
  const verificarEspecificacionesNuevas = (nuevas) => {
    const { valido: categoriasValidas, pendientesFiltrados: categoriasFinales } =
      verificarCategorias(especificaciones, nuevas, categoriasPendientes);
  
    if (!categoriasValidas) return false;
  
    const { valido: fuentesValidas, pendientesFiltrados: fuentesFinales } =
      verificarFuentesDeGasto(especificaciones, nuevas, fuentesDeGastosPendientes);
  
    if (!fuentesValidas) return false;
  
    const { valido: consumosValidos, pendientesFiltrados: consumosFinales } =
      verificarConsumos(especificaciones, nuevas, consumosPendientesParaClasificar);
  
    // Aplicar cambios en el estado en un solo paso
    setCategoriasPendientes(categoriasFinales);
    setFuenteDeGastosPendientes(fuentesFinales);
    setConsumosPendientesParaClasificar(consumosFinales);
  
    return consumosValidos;
  };
  

  const verificarSiHayDatos = () => {
    const hayPendientes =
      categoriasPendientes.length > 0 ||
      fuentesDeGastosPendientes.length > 0 ||
      consumosPendientesParaClasificar.length > 0;

    if (hayPendientes) return true;

    return Object.entries(especificaciones).some(([key, value]) => {
      if (
        key === "determinaciones" &&
        typeof value === "object" &&
        value !== null
      ) {
        const hayListasConDatos = Object.values(value).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        );
        return hayListasConDatos;
      }
      const esArrayConDatos = Array.isArray(value) && value.length > 0;
      return esArrayConDatos;
    });
  };

  const agregarNuevasEspecificaciones = (nuevas) => {
    // Procesar determinaciones
    Object.entries(especificaciones.determinaciones).forEach(
      ([key, values]) => {
        setCategoriasPendientes((prev) =>
          prev.filter((c) => !values.includes(c))
        );

        if (!nuevas.determinaciones[key]) {
          nuevas.determinaciones[key] = [...values];
        } else {
          nuevas.determinaciones[key] = [
            ...new Set([...nuevas.determinaciones[key], ...values]),
          ];
        }
      }
    );

    // Procesar categorías
    Object.entries(especificaciones.categorias).forEach(([key, values]) => {
      setFuenteDeGastosPendientes((prev) =>
        prev.filter((c) => !values.includes(c))
      );

      if (!nuevas.categorias[key]) {
        nuevas.categorias[key] = [...values];
      } else {
        nuevas.categorias[key] = [
          ...new Set([...nuevas.categorias[key], ...values]),
        ];
      }
    });

    // Procesar fuenteDelGasto
    Object.entries(especificaciones.fuenteDelGasto).forEach(([key, values]) => {
      setConsumosPendientesParaClasificar((prev) =>
        prev.filter((c) => !values.includes(c))
      );

      if (!nuevas.fuenteDelGasto[key]) {
        nuevas.fuenteDelGasto[key] = [...values];
      } else {
        nuevas.fuenteDelGasto[key] = [
          ...new Set([...nuevas.fuenteDelGasto[key], ...values]),
        ];
      }
    });

    return nuevas;
  };

  const verificarSiHayConflictosConLosElementosEnUso = (nuevas) => {
    const nuevasCategorias = Object.values(nuevas.categorias).flat();
    const nuevasFuentesDeGasto = Object.values(nuevas.fuenteDelGasto).flat();

    const hayConflictoFuentes = Object.keys(fuentesDeGastosEnUso).some(
      (fuente) => !nuevasCategorias.includes(fuente)
    );

    const hayConflictoConsumos = Object.keys(consumosEnUso).some(
      (consumo) => !nuevasFuentesDeGasto.includes(consumo)
    );

    return hayConflictoFuentes || hayConflictoConsumos;
  };

  const verificarSiHayConflictosConLasExcepciones = (
    nuevasEspecificaciones
  ) => {
    const nuevasExcepcionesGlobales =
      nuevasEspecificaciones["excepcionesGlobales"];

    for (const key in nuevasExcepcionesGlobales) {
      const nuevasExcepciones = nuevasExcepcionesGlobales[key];
      for (const nuevaExcepcion of nuevasExcepciones) {
        const validado = hayDuplicados(nuevaExcepcion, false, false);
        if (validado) {        
          return true;
        }
      }
    }
    return false;
  };

  const formatKey = (key) => {
    return key.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const hayDuplicados = (nuevaExcepcion, esEditado, mostrarModal = true) => {
    const excepcionesGlobales = especificaciones["excepcionesGlobales"];

    for (const key in excepcionesGlobales) {
      const excepciones = excepcionesGlobales[key];

      for (const excepcion of excepciones) {
        if (esEditado && excepcion.id === nuevaExcepcion.id) {
          continue;
        }

        if (
          excepcion.persona?.toLowerCase() ===
            nuevaExcepcion.persona?.toLowerCase() &&
          excepcion.fuenteDelGasto?.toLowerCase() ===
            nuevaExcepcion.fuenteDelGasto?.toLowerCase() &&
          excepcion.detalle?.toLowerCase() ===
            nuevaExcepcion.detalle?.toLowerCase() &&
          excepcion.tipo?.toLowerCase() ===
            nuevaExcepcion.tipo?.toLowerCase() &&
          excepcion?.prestamoDe?.toLowerCase() ===
            nuevaExcepcion?.prestamoDe?.toLowerCase() &&
          excepcion?.banco?.toLowerCase() ===
            nuevaExcepcion?.banco?.toLowerCase() &&
          excepcion?.tarjeta?.toLowerCase() ===
            nuevaExcepcion?.tarjeta?.toLowerCase() &&
          excepcion?.numFinalTarjeta?.toLowerCase() ===
            nuevaExcepcion?.numFinalTarjeta?.toLowerCase() &&
          excepcion?.aNombreDe?.toLowerCase() ===
            nuevaExcepcion?.aNombreDe?.toLowerCase() &&
          excepcion?.tipoTarjeta?.toLowerCase() ===
            nuevaExcepcion?.tipoTarjeta?.toLowerCase() &&
          excepcion?.nombreConsumo?.toLowerCase() ===
            nuevaExcepcion?.nombreConsumo?.toLowerCase()
        ) {
          if (mostrarModal) {
            Modal.warning({
              title: "Excepción duplicada",
              content: `Ya existe una excepción con los mismos datos como "${formatKey(
                key
              )}".`,
              onOk() {},
            });
          }
          return true;
        }
      }
    }
    return false;
  };

  const eliminarPendientes = () => {
    setCategoriasPendientes([]);
    setFuenteDeGastosPendientes([]);
    setConsumosPendientesParaClasificar([]);
  };

  return (
    <>
      <div className={css.containerPanel}>
        {mostrarInputEspecificaciones && (
          <PanelDeCargaDeEspecificaciones
            especificaciones={especificaciones}
            setEspecificaciones={setEspecificaciones}
            agregarNuevasEspecificaciones={agregarNuevasEspecificaciones}
            verificarEspecificacionesNuevas={verificarEspecificacionesNuevas}
            verificarSiHayDatos={verificarSiHayDatos}
            verificarSiHayConflictosConLosElementosEnUso={
              verificarSiHayConflictosConLosElementosEnUso
            }
            verificarSiHayConflictosConLasExcepciones={
              verificarSiHayConflictosConLasExcepciones
            }
            eliminarPendientes={eliminarPendientes}
          />
        )}
      </div>
      <div className={css.container}>
        <Segmented
          options={[
            "Panel general",
            "Determinación",
            "Clasificación",
            "Excepciones",
          ]}
          value={vista}
          onChange={setVista}
          className={css.customSegmented}
        />
        <div className={css.vistaContainer}>
          {vista === "Panel general" && (
            <PanelDeEspecificaciones especificaciones={especificaciones} />
          )}
          {vista === "Determinación" && (
            <Determinador
              especificaciones={especificaciones}
              setEspecificaciones={setEspecificaciones}
              propiedad="determinaciones"
              propiedadExtraAManipular="categorias"
              subPropiedadExtraAManipular="fuenteDelGasto"
              pendientes={categoriasPendientes}
              setPendientes={setCategoriasPendientes}
              fuentesDeGastosEnUso={fuentesDeGastosEnUso}
              fraseDeEliminacion={fraseDeEliminacion}
            />
          )}
          {vista === "Clasificación" && (
            <>
              <ClasificadorDeDatos
                especificaciones={especificaciones}
                setEspecificaciones={setEspecificaciones}
                propiedadManipuladaSuperior="determinaciones"
                propiedad="categorias"
                propiedadExtraAManipular="fuenteDelGasto"
                setPendienteConsumos={setConsumosPendientesParaClasificar}
                setPendientes={setCategoriasPendientes}
                fuentesDeGastosPendientes={fuentesDeGastosPendientes}
                setfuentesDeGastosPendientes={setFuenteDeGastosPendientes}
                fuentesDeGastosEnUso={fuentesDeGastosEnUso}
                config={{
                  elementoAClasificar: "Fuentes de Gastos",
                  elementoEnSingular: "fuente de gastos",
                  temaDeClasificacionEnPlural: "categorías",
                  temaDeClasificacionEnSingular: "categoría",
                  letra: "a",
                  fraseDeEliminacion: fraseDeEliminacion,
                  fraseDeEliminacionParaSingular:
                    "Se eliminará la fuente de gastos y todos los consumos asociados a ella.",
                }}
              />

              <ClasificadorDeDatosEstatico
                especificaciones={especificaciones}
                setEspecificaciones={setEspecificaciones}
                propiedad="fuenteDelGasto"
                pendientes={consumosPendientesParaClasificar}
                setPendientes={setConsumosPendientesParaClasificar}
                elementosEnUso={consumosEnUso}
                pendientesDelSuperior={fuentesDeGastosPendientes}
                setElementoAReclasificar={setElementoAReclasificar}
                config={{
                  elementoAClasificar: "Consumos de Tarjeta de Credito",
                  elementoEnSingular: "nombre de consumo",
                  temaDeClasificacionEnPlural: "fuentes de gastos",
                  temaDeClasificacionEnSingular: "fuente",
                  letra: "a",
                }}
              />
            </>
          )}
          {vista === "Excepciones" && (
            <Excepciones
              especificaciones={especificaciones}
              setEspecificaciones={setEspecificaciones}
              contadorDeExcepciones={contadorDeExcepciones}
              setContadoDeExcepciones={setContadoDeExcepciones}
              hayDuplicados={hayDuplicados}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Especificaciones;
