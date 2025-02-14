import { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button } from "antd";
import css from "../css/NumeroInput.module.css";

const NumeroInput = ({ onAdd, placeholder, onClose }) => {
  const [numero, setNumero] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAgregar = () => {
    if (numero.trim() !== "" && !isNaN(numero)) {
      onAdd(Number(numero));
      setNumero("");
    }
  };
  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      onClose(); 
    }
  }, [onClose]); 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup al desmontar
  }, [handleClickOutside]);

  return (
    <div ref={containerRef} className={css.inputContainer} onClick={(e) => e.stopPropagation()}>
      <Input
        ref={inputRef}
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder={placeholder}
        type="number"
        className={css.input}
        onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
      />
      <Button onClick={handleAgregar} type="primary">
        Agregar
      </Button>
    </div>
  );
};

export default NumeroInput;