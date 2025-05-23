import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Spin, Alert, Modal } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import MiembrosInput from "../../../components/MiembrosInput";
import PersonaConGastos from "./components/PersonaConGastos";
import Especificaciones from "./components/Especificaciones";
import css from "./css/NuevaGestionPage.module.css";

const { Title } = Typography;
const servicioLocal = "http://localhost:6060/clasificacionCompleta";
const servicioDeClasificacion = "https://clasificadordegastos-production.up.railway.app/clasificacionCompleta";

const NuevaGestionIngresoDatos = () => {
  const [activeView, setActiveView] = useState("view1");
  const [mostrarInputPersonas, setMostrarInputPersonas] = useState(false);
  const [mostrarInputEspecificaciones, setMostrarInputEspecificaciones] =
    useState(false);
  const [personas, setPersonas] = useState([]);
  const [miembrosDelHogar, setMiembrosDelHogar] = useState([]);
  const [eliminarPersona, setEliminarPersona] = useState(false);
  const [personaAEliminar, setPersonaAEliminar] = useState("");
  const [
    categoriasPendientesParaDeterminar,
    setCategoriasPendientesParaDeterminar,
  ] = useState([]);
  const [
    fuentesDeGastosPendientesParaClasificar,
    setFuentesDeGastosPendientesParaClasificar,
  ] = useState([]);

  const [fuentesDeGastosEnUsoPorPersona, setFuentesDeGastosEnUsoPorPersona] =
    useState({});

  const [
    consumosPendientesParaClasificar,
    setConsumosPendientesParaClasificar,
  ] = useState([]);

  const [consumosEnUsoPorPersona, setConsumosEnUsoPorPersona] = useState({});

  const [elementoAReclasificar, setElementoAReclasificar] = useState([]);
  const [especificaciones, setEspecificaciones] = useState({
    fuenteDelGasto: {},
    categorias: {},
    determinaciones: {
      GastoEquitativo: [],
      GastoIgualitario: [],
      GastoPersonal: [],
      GastoDeOtraPersona: [],
    },
    excepcionesGlobales: {
      GastoEquitativo: [],
      GastoIgualitario: [],
      GastoPersonal: [],
      GastoDeOtraPersona: [],
    },
    GastosConCuotasPendientes: [],
  });
  const [vistaActualEspecificaciones, setVistaActualEspecificaciones] =
    useState("Panel general");
  // Posiblemente cambiemos la forma de mostrar la respuesta
  const [nuevaRespuesta, setNuevaRespuesta] = useState("No se cargo nada");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para actualizar los gastos de una persona específica

  const actualizarGastosDePersona = (nombre, nuevosGastos) => {
    setPersonas((prevPersonas) =>
      prevPersonas.map((persona) =>
        persona.nombre === nombre
          ? { ...persona, gastos: nuevosGastos }
          : persona
      )
    );
  };

  const agregarMuchosGastos = (
    nombre,
    listaDeGastos,
    eliminarValoresAnteriores = false
  ) => {
    setPersonas((prevPersonas) =>
      prevPersonas.map((persona) =>
        persona.nombre === nombre
          ? {
              ...persona,
              gastos: eliminarValoresAnteriores
                ? [...listaDeGastos]
                : [...(persona.gastos || []), ...listaDeGastos],
            }
          : persona
      )
    );
  };

  const mapearGasto = (personaNombre, gasto) => {
    const gastoBase = {
      id:gasto.id,
      tipo: gasto.tipo,
      persona: personaNombre,
      detalle: gasto.detalle || "",
      fuenteDelGasto: gasto.fuenteDelGasto || "",
      categoria: gasto.categoria || "",
      determinacion: gasto.determinacion || "",
      monto: gasto.monto || 0,
      tipoDeImporte: gasto.tipoDeImporte || "Pepito",
      excepcion: gasto.excepcion || "Nula",
      fecha: gasto.fecha || null,
      marcado: gasto.marcado ? "true" : "false",
    };

    // Transformación según el tipo de gasto
    switch (gasto.tipo) {
      case "prestamo":
        return {
          ...gastoBase,
          cuotaActual: gasto.cuotaActual || 0,
          totalDeCuotas: gasto.totalDeCuotas || 0,
          prestamoDe: gasto.prestamoDe || "",
        };
      case "debito":
        return {
          ...gastoBase,
          tarjeta: gasto.tarjeta || "Visa",
          tipoTarjeta: gasto.tipoTarjeta || "Titular",
          aNombreDe: gasto.aNombreDe || "",
          banco: gasto.banco || "",
          numFinalTarjeta: gasto.numFinalTarjeta || "",
          nombreConsumo: gasto.nombreConsumo || "",
        };
      case "credito":
        return {
          ...gastoBase,
          tarjeta: gasto.tarjeta || "Visa",
          tipoTarjeta: gasto.tipoTarjeta || "Titular",
          aNombreDe: gasto.aNombreDe || "",
          banco: gasto.banco || "",
          numFinalTarjeta: gasto.numFinalTarjeta || "",
          nombreConsumo: gasto.nombreConsumo || "",
          cuotaActual: gasto.cuotaActual || 0,
          totalDeCuotas: gasto.totalDeCuotas || 0,
        };
      default: // "basico" u otros tipos de gasto desconocidos
        return gastoBase;
    }
  };

  const validarQueNoHayPendientes = () => {
    if (
      categoriasPendientesParaDeterminar.length > 0 ||
      fuentesDeGastosPendientesParaClasificar.length > 0 ||
      consumosPendientesParaClasificar.length > 0
    ) {
      Modal.warning({
        title: "Clasificación pendiente",
        content:<>
        <p>Faltan elementos por clasificar o determinar.</p>
        <p>Por favor, complete la clasificación en &quot;Especificaciones&quot; para poder continuar.</p>
        </>,
        okText: "Aceptar",
      });
      return false;
    }
    return true;
  };

  const listaPersonasSiTienenGastosONo = () => {
    let listaDePersonasConOSinGastos = [];
    listaDePersonasConOSinGastos = personas.map(persona => ({
        nombre: persona.nombre,
        gastos: persona.gastos.length > 0
    }));

    return listaDePersonasConOSinGastos;
};


  const clasificarDatos = async () => {
    if (!(validarQueNoHayPendientes() && condicionesAprobadasParaClasificacion())) {
      return;}
    setLoading(true);
    const gastosTransformados = personas.flatMap((persona) =>
      persona.gastos.map((gasto) => mapearGasto(persona.nombre, gasto))
    );

    const datos = {
      especificaciones, 
      gastos: gastosTransformados,
    };

    try {
      const response = await fetch(servicioDeClasificacion,
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
        const nombresDePersonas =listaPersonasSiTienenGastosONo();
        sessionStorage.setItem("listaDePersonas", JSON.stringify(nombresDePersonas));
        sessionStorage.setItem("gastosClasificados", JSON.stringify(respuesta));
        navigate("/NuevaGestion/AnalisisClasificacion");
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

  const condicionesAprobadasParaClasificacion = () => {
    if (personas.length < 1){
      Modal.warning({
        title: "Faltan datos",
        content:
          "Como minimo debe agregar 1 persona con sus gastos para la clasificación",
        okText: "Aceptar"        
      });
      return false
    }
    else if ((Object.values(fuentesDeGastosEnUsoPorPersona).flat()) < 1) {
      Modal.warning({
        title: "Faltan datos",
        content:
          "Como minimo debe agregar 1 gasto",
        okText: "Aceptar"
      });
      return false;
    }
    return true;
  };

  return (
    <div className={css.container}>
      <Title level={2} className={css.title}>
        Nueva Gestión de Gastos del Hogar
      </Title>

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
          Especificaciones
        </Button>
      </div>

      <div>
        {activeView === "view1" && (
          <div>
            <div className={css.cargarPersona}>
              <Button
                type="text"
                icon={mostrarInputPersonas ? <UpOutlined /> : <DownOutlined />}
                onClick={() => {
                  setMostrarInputPersonas(!mostrarInputPersonas);
                  setEliminarPersona(false);
                }}
              />
              <Title level={3} className={css.subtitle}>
                Cargar Gastos Por Persona
              </Title>
            </div>

            {mostrarInputPersonas && (
              <MiembrosInput
                personas={personas}
                setPersonas={setPersonas}
                miembrosDelHogar={miembrosDelHogar}
                setMiembrosDelHogar={setMiembrosDelHogar}
                eliminarPersona={eliminarPersona}
                personaAEliminar={personaAEliminar}
                setEliminarPersona={setEliminarPersona}
                setPersonaAEliminar={setPersonaAEliminar}
              />
            )}
            <div className={css.mainContainer}>
              <div className={css.leftSection}>
                {personas.length !== 0
                  ? personas.map((persona, index) => (
                      <PersonaConGastos
                        agregarMuchosGastos={agregarMuchosGastos}
                        key={index}
                        nombre={persona.nombre}
                        eliminarPersona={eliminarPersona}
                        setPersonaAEliminar={setPersonaAEliminar}
                        gastos={persona.gastos || []} // Asegurar que siempre tenga un array
                        setGastos={(nuevosGastos) => {
                          actualizarGastosDePersona(
                            persona.nombre,
                            nuevosGastos
                          );
                        }}
                        listaDeFuentesDeGastosPendientes={
                          fuentesDeGastosPendientesParaClasificar
                        }
                        setListaDeFuentesDeGastosPendientes={
                          setFuentesDeGastosPendientesParaClasificar
                        }
                        especificaciones={especificaciones}
                        setEspecificaciones={setEspecificaciones}
                        setFuentesDeGastosEnUsoPorPersona={
                          setFuentesDeGastosEnUsoPorPersona
                        }
                        listaDeConsumosPendientes={
                          consumosPendientesParaClasificar
                        }
                        setListaDeConsumosPendientes={
                          setConsumosPendientesParaClasificar
                        }
                        setConsumosEnUsoPorPersona={setConsumosEnUsoPorPersona}
                        elementoAReclasificar={elementoAReclasificar}
                        setElementoAReclasificar={setElementoAReclasificar}
                      />
                    ))
                  : !mostrarInputPersonas && <p>Agregue una persona</p>}
              </div>
            </div>
          </div>
        )}
        {activeView === "view2" && (
          <div>
            <div className={css.especificationButton}>
              <Button
                type="text"
                icon={
                  mostrarInputEspecificaciones ? (
                    <UpOutlined />
                  ) : (
                    <DownOutlined />
                  )
                }
                onClick={() =>
                  setMostrarInputEspecificaciones(!mostrarInputEspecificaciones)
                }
              />
              <Title level={3}>Especificaciones</Title>
            </div>
            <div className={css.mainContainer}>
              <div className={css.leftSection}>
                <Especificaciones
                  mostrarInputEspecificaciones={mostrarInputEspecificaciones}
                  especificaciones={especificaciones}
                  setEspecificaciones={setEspecificaciones}
                  vista={vistaActualEspecificaciones}
                  setVista={setVistaActualEspecificaciones}
                  categoriasPendientes={categoriasPendientesParaDeterminar}
                  setCategoriasPendientes={
                    setCategoriasPendientesParaDeterminar
                  }
                  fuentesDeGastosPendientes={
                    fuentesDeGastosPendientesParaClasificar
                  }
                  setFuenteDeGastosPendientes={
                    setFuentesDeGastosPendientesParaClasificar
                  }
                  fuentesDeGastosEnUsoPorPersona={
                    fuentesDeGastosEnUsoPorPersona
                  }
                  consumosPendientesParaClasificar={
                    consumosPendientesParaClasificar
                  }
                  setConsumosPendientesParaClasificar={
                    setConsumosPendientesParaClasificar
                  }
                  consumosEnUsoPorPersona={consumosEnUsoPorPersona}
                  setElementoAReclasificar={setElementoAReclasificar}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Button onClick={clasificarDatos} disabled={loading} type="primary">
        {loading ? <Spin size="small" /> : "Clasificar Gastos"}
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
  );
};

export default NuevaGestionIngresoDatos;
