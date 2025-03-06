import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Alert } from "antd";
import css from "./css/AnalisisClasificacion.module.css"
import Personas from "./components/Personas";
import GastosClasificados from "./components/GastosClasificados";

const NuevaGestionAnalisisClasificacion = () => {
  const [activeView, setActiveView] = useState("view1");
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("gastosClasificados"))  );
  const personasGuardadas = JSON.parse(sessionStorage.getItem("listaDePersonas")) || [];    
  const personasConCampos = personasGuardadas.map(persona => ({
    ...persona,
    ganancias: [],
    personasACargo: 0, 
  }));
  
  const [listaDePersonas, setListaDePersonas] = useState(personasConCampos);

  const [nuevaRespuesta, setNuevaRespuesta] = useState("No se cargo nada");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const prepararDatos = () => {
    return listaDePersonas.map(persona => {
      // Filtrar los gastos de la persona
      const gastosPersona = data.filter(gasto => gasto.persona === persona.nombre);
  
      // Clasificar los gastos según las condiciones dadas
      const gastosEquitativosPagados = gastosPersona.filter(gasto => 
        (gasto.tipo === "basico" || gasto.tipo === "debito") && gasto.determinacion === "GastoEquitativo"
      ).map(gasto => gasto.monto);
  
      const gastosEquitativosPendientes = gastosPersona.filter(gasto => 
        (gasto.tipo === "prestamo" || gasto.tipo === "credito") && gasto.determinacion === "GastoEquitativo"
      ) .map(gasto => gasto.monto);
  
      const gastosIgualitariosPagados = gastosPersona.filter(gasto => 
        (gasto.tipo === "basico" || gasto.tipo === "debito") && gasto.determinacion === "GastoIgualitario"
      ).map(gasto => gasto.monto);
  
      const gastosIgualitariosPendientes = gastosPersona.filter(gasto => 
        (gasto.tipo === "prestamo" || gasto.tipo === "credito") && gasto.determinacion === "GastoIgualitario"
      ).map(gasto => gasto.monto);
  
      return {
        nombre: persona.nombre,
        personasACargo: persona.personasACargo,
        ganancias: persona.ganancias.map(g => g.monto),
        gastosEquitativosPagados,
        gastosEquitativosPendientes,
        gastosIgualitariosPagados,
        gastosIgualitariosPendientes,
        gastosPersonalesDeOtros: {}
      };
    });
  };



  const distribuirGastos = async () => {
    setLoading(true);
    const datos = prepararDatos();
    console.log(datos)
    try {
      const response = await fetch(
        "http://localhost:6061/resumen",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      if (response.ok) {
        const respuesta = await response.json();
        console.log("Respuesta del servidor:", respuesta);
        setTimeout(() => {
          setLoading(false);
        setNuevaRespuesta(respuesta);
        sessionStorage.setItem("resumenDeDistribucion", JSON.stringify(respuesta));
        //navigate("/NuevaGestion/AnalisisClasificacion");
      }, 2000); 

      } else {
        console.error("Error en la petición");
        setNuevaRespuesta(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Hubo un error:", error);
      setNuevaRespuesta(null);
      setLoading(false);
    } 
  };

  return (
    <>
      <h1>Gestión de Análisis de Clasificación</h1>
      <div className={css.buttonContainer}>
        <Button
          className={
            activeView === "view1" ? css.activeButton : css.defaultButton
          }
          onClick={() => setActiveView("view1")}
        >
          Gastos
        </Button>
        <Button
          className={
            activeView === "view2" ? css.activeButton : css.defaultButton
          }
          onClick={() => setActiveView("view2")}
        >
          Personas
        </Button>
      </div>

      {activeView === "view1" && (
        <GastosClasificados
        data={data}
        setData={setData}
        />)}
        {activeView === "view2" && (
      <Personas
      listaDePersonas={listaDePersonas}
      setListaDePersonas={setListaDePersonas}
      />)}
    <div>
     <Button onClick={distribuirGastos} disabled={loading} type="primary">
        {loading ? <Spin size="small" /> : "Distribuir Gastos"}
      </Button>
      {!nuevaRespuesta && !loading && (
        <Alert
          message="No se pudo comunicar con el servidor"
          type="info"
          showIcon
          style={{ marginTop: "10px" }}
        />
      )} 
      </div>       
      <pre>{JSON.stringify(nuevaRespuesta, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default NuevaGestionAnalisisClasificacion;
