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

  const [errores, setErrores] = useState({});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      if (!datosBase) return null;

      const nuevosErrores = {};

      // Validación de "Préstamo de" (obligatorio)
      if (!datosPrestamo.prestamoDe.trim()) nuevosErrores.prestamoDe = true;

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return null;
      }

      setErrores({});

      return {
        ...datosBase,
        cuotaActual: datosPrestamo.cuotaActual || 1,
        totalDeCuotas: datosPrestamo.totalDeCuotas || 1,
        prestamoDe: datosPrestamo.prestamoDe,
        tipo: "prestamo",
      };
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
      <div className={css.formContainer}>
      <GastoBase ref={gastoBaseRef} tipo="prestamo" gasto={gasto} />
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
          placeholder={errores.prestamoDe ? "CAMPO REQUERIDO" : "Préstamo de"}
          value={datosPrestamo.prestamoDe}
          onChange={(e) => handleChange("prestamoDe", e.target.value)}
          className={errores.prestamoDe ? css.inputError : ""}
        />
      </div>
    </div>
  );
});

GastoPrestamo.displayName = "GastoPrestamo";

export default GastoPrestamo;
