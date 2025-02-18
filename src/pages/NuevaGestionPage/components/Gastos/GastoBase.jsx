import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Input, Select, DatePicker, Checkbox, Tooltip } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const TITULOS_GASTO = {
  basico: "Gasto Básico",
  prestamo: "Préstamo",
  debito: "Débito",
  credito: "Crédito",
};

const GastoBase = forwardRef(({ tipo, gasto }, ref) => {
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
      if (!datos.fuenteDelGasto) nuevosErrores.fuenteDelGasto = "Requerido";
      if (!datos.monto || parseFloat(datos.monto) === 0) nuevosErrores.monto = "Debe ser mayor a 0";
      
      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return null;
      }
      
      setErrores({});
      return { tipo, ...datos };
    }
  }));

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h3>{TITULOS_GASTO[tipo] || "Gasto"}</h3>
        <Tooltip title="Marque este gasto para verlo dentro de los primeros luego de la clasificación.">
          <Checkbox checked={datos.marcado} onChange={(e) => handleChange("marcado", e.target.checked)} />
        </Tooltip>
      </div>
      <Input placeholder="Detalle de Consumo" value={datos.detalle} onChange={(e) => handleChange("detalle", e.target.value)} />
      <Input
        placeholder="Fuente del Gasto"
        value={datos.fuenteDelGasto}
        onChange={(e) => handleChange("fuenteDelGasto", e.target.value)}
        status={errores.fuenteDelGasto ? "error" : ""}
      />
      <Input
        placeholder="Monto"
        type="number"
        value={datos.monto}
        onChange={(e) => handleChange("monto", e.target.value)}
        status={errores.monto ? "error" : ""}
      />
      <Select
        value={datos.tipoImporte}
        onChange={(value) => handleChange("tipoImporte", value)}
        options={[
          { value: "Gasto", label: "Gasto" },
          { value: "Reintegro", label: "Reintegro" },
        ]}
      />
      <DatePicker value={datos.fecha} onChange={(date) => handleChange("fecha", date)} />
    </div>
  );
});

GastoBase.displayName = "GastoBase";
export default GastoBase;
