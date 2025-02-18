import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import GastoBase from "./GastoBase";
import { Input } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoPrestamo = forwardRef(({ gasto }, ref) => {
  const gastoBaseRef = useRef();
  const [datosPrestamo, setDatosPrestamo] = useState({
    cuotaActual: "",
    totalDeCuotas: "",
    prestamoDe: "",
  });

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      if (!datosBase) return null;
      const { cuotaActual, totalDeCuotas, prestamoDe } = datosPrestamo;
      if (!cuotaActual || !totalDeCuotas || !prestamoDe) {
        alert("Todos los campos de préstamo son obligatorios");
        return null;
      }
      return { ...datosBase, cuotaActual, totalDeCuotas, prestamoDe };
    },
  }));

  const handleChange = (campo, valor) => {
    setDatosPrestamo((prev) => ({ ...prev, [campo]: valor }));
  };

  // Pre-cargar los datos cuando 'gasto' cambia
  useEffect(() => {
    if (gasto) {
      setDatosPrestamo({
        cuotaActual: gasto.cuotaActual || "",
        totalDeCuotas: gasto.totalDeCuotas || "",
        prestamoDe: gasto.prestamoDe || "",
      });
      // Precargamos los datos en GastoBase también
      gastoBaseRef.current?.obtenerDatos();
    }
  }, [gasto]);

  return (
    <div>
      <GastoBase ref={gastoBaseRef} tipo="prestamo" gasto={gasto} />
      <div className={css.container}>
        <Input
          placeholder="Cuota Actual"
          type="number"
          value={datosPrestamo.cuotaActual}
          onChange={(e) => handleChange("cuotaActual", e.target.value)}
        />
        <Input
          placeholder="Total de Cuotas"
          type="number"
          value={datosPrestamo.totalDeCuotas}
          onChange={(e) => handleChange("totalDeCuotas", e.target.value)}
        />
        <Input
          placeholder="Préstamo de"
          value={datosPrestamo.prestamoDe}
          onChange={(e) => handleChange("prestamoDe", e.target.value)}
        />
      </div>
    </div>
  );
});

GastoPrestamo.displayName = "GastoPrestamo";

export default GastoPrestamo;
