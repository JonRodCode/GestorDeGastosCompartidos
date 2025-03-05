import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import GastoBase from "./GastoBase";
import { Select } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const GastoBasico = forwardRef(({ gasto }, ref) => {
  const gastoBaseRef = useRef();
  const [datosBasico, setDatosBasico] = useState({
    formaDePago: "Efectivo"});

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      const { formaDePago } = datosBasico;
      if (!datosBase) return null;
      return { ...datosBase, formaDePago };
    },
  }));

  useEffect(() => {
    if (gasto) {
      setDatosBasico({
        formaDePago: gasto.formaDePago || ""});
        gastoBaseRef.current?.obtenerDatos();
    }
  }, [gasto]);

  const handleChange = (campo, valor) => {
    setDatosBasico((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <div>
      <div className={css.formContainer}>
      <GastoBase ref={gastoBaseRef} tipo="basico" gasto={gasto} />
      <Select
        value={datosBasico.formaDePago}
        onChange={(value) => handleChange("formaDePago", value)}
        options={[
          { value: "Efectivo", label: "Efectivo" },
          { value: "Billetera Virtual", label: "Billetera Virtual" }
        ]}
      />
    </div>
    </div>
  );
});

GastoBasico.displayName = "GastoBasico";

export default GastoBasico;