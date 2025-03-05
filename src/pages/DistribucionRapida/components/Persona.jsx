import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Card, Input, Row, Col, Tag, Modal } from "antd";
import css from "../css/Persona.module.css";
import InputDesplegable from "../../../components/InputDesplegable";
import GastosDeOtros from "./GastosDeOtros";

const Persona = forwardRef(
  ({ nombre, miembrosHogar, eliminarPersona, setPersonaAEliminar }, ref) => {
    const [ganancias, setGanancias] = useState([]);
    const [gastosEquitativosPagados, setGastosEquitativosPagados] = useState(
      []
    );
    const [gastosIgualitariosPagados, setGastosIgualitariosPagados] = useState(
      []
    );
    const [personasACargo, setPersonasACargo] = useState(0);
    const [gastosPersonalesDeOtros, setGastosPersonalesDeOtros] = useState({});

    const [modoActivo, setModoActivo] = useState(null);

    const [listaSinMiNombre, setListaSinMiNombre] = useState([]);

    const obtenerDatosDeGastosDeOtros = (nuevosDatos) => {
      setGastosPersonalesDeOtros(nuevosDatos);
    };

    useEffect(() => {
      setListaSinMiNombre(miembrosHogar.filter((name) => name !== nombre));
    }, [miembrosHogar, nombre]);

    const eliminarNumero = (tipo, index) => {
      let nuevaListaDeNumeros = [];
      switch (tipo) {
        case "ganancia":
          nuevaListaDeNumeros = [...ganancias];
          nuevaListaDeNumeros.splice(index, 1);
          setGanancias(nuevaListaDeNumeros);
          break;

        case "gastoEquitativo":
          nuevaListaDeNumeros = [...gastosEquitativosPagados];
          nuevaListaDeNumeros.splice(index, 1);
          setGastosEquitativosPagados(nuevaListaDeNumeros);
          break;

        case "gastoIgualitario":
          nuevaListaDeNumeros = [...gastosIgualitariosPagados];
          nuevaListaDeNumeros.splice(index, 1);
          setGastosIgualitariosPagados(nuevaListaDeNumeros);
          break;
      }
    };

    useImperativeHandle(ref, () => ({
      obtenerDatosPropios() {
        return {
          nombre,
          ganancias,
          personasACargo,
          gastosEquitativosPagados,
          gastosIgualitariosPagados,
          gastosPersonalesDeOtros,
        };
      },
    }));

    const eliminarPersonaCompletamente = () => {
      Modal.confirm({
        title: "Confirmar eliminación",
        content: `¿Estás seguro de que quieres eliminar a ${nombre}?`,
        okText: "Eliminar",
        cancelText: "Cancelar",
        okType: "danger",
        onOk: () => {
          setPersonaAEliminar(nombre);
        }      
      });
    };

    return (
      <Card
  className={css.card}
  title={
    <span className={css.cardTitleContainer}>
      <span className={css.cardTitle}>{nombre}</span>
      {eliminarPersona && (
        <span className={css.eliminarPersona} onClick={eliminarPersonaCompletamente}>
          Eliminar
        </span>
      )}
    </span>
  }
  onClick={() => setModoActivo(null)}
>

    
        
        <Row gutter={16}>
          <Col span={24}>
            <div
              className={css.numerosContainer}
              onClick={(e) => {
                e.stopPropagation();
                setModoActivo("ganancia");
              }}
            >
              <div className={css.tituloConTags}>
                <strong>Ganancia:</strong>
                <div className={css.tagsContainer}>
                  {ganancias.map((valor, index) => (
                    <Tag
                      key={index}
                      color="blue"
                      onClick={() => eliminarNumero("ganancia", index)}
                    >
                      {valor}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
            {modoActivo === "ganancia" && (
              <InputDesplegable
                placeholder="Ingrese una ganancia"
                onAdd={(num) => setGanancias([...ganancias, num])}
                onClose={() => setModoActivo(null)}
              />
            )}
          </Col>
          <div>
            <Col span={24}>
              <div
                className={css.numerosContainer}
                onClick={(e) => {
                  e.stopPropagation();
                  setModoActivo("gastoEquitativo");
                }}
              >
                <div className={css.tituloConTags}>
                  <strong>Gastos Equitativos:</strong>
                  <div className={css.tagsContainer}>
                    {gastosEquitativosPagados.map((valor, index) => (
                      <Tag
                        key={index}
                        color="red"
                        onClick={() => eliminarNumero("gastoEquitativo", index)}
                      >
                        {valor}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              {modoActivo === "gastoEquitativo" && (
                <InputDesplegable
                  placeholder="Ingrese un gasto"
                  onAdd={(num) =>
                    setGastosEquitativosPagados([
                      ...gastosEquitativosPagados,
                      num,
                    ])
                  }
                  onClose={() => setModoActivo(null)}
                />
              )}
            </Col>

            <Col span={24}>
              <div
                className={css.numerosContainer}
                onClick={(e) => {
                  e.stopPropagation();
                  setModoActivo("gastoIgualitario");
                }}
              >
                <div className={css.tituloConTags}>
                  <strong>Gastos Igualitarios:</strong>
                  <div className={css.tagsContainer}>
                    {gastosIgualitariosPagados.map((valor, index) => (
                      <Tag
                        key={index}
                        color="red"
                        onClick={() =>
                          eliminarNumero("gastoIgualitario", index)
                        }
                      >
                        {valor}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              {modoActivo === "gastoIgualitario" && (
                <InputDesplegable
                  placeholder="Ingrese un gasto"
                  onAdd={(num) =>
                    setGastosIgualitariosPagados([
                      ...gastosIgualitariosPagados,
                      num,
                    ])
                  }
                  onClose={() => setModoActivo(null)}
                />
              )}
            </Col>
          </div>
          <Col span={24}>
            <div className={css.numerosContainer}>
              <strong>Cantidad de personas a cargo:</strong>
              <div className={css.tagsContainer}>
                <Input
                  value={personasACargo}
                  onChange={(e) => setPersonasACargo(e.target.value)}
                  placeholder="Ingrese un número"
                  type="number"
                />
              </div>
            </div>
          </Col>

          <Col span={24}>
            <strong>Gastos personales de otros miembros:</strong>
            <GastosDeOtros
              items={listaSinMiNombre}
              onChange={obtenerDatosDeGastosDeOtros}
            ></GastosDeOtros>
          </Col>
        </Row>
      </Card>
    );
  }
);

Persona.displayName = "Persona";

export default Persona;
