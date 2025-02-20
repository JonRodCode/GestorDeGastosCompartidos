import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import GastoBase from "./GastoBase";
import { Input, Select } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const { Option } = Select;

const GastoDebito = forwardRef(({ gasto, tipo = "debito" }, ref) => {
  const gastoBaseRef = useRef();
  const [datosTarjeta, setDatosTarjeta] = useState({
    mesDelResumen: "",
    tarjeta: "Visa",
    tipoTarjeta: "Titular",
    aNombreDe: "",
    banco: "",
    numFinalTarjeta: ""
  });

  const [errores, setErrores] = useState({});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      if (!datosBase) return null;

      const nuevosErrores = {};

      if (!datosTarjeta.banco) nuevosErrores.banco = true;
      
      // Validar "A Nombre De" solo si el campo está habilitado
      if (datosTarjeta.tipoTarjeta === "Extensión" && !datosTarjeta.aNombreDe) {
        nuevosErrores.aNombreDe = true;
      }

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return null;
      }

      setErrores({});
      return { ...datosBase, ...datosTarjeta };
    },
  }));

  const handleChange = (campo, valor) => {
    setDatosTarjeta((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: false })); // Quita el error al escribir
  };

  useEffect(() => {
    if (gasto) {
      setDatosTarjeta({
        mesDelResumen: gasto.mesDelResumen || "",
        tarjeta: gasto.tarjeta || "Visa",
        tipoTarjeta: gasto.tipoTarjeta || "Titular",
        aNombreDe: gasto.aNombreDe || "",
        banco: gasto.banco || "",
        numFinalTarjeta: gasto.numFinalTarjeta || ""
      });
      gastoBaseRef.current?.obtenerDatos();
    }
  }, [gasto]);

  return (
    <div>
      <div className={css.formContainer}>
        <GastoBase ref={gastoBaseRef} tipo={tipo} gasto={gasto} />

        <Input
          placeholder={errores.mesDelResumen ? "CAMPO REQUERIDO" : "Mes del Resumen"}
          value={datosTarjeta.mesDelResumen}
          onChange={(e) => handleChange("mesDelResumen", e.target.value)}
          className={errores.mesDelResumen ? css.inputError : ""}
        />

        <Select
          value={datosTarjeta.tarjeta}
          onChange={(value) => handleChange("tarjeta", value)}
        >
          <Option value="Visa">Visa</Option>
          <Option value="MasterCard">MasterCard</Option>
          <Option value="American Express">American Express</Option>
          <Option value="Otra">Otra</Option>
        </Select>

        <Select
          value={datosTarjeta.tipoTarjeta}
          onChange={(value) => handleChange("tipoTarjeta", value)}
        >
          <Option value="Titular">Titular</Option>
          <Option value="Extensión">Extensión</Option>
        </Select>

        <Input
          placeholder={errores.aNombreDe ? "CAMPO REQUERIDO" : "A Nombre De"}
          value={datosTarjeta.aNombreDe}
          onChange={(e) => handleChange("aNombreDe", e.target.value)}
          disabled={datosTarjeta.tipoTarjeta !== "Extensión"}
          className={errores.aNombreDe ? css.inputError : ""}
        />

        <Input
          placeholder={errores.banco ? "CAMPO REQUERIDO" : "Banco"}
          value={datosTarjeta.banco}
          onChange={(e) => handleChange("banco", e.target.value)}
          className={errores.banco ? css.inputError : ""}
        />

        <Input
          placeholder="Últimos dígitos de la Tarjeta"
          type="number"
          value={datosTarjeta.numFinalTarjeta}
          onChange={(e) => handleChange("numFinalTarjeta", e.target.value)}
        />
        
      </div>
    </div>
  );
});

GastoDebito.displayName = "GastoDebito";

export default GastoDebito;
