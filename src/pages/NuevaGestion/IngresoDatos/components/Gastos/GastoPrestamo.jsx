import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import GastoBase from "./GastoBase";
import { Input } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoPrestamo = forwardRef(({ gasto, excepcion = false }, ref) => {
  const gastoBaseRef = useRef();
  const [datosPrestamo, setDatosPrestamo] = useState({
    cuotaActual: gasto?.cuotaActual || "",
    totalDeCuotas: gasto?.totalDeCuotas || "",
    prestamoDe: gasto?.prestamoDe || "",
  });

  const [errores, setErrores] = useState({});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      if (!datosBase) return null;

      const nuevosErrores = {};
      if (!datosPrestamo.prestamoDe.trim())
        nuevosErrores.prestamoDe = "Requerido";
      
      if (
        datosPrestamo.cuotaActual > datosPrestamo.totalDeCuotas
      ) {
        nuevosErrores.cuotaActual = "Debe ser menor al total de cuotas";
        setDatosPrestamo((prev) => ({
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
        cuotaActual: Math.max(1, datosPrestamo.cuotaActual || 1),
        totalDeCuotas: Math.max(1, datosPrestamo.totalDeCuotas || 1),
        prestamoDe: datosPrestamo.prestamoDe,
        tipo: "prestamo",
      };
    },
  }));

  const handleChange = (campo, valor) => {
    setDatosPrestamo((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <div>
      <div className={css.formContainer}>
        <GastoBase
          ref={gastoBaseRef}
          tipo="prestamo"
          gasto={gasto}
          excepcion={excepcion}
        />
        {!excepcion && (
          <div className={css.formContainerInterno}>
            <Input
              placeholder={
                errores.cuotaActual ? "Cuota Actual - Debe ser menor al total de cuotas" : "Cuota Actual" }
              type="number"
              value={datosPrestamo.cuotaActual}
              onChange={(e) => handleChange("cuotaActual", e.target.value)}
              className={errores.cuotaActual ? css.inputError : ""}
            />
            <Input
              placeholder="Total de Cuotas"
              type="number"
              value={datosPrestamo.totalDeCuotas}
              onChange={(e) => handleChange("totalDeCuotas", e.target.value)}
            />
          </div>
        )}
        <Input
          placeholder={
            errores.prestamoDe ? "Préstamo de - REQUERIDO" : "Préstamo de"
          }
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
