//import css from "../css/Especificaciones.module.css";
import { useState } from "react";
import ClasificadorDeDatos from "./Especificaciones/ClasificadorDeDatos";
import ClasificadorDeDatosEstatico from "./Especificaciones/ClasificadorDeDatosEstatico";
import Determinador from "./Especificaciones/Determinador";

const Especificaciones = ({ especificaciones, setEspecificaciones }) => {
  const [pendientes, setPendientes] = useState([]);

  return (
    <>
      <Determinador
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedad="determinaciones"
        propiedadExtraAManipular="categorias"
        pendientes={pendientes}
        setPendientes={setPendientes}
      />

      <ClasificadorDeDatos
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedadManipuladaSuperior="determinaciones"
        propiedad="categorias"
        propiedadExtraAManipular="fuenteDelGasto"
        setPendientes={setPendientes}
        config={{
          elementoAClasificar: "Fuentes de Gastos",
          elementoEnSingular: "fuente de gastos",
          temaDeClasificacionEnPlural: "categorías",
          temaDeClasificacionEnSingular: "categoría",
          letra: "a",
          fraseDeEliminacion:
            "Se eliminarán todas las fuentes de gastos asociadas a la categoria seleccionada y todos los consumos asociados a cada una de esas fuentes de gastos.",
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
