import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import GastoDebito from "./GastoDebito";
import { Input } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoCredito = forwardRef(({ gasto }, ref) => {
  const gastoDebitoRef = useRef();
  const [datosCuotas, setDatosCuotas] = useState({
    cuotaActual: "",
    totalDeCuotas: "",
  });

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoDebitoRef.current?.obtenerDatos();
      if (!datosBase) return null;
      const { cuotaActual, totalDeCuotas } = datosCuotas;
      if (!cuotaActual || !totalDeCuotas) {
        alert("Todos los campos de cuotas son obligatorios");
        return null;
      }
      return { ...datosBase, cuotaActual, totalDeCuotas, tipo: "credito" };
    },
  }));

  const handleChange = (campo, valor) => {
    setDatosCuotas((prev) => ({ ...prev, [campo]: valor }));
  };

  useEffect(() => {
    if (gasto) {
      setDatosCuotas({
        cuotaActual: gasto.cuotaActual || "",
        totalDeCuotas: gasto.totalDeCuotas || "",
      });
    }
  }, [gasto]);

  return (
    <div>
      <GastoDebito ref={gastoDebitoRef} gasto={gasto} tipo="credito" />
      <div className={css.gastoCreditoContainer}>
        <Input
          placeholder="Cuota Actual"
          type="number"
          value={datosCuotas.cuotaActual}
          onChange={(e) => handleChange("cuotaActual", e.target.value)}
        />
        <Input
          placeholder="Total de Cuotas"
          type="number"
          value={datosCuotas.totalDeCuotas}
          onChange={(e) => handleChange("totalDeCuotas", e.target.value)}
        />
      </div>
    </div>
  );
});

GastoCredito.displayName = "GastoCredito";

export default GastoCredito;
