import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import GastoDebito from "./GastoDebito";
import { Input } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoCredito = forwardRef(({ gasto }, ref) => {
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

      if (!datosTarjeta.nombreConsumo) nuevosErrores.nombreConsumo = true;

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
        cuotaActual: gasto.cuotaActual || "",
        totalDeCuotas: gasto.totalDeCuotas || "",
        nombreConsumo: gasto.nombreConsumo || "",
      });
    }
  }, [gasto]);

  return (
    <div>
      <GastoDebito ref={gastoDebitoRef} gasto={gasto} tipo="credito" />
      <div className={css.gastoCreditoContainer}>
        <Input
          placeholder={
            errores.nombreConsumo ? "CAMPO REQUERIDO" : "Nombre de Consumo"
          }
          value={datosTarjeta.nombreConsumo}
          onChange={(e) => handleChange("nombreConsumo", e.target.value)}
          className={errores.nombreConsumo ? css.inputError : ""}
        />
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
    </div>
  );
});

GastoCredito.displayName = "GastoCredito";

export default GastoCredito;
