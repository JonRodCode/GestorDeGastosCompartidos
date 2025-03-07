import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, Alert, Modal } from "antd";
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
  const [gastosEditados, setGastosEditados] = useState([]); 
  const [visibleColumns, setVisibleColumns] = useState({
    persona: true,
    tipoDeImporte: true,
    tipo: true,
    categoria: true,
    fuenteDelGasto: true,
    detalle: true,
    monto: true,
    fecha: false,
    tarjeta: false,
    tipoTarjeta: false,
    aNombreDe: false,
    banco: false,
    numFinalTarjeta: false,
    nombreConsumo: false,
    cuotaActual: false,
    totalDeCuotas: false,
    determinacion: true,
    excepcion: true,
    acciones: true,
  });

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

  const condicionesAprobadasParaDistribucion = () => {
    const esValido = listaDePersonas.every(persona => persona.ganancias && persona.ganancias.length > 0);
      if (!esValido) {
      Modal.warning({
        title: "Faltan datos",
        content: "Todas las personas deben tener como mínimo 1 ganancia.",
        okText: "Aceptar",
      });
      return false;
    }
    return true;
  };

  const distribuirGastos = async () => {

    if (!condicionesAprobadasParaDistribucion()){
      return;
    }

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
        sessionStorage.setItem("gastosClasificadosFinales", JSON.stringify(data));
        sessionStorage.setItem("listaDePersonasConGanancias", JSON.stringify(listaDePersonas)); 
        sessionStorage.setItem("resumenDeDistribucion", JSON.stringify(respuesta));
        navigate("/NuevaGestion/DistribucionFinal");
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
        gastosEditados={gastosEditados}
        setGastosEditados={setGastosEditados}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        />)}
        {activeView === "view2" && (
      <Personas
      listaDePersonas={listaDePersonas}
      setListaDePersonas={setListaDePersonas}
      />)}
     <Button onClick={distribuirGastos} disabled={loading} type="primary">
        {loading ? <Spin size="small" /> : "Distribuir Gastos"}
      </Button>

    <div>
      {!nuevaRespuesta && !loading && (
        <Alert
          message="No se pudo comunicar con el servidor"
          type="info"
          showIcon
          className={css.alertCustom} 
        />
      )} 
      </div>
    </>
  );
};

export default NuevaGestionAnalisisClasificacion;
