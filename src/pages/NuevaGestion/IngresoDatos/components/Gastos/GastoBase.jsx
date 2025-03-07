import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Input, Select, DatePicker, Checkbox, Tooltip, message } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const TITULOS_GASTO = {
  basico: "Gasto Básico",
  prestamo: "Préstamo",
  debito: "Débito",
  credito: "Crédito",
};

const GastoBase = forwardRef(
  ({ tipo, gasto, excepcion = false, usoDirecto = true }, ref) => {
    const [datos, setDatos] = useState({
      detalle: "",
      fuenteDelGasto: "",
      monto: "",
      tipoImporte: "Gasto",
      fecha: null,
      marcado: false,
    });

    const [errores, setErrores] = useState({});

    const handleChange = (campo, valor) => {
      if (campo === "monto") {
        const montoNumerico = parseFloat(valor);
        if (!excepcion && (isNaN(montoNumerico) || montoNumerico <= 0)) {
          setErrores((prev) => ({ ...prev, monto: "Debe ser mayor a 0" }));
          return;
        }
        setErrores((prev) => ({ ...prev, monto: undefined })); // Limpia el error si es válido
      }

      setDatos((prev) => ({ ...prev, [campo]: valor }));
    };

    // Pre-cargar los datos cuando 'gasto' cambia
    useEffect(() => {
      if (gasto) {
        setDatos({
          detalle: gasto.detalle || "",
          fuenteDelGasto: gasto.fuenteDelGasto || "",
          monto: gasto.monto || "",
          tipoImporte: gasto.tipoImporte || "Gasto",
          fecha: gasto.fecha || null,
          marcado: gasto.marcado || false,
        });
      }
    }, [gasto]);

    useImperativeHandle(ref, () => ({
      obtenerDatos() {
        const nuevosErrores = {};

        if (usoDirecto) {
          if (excepcion) {
            const tieneDatos =
              datos.detalle.trim() ||
              datos.fuenteDelGasto.trim() ||
              (datos.monto && parseFloat(datos.monto) > 0);

            if (!tieneDatos) {
              nuevosErrores.generico = "Debe completar al menos un campo";
              message.error(nuevosErrores.generico);
            }
          } else {
            // Validación normal cuando excepcion es false
            if (!datos.fuenteDelGasto)
              nuevosErrores.fuenteDelGasto = "Requerido";
            if (!excepcion && (!datos.monto || parseFloat(datos.monto) === 0)) {
              nuevosErrores.monto = "Debe ser mayor a 0";
            }
          }
        }

        if (Object.keys(nuevosErrores).length > 0) {
          setErrores(nuevosErrores);
          return null;
        }

        setErrores({});
        return { tipo, ...datos };
      },
    }));
    return (
      <div className={css.gastoBaseContainer}>
        <div className={css.header}>
          <h3>{TITULOS_GASTO[tipo] || "Gasto"}</h3>
          {!excepcion && (
            <Tooltip title="Marque este gasto para verlo dentro de los primeros luego de la clasificación.">
              <Checkbox
                checked={datos.marcado}
                onChange={(e) => handleChange("marcado", e.target.checked)}
              />
            </Tooltip>
          )}
        </div>
        <Input
          placeholder="Detalle de Consumo"
          value={datos.detalle}
          onChange={(e) => handleChange("detalle", e.target.value)}
        />

        <Input
          placeholder={
            errores.fuenteDelGasto
              ? "Fuente del Gasto - REQUERIDO"
              : "Fuente del Gasto"
          }
          value={datos.fuenteDelGasto}
          onChange={(e) => handleChange("fuenteDelGasto", e.target.value)}
          className={errores.fuenteDelGasto ? css.inputError : ""}
        />
        {!excepcion && (
          <Input
            placeholder={
              errores.monto
                ? "El monto debe ser mayor a 0 - REQUERIDO"
                : "Monto"
            }
            type="number"
            value={datos.monto}
            onChange={(e) => handleChange("monto", e.target.value)}
            className={errores.monto ? css.inputError : ""}
            min={1} // Esto evita que el usuario seleccione valores negativos con las flechas
          />
        )}
        <Select
          value={datos.tipoImporte}
          onChange={(value) => handleChange("tipoImporte", value)}
          options={[
            { value: "Gasto", label: "Gasto" },
            { value: "Reintegro", label: "Reintegro" },
          ]}
        />
        <DatePicker
          value={datos.fecha}
          onChange={(date) => handleChange("fecha", date)}
        />
      </div>
    );
  }
);

GastoBase.displayName = "GastoBase";
export default GastoBase;
