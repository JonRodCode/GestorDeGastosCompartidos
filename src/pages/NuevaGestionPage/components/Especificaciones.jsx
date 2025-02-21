//import css from "../css/Especificaciones.module.css";
import ClasificadorDeDatos from "./ClasificadorDeDatos";
import ClasificadorDeDatosEstatico from "./ClasificadorDeDatosEstatico";

const Especificaciones = ({ especificaciones, setEspecificaciones }) => {

if (especificaciones.fuenteDelGasto)
  
  return (
    <>
      <ClasificadorDeDatos
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedad="categorias"
        
  propiedadExtraAManipular="fuenteDelGasto"
        config={{
          elementoAClasificar : "Fuentes de Gastos",
          elementoEnSingular: "fuente de gastos",
          temaDeClasificacionEnPlural : "categorías",
          temaDeClasificacionEnSingular : "categoría",
          letra : "a"
          }}
      />
<ClasificadorDeDatosEstatico
        especificaciones={especificaciones}
        setEspecificaciones={setEspecificaciones}
        propiedad="fuenteDelGasto"
        config={{
          elementoAClasificar : "Consumos de Tarjeta de Credito",
          elementoEnSingular: "nombre de consumo",
          temaDeClasificacionEnPlural : "fuentes de gastos",
          temaDeClasificacionEnSingular : "fuente",
          letra : "a"
          }}
      />
    </>
  );
};

export default Especificaciones;
