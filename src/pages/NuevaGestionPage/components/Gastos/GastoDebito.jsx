import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import GastoBase from "./GastoBase";
import { Input, Select } from "antd";
import css from "../../css/Gastos/GastoBase.module.css";

const { Option } = Select;

const GastoDebito = forwardRef(({ gasto }, ref) => {
  const gastoBaseRef = useRef();
  const [datosTarjeta, setDatosTarjeta] = useState({
    mesDelResumen: "",
    tarjeta: "",
    tipoTarjeta: "",
    aNombreDe: "",
    banco: "",
    numFinalTarjeta: "",
    nombreConsumo: "",
  });

  useImperativeHandle(ref, () => ({
    obtenerDatos: () => {
      const datosBase = gastoBaseRef.current?.obtenerDatos();
      if (!datosBase) return null;
      const { tarjeta, tipoTarjeta, banco } = datosTarjeta;
      if (!tarjeta || !tipoTarjeta || !banco) {
        alert("Los campos Tarjeta, Tipo de Tarjeta y Banco son obligatorios");
        return null;
      }
      return { ...datosBase, ...datosTarjeta };
    },
  }));

  const handleChange = (campo, valor) => {
    setDatosTarjeta((prev) => ({ ...prev, [campo]: valor }));
  };

  useEffect(() => {
    if (gasto) {
      setDatosTarjeta({
        mesDelResumen: gasto.mesDelResumen || "",
        tarjeta: gasto.tarjeta || "",
        tipoTarjeta: gasto.tipoTarjeta || "",
        aNombreDe: gasto.aNombreDe || "",
        banco: gasto.banco || "",
        numFinalTarjeta: gasto.numFinalTarjeta || "",
        nombreConsumo: gasto.nombreConsumo || "",
      });
      gastoBaseRef.current?.obtenerDatos();
    }
  }, [gasto]);

  return (
    <div>
      <GastoBase ref={gastoBaseRef} tipo="debito" gasto={gasto} />
      <div className={css.container}>
        <Input
          placeholder="Mes del Resumen"
          value={datosTarjeta.mesDelResumen}
          onChange={(e) => handleChange("mesDelResumen", e.target.value)}
        />
        <Select
          placeholder="Tarjeta"
          value={datosTarjeta.tarjeta}
          onChange={(value) => handleChange("tarjeta", value)}
        >
          <Option value="Visa">Visa</Option>
          <Option value="MasterCard">MasterCard</Option>
          <Option value="American Express">American Express</Option>
          <Option value="Otra">Otra</Option>
        </Select>
        <Select
          placeholder="Tipo de Tarjeta"
          value={datosTarjeta.tipoTarjeta}
          onChange={(value) => handleChange("tipoTarjeta", value)}
        >
          <Option value="Titular">Titular</Option>
          <Option value="Extensión">Extensión</Option>
        </Select>
        <Input
          placeholder="A Nombre De"
          value={datosTarjeta.aNombreDe}
          onChange={(e) => handleChange("aNombreDe", e.target.value)}
          disabled={datosTarjeta.tipoTarjeta !== "Extensión"}
        />
        <Input
          placeholder="Banco"
          value={datosTarjeta.banco}
          onChange={(e) => handleChange("banco", e.target.value)}
        />
        <Input
          placeholder="Últimos dígitos de la Tarjeta"
          type="number"
          value={datosTarjeta.numFinalTarjeta}
          onChange={(e) => handleChange("numFinalTarjeta", e.target.value)}
        />
        <Input
          placeholder="Nombre del Consumo"
          value={datosTarjeta.nombreConsumo}
          onChange={(e) => handleChange("nombreConsumo", e.target.value)}
        />
      </div>
    </div>
  );
});

GastoDebito.displayName = "GastoDebito";

export default GastoDebito;