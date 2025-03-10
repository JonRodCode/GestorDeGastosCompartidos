import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import GastoDebito from "./GastoDebito";
import { Input, message } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoCredito = forwardRef(
  ({ gasto, excepcion = false }, ref) => {
    const gastoDebitoRef = useRef();
    const [datosTarjeta, setDatosTarjeta] = useState({
      cuotaActual: Math.max(1, gasto?.cuotaActual || ""),
    totalDeCuotas: Math.max(1, gasto?.totalDeCuotas || ""),
    nombreConsumo: gasto?.nombreConsumo || "",
    });
    

    const [errores, setErrores] = useState({});

    useImperativeHandle(ref, () => ({
      obtenerDatos: () => {
        const datosBase = gastoDebitoRef.current?.obtenerDatos();
        if (!datosBase) return null;

        const nuevosErrores = {};

        if (excepcion) {
          const tieneDatosExtras = datosTarjeta.nombreConsumo;

          const tieneDatosBase =
          datosBase.persona.trim() || datosBase.detalle.trim() || datosBase.fuenteDelGasto.trim() ||
            datosBase.banco.trim() || 
            datosBase.tarjeta.trim() || 
            datosBase.numFinalTarjeta.trim() || 
            (datosBase.aNombreDe.trim() && datosBase.tipoTarjeta === "Extensión");
          if (!tieneDatosBase && !tieneDatosExtras) {
            nuevosErrores.generico = "Debe completar al menos 1 campo";
            message.error(nuevosErrores.generico);
          }
        } else {
          if (!datosTarjeta.nombreConsumo) nuevosErrores.nombreConsumo = true;
        }

        if (Object.keys(nuevosErrores).length > 0) {
          setErrores(nuevosErrores);
          return null;
        }

        setErrores({});
        return {
          ...datosBase,
          nombreConsumo: datosTarjeta.nombreConsumo,
          cuotaActual: datosTarjeta.cuotaActual || 1,
          totalDeCuotas: datosTarjeta.totalDeCuotas || 1,
          tipo: "credito",
        };
      },
    }));

    const handleChange = (campo, valor) => {
      setDatosTarjeta((prev) => ({ ...prev, [campo]: valor }));
    };

    return (
      <div>
        <GastoDebito
          ref={gastoDebitoRef}
          gasto={gasto}
          tipo="credito"
          excepcion={excepcion}
          usoDirecto={false}
        />
        <div className={css.gastoCreditoContainer}>
          <Input
            placeholder={
              errores.nombreConsumo
                ? "Nombre de Consumo - REQUERIDO"
                : "Nombre de Consumo"
            }
            value={datosTarjeta.nombreConsumo}
            onChange={(e) => handleChange("nombreConsumo", e.target.value)}
            className={errores.nombreConsumo ? css.inputError : ""}
          />
          {!excepcion && (
            <div className={css.formContainerInterno}>
              <Input
                placeholder="Cuota Actual"
                type="number"
                value={datosTarjeta.cuotaActual}
                onChange={(e) => handleChange("cuotaActual", e.target.value)}
              />
              <Input
                placeholder="Total de Cuotas"
                type="number"
                value={datosTarjeta.totalDeCuotas}
                onChange={(e) => handleChange("totalDeCuotas", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

GastoCredito.displayName = "GastoCredito";

export default GastoCredito;
