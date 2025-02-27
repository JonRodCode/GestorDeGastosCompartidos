import css from "../css/Especificaciones.module.css";
import ClasificadorDeDatos from "./Especificaciones/ClasificadorDeDatos";
import ClasificadorDeDatosEstatico from "./Especificaciones/ClasificadorDeDatosEstatico";
import Determinador from "./Especificaciones/Determinador";
import PanelDeEspecificaciones from "./Especificaciones/PanelDeEspecificaciones";
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
  fuentesDeGastosEnUso,
  consumosPendientesParaClasificar,
  setConsumosPendientesParaClasificar,
  consumosEnUso,
  setElementoAReclasificar
}) => {
  const fraseDeEliminacion =
    "Se eliminarán todas las fuentes de gastos asociadas a la categoria seleccionada y todos los consumos asociados a cada una de esas fuentes de gastos.";
  return (
    <>
      <div className={css.container}>
        <Segmented
          options={["Panel general", "Determinación", "Clasificación"]}
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
        </div>
      </div>
    </>
  );
};

export default Especificaciones;
