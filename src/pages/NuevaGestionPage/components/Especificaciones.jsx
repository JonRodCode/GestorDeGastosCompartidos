//import css from "../css/Especificaciones.module.css";
import ClasificadorDeDatos from "./Especificaciones/ClasificadorDeDatos";
import ClasificadorDeDatosEstatico from "./Especificaciones/ClasificadorDeDatosEstatico";
import Determinador from "./Especificaciones/Determinador";

const Especificaciones = ({
  especificaciones,
  setEspecificaciones,
  categoriasPendientes,
  setCategoriasPendientes,
  fuentesDeGastosPendientes,
  setFuenteDeGastosPendientes,
  fuentesDeGastosEnUso,
  //setFuentesDeGastosEnUso,
}) => {
  const fraseDeEliminacion =
    "Se eliminarán todas las fuentes de gastos asociadas a la categoria seleccionada y todos los consumos asociados a cada una de esas fuentes de gastos.";

  return (
    <>
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

      <ClasificadorDeDatos
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedadManipuladaSuperior="determinaciones"
        propiedad="categorias"
        propiedadExtraAManipular="fuenteDelGasto"
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
        config={{
          elementoAClasificar: "Consumos de Tarjeta de Credito",
          elementoEnSingular: "nombre de consumo",
          temaDeClasificacionEnPlural: "fuentes de gastos",
          temaDeClasificacionEnSingular: "fuente",
          letra: "a",
        }}
      />
    </>
  );
};

export default Especificaciones;
