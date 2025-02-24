import { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button } from "antd";
import css from "../css/InputDesplegable.module.css";

const InputDesplegable = ({ onAdd, placeholder, onClose, type = "number", valor="",  estatico = false }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAgregar = () => {
    if (value.trim() !== "") {
      if (type === "number" && !isNaN(value)) {
        onAdd(Number(value));
      } else if (type === "text") {
        onAdd(value);
      }
      setValue("");
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
    setValue(valor);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside, estatico]);


  return (
    <div
      ref={containerRef}
      className={css.inputContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type={type === "number" ? "number" : "text"}
        className={css.input}
        onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
      />
      <Button onClick={handleAgregar} type="primary">
        {valor ? "Modificar" : "Agregar"}
      </Button>
    </div>
  );
};

export default InputDesplegable;
