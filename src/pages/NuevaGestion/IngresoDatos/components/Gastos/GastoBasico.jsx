import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import GastoBase from "./GastoBase";
import { Select } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoBasico = forwardRef(({ gasto ,  excepcion = false}, ref) => {
  const gastoBaseRef = useRef();
  const [datosBasico, setDatosBasico] = useState({
    formaDePago: gasto?.formaDePago || "Efectivo",});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      const { formaDePago } = datosBasico;
      if (!datosBase) return null;

      return { ...datosBase, formaDePago };
    },
  }));

 

  const handleChange = (campo, valor) => {
    setDatosBasico((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <div>
      <div className={css.formContainer}>
      <GastoBase ref={gastoBaseRef} tipo="basico" gasto={gasto}  excepcion = { excepcion}/>
      {!excepcion &&
      <Select
        value={datosBasico.formaDePago}
        onChange={(value) => handleChange("formaDePago", value)}
        options={[
          { value: "Efectivo", label: "Efectivo" },
          { value: "Billetera Virtual", label: "Billetera Virtual" }
        ]}
      />}
    </div>
    </div>
  );
});

GastoBasico.displayName = "GastoBasico";

export default GastoBasico;