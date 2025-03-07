import { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button } from "antd";
import css from "../css/InputGanancia.module.css";

const InputGanancia = ({ onAdd, onClose,  valorMonto = "",valorFuente = "",  estatico = false }) => {
  const [valueMonto, setValueMonto] = useState(valorMonto || "");
  const [valueFuente, setValueFuente] = useState(valorFuente || "");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [errorMonto, setErrorMonto] = useState("");
  const [errorFuente, setErrorFuente] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAgregar = () => {
    let aprobado = true;
    if (valueMonto.trim() === ""){
      setErrorMonto(" - Requerido")
      aprobado = false;
    }
    else if (valueMonto <= 0){
      setErrorMonto(" - Debe ser mayor 0")
      setValueMonto("");
      aprobado = false;
    }
    if (valueFuente.trim() === ""){
      setErrorFuente(" - Requerido")
      aprobado = false;
    }

    if (valueMonto.trim() !== "" && valueFuente.trim() !== "" && aprobado) {
      onAdd(parseFloat(valueMonto), valueFuente);
      setValueMonto("");
      setValueFuente("");
      setErrorMonto("");
      setErrorFuente("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAgregar();
    }
  };
   const handleClickOutside = useCallback(
      (e) => {
        if (!estatico && containerRef.current && !containerRef.current.contains(e.target)) {
          onClose();
        }
      },
      [onClose, estatico]
    );

    useEffect(() => {
      if (!estatico) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside, estatico]);


  return (
    <div ref={containerRef} className={css.inputContainer} onClick={(e) => e.stopPropagation()}>
    
      <Input
      ref={inputRef}
        value={valueFuente}
        onChange={(e) => setValueFuente(e.target.value)}
        placeholder={`Fuente ${errorFuente}`}
        className={errorFuente ? css.inputError : css.input}
        onKeyDown={handleKeyDown}
      />
        <Input
        
        value={valueMonto}
        onChange={(e) => setValueMonto(e.target.value)}
        placeholder={`Monto ${errorMonto}`}
        type="number"
        className={errorMonto ? css.inputError : css.input}
        onKeyDown={handleKeyDown}
        min="1" 
      />
      <Button onClick={handleAgregar} type="primary">
        {valorMonto ? "Modificar" : "Agregar"}
      </Button>
    </div>
  );
};

export default InputGanancia;
