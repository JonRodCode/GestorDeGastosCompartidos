import { Dropdown,  Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import css from "../css/ButtonDesplegable.module.css";

const ButtonDesplegable = ({
    modo,
    setModo,
    modoActivado,
    setModoActivado,
    accionesAdicionalesParaCancelar,
    elementoEnSingular,
    cuandoMostrarBotonCancelar = []
  }) => {
    const manejarClickBoton = (modoSeleccionado) => {
      setModo(modoSeleccionado);
      setModoActivado(true);
    };
  
    const menuItems = [
      modo !== "modificar" && {
        key: "modificar",
        label: "Modificar",
        onClick: () => manejarClickBoton("modificar"),
      },
      modo !== "eliminar" && {
        key: "eliminar",
        label: "Eliminar",
        onClick: () => manejarClickBoton("eliminar"),
      },
      modo !== "agregar" && {
        key: "agregar",
        label: "Agregar",
        onClick: () => manejarClickBoton("agregar"),
      },
    ].filter(Boolean);

    const cancelarAccion = () => {
        accionesAdicionalesParaCancelar?.();
        setModoActivado(false);
      };
  
    return (
      <div className={css.buttonsContainer}>
        {modoActivado && 
        (cuandoMostrarBotonCancelar.includes(modo)) && (
          <>
            <Button className={css.addButton} onClick={cancelarAccion} danger>
              Cancelar
            </Button>
          </>
        ) }
        {!(modoActivado && cuandoMostrarBotonCancelar.includes(modo)) && (
          <Dropdown.Button
            className={css.addButton}
            menu={{ items: menuItems }}
            onClick={() => manejarClickBoton(modo)}
            icon={<DownOutlined />}
            disabled={modoActivado}
          >
            {modo.charAt(0).toUpperCase() + modo.slice(1)} {elementoEnSingular}
          </Dropdown.Button>
        )}
      </div>
    );
  };
  
  export default ButtonDesplegable;

