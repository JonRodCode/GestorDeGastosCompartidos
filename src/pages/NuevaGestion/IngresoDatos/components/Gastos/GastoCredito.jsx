import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import GastoDebito from "./GastoDebito";
import { Input, message } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoCredito = forwardRef(({ gasto, excepcion = false, usoDirecto = true }, ref) => {
  const gastoDebitoRef = useRef();
  const [datosTarjeta, setDatosTarjeta] = useState({
    cuotaActual: "",
    totalDeCuotas: "",
    nombreConsumo: "",
  });

  const [errores, setErrores] = useState({});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoDebitoRef.current?.obtenerDatos();
      if (!datosBase) return null;

      const nuevosErrores = {};

    
      if (excepcion) {
        const tieneDatos =
          datosTarjeta.nombreConsumo
  
        if (!tieneDatos) {
          nuevosErrores.generico = "Debe completar al menos un campo correspondiente al tipo de gasto";
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

  useEffect(() => {
    if (gasto) {
      setDatosTarjeta({
        cuotaActual: Math.max(1, gasto.cuotaActual || ""),
        totalDeCuotas: Math.max(1, gasto.totalDeCuotas || ""),
        nombreConsumo: gasto.nombreConsumo || "",
      });
    }
  }, [gasto]);

  return (
    <div>
      <GastoDebito ref={gastoDebitoRef} gasto={gasto} tipo="credito" excepcion={excepcion}
       usoDirecto={usoDirecto}/>
      <div className={css.gastoCreditoContainer}>
        <Input
          placeholder={
            errores.nombreConsumo ? "Nombre de Consumo - REQUERIDO" : "Nombre de Consumo"
          }
          value={datosTarjeta.nombreConsumo}
          onChange={(e) => handleChange("nombreConsumo", e.target.value)}
          className={errores.nombreConsumo ? css.inputError : ""}
        />
         {!excepcion &&
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
}
      </div>
    </div>
  );
});

GastoCredito.displayName = "GastoCredito";

export default GastoCredito;
