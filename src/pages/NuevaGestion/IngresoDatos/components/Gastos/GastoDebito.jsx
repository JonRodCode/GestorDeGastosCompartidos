import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import GastoBase from "./GastoBase";
import { Input, Select, message } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const { Option } = Select;

const GastoDebito = forwardRef(({ gasto, tipo = "debito", excepcion = false, usoDirecto = true }, ref) => {
  const gastoBaseRef = useRef();
  const [datosTarjeta, setDatosTarjeta] = useState({
    tarjeta: "",
    tipoTarjeta: "",
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

      if (excepcion) {
        const tieneDatos = 
        datosTarjeta.banco || 
        datosTarjeta.tarjeta || 
        datosTarjeta.numFinalTarjeta || 
        (datosTarjeta.aNombreDe && datosTarjeta.tipoTarjeta === "Extensión");
        if (!tieneDatos) {
          nuevosErrores.generico = "Debe completar al menos un campo correspondiente al tipo de gasto";
          message.error(nuevosErrores.generico);
        }
      } else {
        if (!datosTarjeta.banco) nuevosErrores.banco = true;
  
        if (datosTarjeta.tipoTarjeta === "Extensión" && !datosTarjeta.aNombreDe) {
          nuevosErrores.aNombreDe = true;
        }
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
    if (campo === "numFinalTarjeta") {
      const soloNumeros = valor.replace(/\D/g, ""); // Elimina caracteres no numéricos
      if (soloNumeros.length > 4) return; // Impide más de 4 caracteres
      setDatosTarjeta((prev) => ({ ...prev, [campo]: soloNumeros }));
      return;
    }
  
    setDatosTarjeta((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: false })); // Quita el error al escribir
  };
  

  useEffect(() => {
    if (gasto) {
      setDatosTarjeta({
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
        <GastoBase ref={gastoBaseRef} tipo={tipo} gasto={gasto}  excepcion={ excepcion }
         usoDirecto={usoDirecto}/>

        <Select
          value={datosTarjeta.tarjeta || undefined}
          onChange={(value) => handleChange("tarjeta", value)}
          placeholder="Tarjeta"
          allowClear 
        >
          <Option value="" disabled>Tarjeta</Option>
          <Option value="Visa">Visa</Option>
          <Option value="MasterCard">MasterCard</Option>
          <Option value="American Express">American Express</Option>
          <Option value="Otra">Otra</Option>
        </Select>

        <Select
          value={datosTarjeta.tipoTarjeta || undefined}
          onChange={(value) => handleChange("tipoTarjeta", value)}
          placeholder="Tipo de tarjeta"
          allowClear 
        >
          <Option value="" disabled>Tipo de tarjeta </Option>
          <Option value="Titular">Titular</Option>
          <Option value="Extensión">Extensión</Option>
        </Select>

        <Input
          placeholder={errores.aNombreDe ? "A Nombre De - REQUERIDO" : "A Nombre De"}
          value={datosTarjeta.aNombreDe}
          onChange={(e) => handleChange("aNombreDe", e.target.value)}
          disabled={datosTarjeta.tipoTarjeta !== "Extensión"}
          className={errores.aNombreDe ? css.inputError : ""}
        />

        <Input
          placeholder={errores.banco ? "Banco - REQUERIDO" : "Banco"}
          value={datosTarjeta.banco}
          onChange={(e) => handleChange("banco", e.target.value)}
          className={errores.banco ? css.inputError : ""}
        />

<Input
  placeholder="Últimos 4 dígitos de la Tarjeta"
  type="text"
  value={datosTarjeta.numFinalTarjeta}
  onChange={(e) => handleChange("numFinalTarjeta", e.target.value)}
  maxLength={4} // Limita la cantidad de caracteres
  pattern="\d{4}" // Asegura que solo se acepten 4 dígitos
  inputMode="numeric" // En móviles, muestra teclado numérico
/>

        
      </div>
    </div>
  );
});

GastoDebito.displayName = "GastoDebito";

export default GastoDebito;
