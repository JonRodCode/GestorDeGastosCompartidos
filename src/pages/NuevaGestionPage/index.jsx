import { useState } from "react";
import { Typography, Button, Spin, Alert } from "antd";
import MiembrosInput from "../../components/MiembrosInput";
import PersonaConGastos from "./components/PersonaConGastos";
import Especificaciones from "./components/Especificaciones";
import css from "./css/NuevaGestionPage.module.css";

const { Title } = Typography;

const NuevaGestionPage = () => {
  const [activeView, setActiveView] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [miembrosDelHogar, setMiembrosDelHogar] = useState([]);

  const [especificaciones, setEspecificaciones] = useState({
    
    fuenteDelGasto: {},
    categorias: {},
    determinaciones: {},
    excepcionesGlobales: {} 
  });

  // Posiblemente cambiemos la forma de mostrar la respuesta
  const [nuevaRespuesta, setNuevaRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const mapearGasto = (personaNombre, gasto) => {
    const gastoBase = {
      tipo: gasto.tipo,
      persona: personaNombre,
      detalleConsumo: gasto.detalleConsumo || "",
      fuenteDelGasto: gasto.fuenteDelGasto || "",
      categoria: gasto.categoria || "",
      determinacion: gasto.determinacion || "",
      monto: gasto.monto || 0,
      tipoDeImporte: gasto.tipoDeImporte || "Gasto",
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
          mesDelResumen: gasto.mesDelResumen || "",
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
          mesDelResumen: gasto.mesDelResumen || "",
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

  const enviarDatos = async () => {
    setLoading(true);
    // Convertir cada gasto en el formato correcto según su tipo
    const gastosTransformados = personas.flatMap((persona) =>
      persona.gastos.map((gasto) => mapearGasto(persona.nombre, gasto))
    );

    const datos = {
      especificaciones: {
        fuenteDelGasto: {
          Carrefour: ["Carref*MP"],
        },
        categorias: {
          Supermercado: ["Carrefour"],
        },
        determinaciones: {
          GastoEquitativo: ["Supermercado"],
        },
        excepcionesGlobales: {
          GastoIgualitario: [
            {
              tipo: "basico",
              persona: "",
              detalleConsumo: "Bebidas",
              fuenteDelGasto: "Carrefour",
              categoria: "",
              determinacion: "",
              monto: 0,
              tipoDeImporte: null,
              excepcion: null,
              fecha: null,
              marcado: null,
            },
          ],
        },
        GastosConCuotasPendientes: [],
      }, // Aquí puedes agregar datos adicionales si es necesario
      gastos: gastosTransformados,
    };

    try {
      const response = await fetch(
        "http://localhost:6060/clasificacionGeneral",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      if (response.ok) {
        const respuesta = await response.json();
        console.log("Respuesta del servidor:", respuesta);
        setNuevaRespuesta(respuesta);
      } else {
        console.error("Error en la petición");
        setNuevaRespuesta(null);
      }
    } catch (error) {
      console.error("Hubo un error:", error);
      setNuevaRespuesta(null);
    } finally {
      setLoading(false);
    }
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
            <Title level={3} className={css.subtitle}>
              Cargar Gastos Por Persona
            </Title>
            <MiembrosInput
              personas={personas}
              setPersonas={setPersonas}
              miembrosDelHogar={miembrosDelHogar}
              setMiembrosDelHogar={setMiembrosDelHogar}
            />
            <div className={css.mainContainer}>
              <div className={css.leftSection}>
                {personas.length !== 0 ? (
                  personas.map((persona, index) => (
                    <PersonaConGastos
                      key={index}
                      nombre={persona.nombre}
                      gastos={persona.gastos || []} // Asegurar que siempre tenga un array
                      setGastos={(nuevosGastos) =>
                        actualizarGastosDePersona(persona.nombre, nuevosGastos)
                      }
                    />
                  ))
                ) : (
                  <p>Agregue una persona</p>
                )}
              </div>
            </div>
          </div>
        )}
        {activeView === "view2" && (
          <div>
            <Title level={3} className={css.subtitle}>
              Especificaciones
            </Title>
            <div className={css.mainContainer}>
              <div className={css.leftSection}>
                <Especificaciones
                  especificaciones={especificaciones}
                  setEspecificaciones={setEspecificaciones}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Button onClick={enviarDatos} disabled={loading} type="primary">
        {loading ? <Spin size="small" /> : "Enviar Datos"}
      </Button>
      {nuevaRespuesta && (
        <pre
          style={{
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          {JSON.stringify(nuevaRespuesta, null, 2)}
        </pre>
      )}

      {!nuevaRespuesta && !loading && (
        <Alert
          message="No hay datos aún"
          type="info"
          showIcon
          style={{ marginTop: "10px" }}
        />
      )}
    </div>
  );
};

export default NuevaGestionPage;
