import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import GastoDebito from "./GastoDebito";
import { Input } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoCredito = forwardRef(({ gasto, excepcion = false }, ref) => {
  const gastoDebitoRef = useRef();
  const [datosTarjeta, setDatosTarjeta] = useState({
    cuotaActual: gasto?.cuotaActual || "",
    totalDeCuotas: gasto?.totalDeCuotas || "",
    nombreConsumo: gasto?.nombreConsumo || "",
  });

  const [errores, setErrores] = useState({});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoDebitoRef.current?.obtenerDatos();
      if (!datosBase) return null;

      const nuevosErrores = {};
      
      if (Number(datosTarjeta.cuotaActual) > Number(datosTarjeta.totalDeCuotas)) {
        nuevosErrores.cuotaActual = "Debe ser menor al total de cuotas";
        setDatosTarjeta((prev) => ({
          ...prev,
          cuotaActual: "",
        }));
      }

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return null;
      }

      setErrores({});
      return {
        ...datosBase,
        nombreConsumo: datosTarjeta.nombreConsumo || "",
        cuotaActual: Math.max(1, datosTarjeta.cuotaActual || 1),
        totalDeCuotas: Math.max(1, datosTarjeta.totalDeCuotas || 1),
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
      />
      <div className={css.gastoCreditoContainer}>
        <Input
          placeholder={"Nombre de Consumo"}
          value={datosTarjeta.nombreConsumo}
          onChange={(e) => handleChange("nombreConsumo", e.target.value)}
        />
        {!excepcion && (
          <div className={css.formContainerInterno}>
            <Input
              placeholder={
                errores.cuotaActual ? "Cuota Actual - Debe ser menor al total de cuotas" : "Cuota Actual" }
              type="number"
              value={datosTarjeta.cuotaActual}
              onChange={(e) => handleChange("cuotaActual", e.target.value)}
              className={errores.cuotaActual ? css.inputError : ""}
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
});

GastoCredito.displayName = "GastoCredito";

export default GastoCredito;
