//import css from "../css/Especificaciones.module.css";
import ClasificadorDeDatos from "./ClasificadorDeDatos";

const Especificaciones = ({ especificaciones, setEspecificaciones }) => {
  
  return (
    <>
      <ClasificadorDeDatos
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedad="categorias"
        config={{
          elementoAClasificar : "Fuentes de Gastos",
          elementoEnSingular: "fuente de gastos",
          temaDeClasificacionEnPlural : "categorías",
          temaDeClasificacionEnSingular : "categoría",
          letra : "a"
          }}
      />
      <ClasificadorDeDatos
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedad="fuenteDelGasto"
        config={{
          elementoAClasificar : "Consumos de Tarjeta",
          elementoEnSingular: "consumo",
          temaDeClasificacionEnPlural : "fuentes de gastos",
          temaDeClasificacionEnSingular : "fuente",
          letra : "a"
          }}
      />
    </>
  );
};

export default Especificaciones;
