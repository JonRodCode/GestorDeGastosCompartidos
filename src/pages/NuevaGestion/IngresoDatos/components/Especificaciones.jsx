import { useEffect, useState } from "react";
import css from "../css/Especificaciones.module.css";
import ClasificadorDeDatos from "./Especificaciones/ClasificadorDeDatos";
import ClasificadorDeDatosEstatico from "./Especificaciones/ClasificadorDeDatosEstatico";
import Determinador from "./Especificaciones/Determinador";
import Excepciones from "./Especificaciones/Excepciones";
import PanelDeCargaDeEspecificaciones from "./Especificaciones/PanelDeCargaDeEspecificaciones";
import PanelDeEspecificaciones from "./Especificaciones/PanelDeEspecificaciones";
PanelDeCargaDeEspecificaciones;
import { Segmented } from "antd";

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

  const verificarCategorias = (
    existentes,
    nuevas,
    pendientes,
    setPendientes
  ) => {
    let valido = true;
    Object.keys(nuevas.categorias).forEach((categoria) => {
      if (pendientes.includes(categoria)) {
        setPendientes((prev) => prev.filter((c) => c !== categoria));
      } else {
        const existenteEn = Object.entries(existentes.determinaciones).find(
          ([_, lista]) => lista.includes(categoria)
        );
        const determinacionCorrespondiente = Object.entries(
          nuevas.determinaciones
        ).find(([_, lista]) => lista.includes(categoria));

        if (existenteEn) {
          const grupoExistente = existenteEn[0]; // Nombre de la determinación (ej: "GastoEquitativo")
          const grupoNuevo = determinacionCorrespondiente[0];
          if (grupoExistente !== grupoNuevo) {
            valido = false;
          }
        }
      }
    });
    return valido;
  };

  const verificarFuentesDeGasto = (
    existentes,
    nuevas,
    pendientes,
    setPendientes
  ) => {
    let valido = true;

    Object.keys(nuevas.fuenteDelGasto).forEach((fuente) => {
      if (pendientes.includes(fuente)) {
        setPendientes((prev) => prev.filter((f) => f !== fuente));
      } else {
        const existenteEn = Object.entries(existentes.categorias).find(
          ([_, lista]) => lista.includes(fuente)
        );

        const categoriaCorrespondiente = Object.entries(nuevas.categorias).find(
          ([_, lista]) => lista.includes(fuente)
        );

        if (existenteEn) {
          const grupoExistente = existenteEn[0]; // Nombre de la determinación (ej: "GastoEquitativo")
          const grupoNuevo = categoriaCorrespondiente[0];
          if (grupoExistente !== grupoNuevo) {
            valido = false;
          }
        }
      }
    });

    return valido;
  };
  const verificarConsumos = (existentes, nuevas, pendientes, setPendientes) => {
    let valido = true;

    // Obtener todos los consumos desde nuevas.fuenteDelGasto
    const nuevosConsumos = Object.values(nuevas.fuenteDelGasto).flat();

    nuevosConsumos.forEach((consumo) => {
      if (pendientes.includes(consumo)) {
        setPendientes((prev) => prev.filter((c) => c !== consumo));
      } else {
        const existenteEn = Object.entries(existentes.fuenteDelGasto).find(
          ([_, lista]) => lista.includes(consumo)
        );

        if (existenteEn) {
          const fuenteExistente = existenteEn[0]; // Fuente en existentes
          const fuenteNueva = Object.entries(nuevas.fuenteDelGasto).find(
            ([_, lista]) => lista.includes(consumo)
          )?.[0]; // Fuente en nuevas

          if (fuenteExistente !== fuenteNueva) {
            valido = false;
          }
        }
      }
    });
    return valido;
  };

  const verificarEspecificacionesNuevas = (nuevas) => {
    const categoriasValidas = verificarCategorias(
      especificaciones,
      nuevas,
      categoriasPendientes,
      setCategoriasPendientes
    );

    if (!categoriasValidas) return false;

    const fuentesValidas = verificarFuentesDeGasto(
      especificaciones,
      nuevas,
      fuentesDeGastosPendientes,
      setFuenteDeGastosPendientes
    );

    if (!fuentesValidas) return false;

    const consumosValidos = verificarConsumos(
      especificaciones,
      nuevas,
      consumosPendientesParaClasificar,
      setConsumosPendientesParaClasificar
    );

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

  const verificarSiHayConflictosConLasExcepciones = () => {
    
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
          />
        )}
      </div>
      <div className={css.container}>
        <Segmented
          options={["Panel general", "Determinación", "Clasificación", "Excepciones"]}
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
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Especificaciones;
