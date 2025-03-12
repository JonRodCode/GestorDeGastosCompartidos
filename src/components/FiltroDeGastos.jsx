import { Input, Button } from "antd";
import css from "../css/FiltroDeGastos.module.css";

const FiltroDeGastos = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
  elemento
}) => {

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedKeys(value ? [value] : []); // Si está vacío, limpia el filtro
        if (!value && clearFilters) clearFilters(); // Si está vacío, elimina el filtro inmediatamente
      };

  return (
    <>
      <div className={css.filtroContainer}>
      <Input
        className={css.filtroInput}
        placeholder={`Buscar ${elemento}`}
        value={selectedKeys[0] || ""}
        onChange={handleChange}
        onPressEnter={() => confirm()}
      />

      <div className={css.filtroButtons}>
        <Button type="link" onClick={() => confirm()}>
          Filtrar
        </Button>
        <Button type="link" onClick={() => clearFilters && clearFilters()}>
          Limpiar
        </Button>
      </div>
    </div>
    </>
  );
};

export default FiltroDeGastos;
