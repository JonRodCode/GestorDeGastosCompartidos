import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Card, Input, Button, Row, Col, Typography, Space, Tag } from "antd";
import css from "../css/Persona.module.css";
import NumeroInput from "./NumeroInput";
import GastosDeOtros from "./GastosDeOtros"

const { Title } = Typography;

const Persona = forwardRef(({nombre, miembrosHogar }, ref) => {
  const [ganancias, setGanancias] = useState([]);
  const [gastosEquitativosPagados, setGastosEquitativosPagados] = useState([]);
  const [gastosEquitativosPendientes, setGastosEquitativosPendientes] = useState([]);
  const [gastosIgualitariosPagados, setGastosIgualitariosPagados] = useState([]);
  const [gastosIgualitariosPendientes, setGastosIgualitariosPendientes] = useState([]);
  const [personasACargo, setPersonasACargo] = useState(0);
  const [gastosPersonalesDeOtros, setGastosPersonalesDeOtros] = useState({});
  const gastosDeOtrosRef = useRef(null);
    
  const [modoActivo, setModoActivo] = useState(null);

  const [listaSinMiNombre, setListaSinMiNombre] = useState([]);

  const obtenerDatosDeGastosDeOtros = () => {    
    if (gastosDeOtrosRef) {      
    const nuevosDatos = gastosDeOtrosRef.current.obtenerDatos();    
    setGastosPersonalesDeOtros(nuevosDatos);       
  }};

  useEffect(() => {
    setListaSinMiNombre(miembrosHogar.filter(name => name !== nombre ))
  }, [miembrosHogar, nombre])

  const eliminarNumero = (tipo, index)=> {
    let nuevaListaDeNumeros = [];
    switch (tipo) {
      case "ganancia" :
        nuevaListaDeNumeros = [...ganancias];
        nuevaListaDeNumeros.splice(index,1);
        setGanancias(nuevaListaDeNumeros);
        break;

      case "gastoEquitativoPagado" :
        nuevaListaDeNumeros = [...gastosEquitativosPagados];
        nuevaListaDeNumeros.splice(index,1);
        setGastosEquitativosPagados(nuevaListaDeNumeros);
        break;

        case "gastoEquitativoPendiente" :
          nuevaListaDeNumeros = [...gastosEquitativosPendientes];
          nuevaListaDeNumeros.splice(index,1);
          setGastosEquitativosPendientes(nuevaListaDeNumeros);
          break;
      
          case "gastoIgualitarioPagado" :
            nuevaListaDeNumeros = [...gastosIgualitariosPagados];
            nuevaListaDeNumeros.splice(index,1);
            setGastosIgualitariosPagados(nuevaListaDeNumeros);
            break;

            case "gastoIgualitarioPendiente" :
              nuevaListaDeNumeros = [...gastosIgualitariosPendientes];
              nuevaListaDeNumeros.splice(index,1);
              setGastosIgualitariosPendientes(nuevaListaDeNumeros);
              break;

      }
    }    

    useImperativeHandle(ref, () => ({
      obtenerDatosPropios() {
      obtenerDatosDeGastosDeOtros();      
      return {
        nombre,
        ganancias,
        personasACargo,
        gastosEquitativosPagados,
        gastosEquitativosPendientes,
        gastosIgualitariosPagados,
        gastosIgualitariosPendientes,
        gastosPersonalesDeOtros
      };
    }
    }));
  
  return (
    <Card title={nombre}
      onClick={() => setModoActivo(null)}>
      <Row gutter={16}>
        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("ganancia"); }}>
            <strong>Ganancia:</strong>
            <div className={css.tagsContainer}>
              {ganancias.map((valor, index) => (
                <Tag key={index} color="blue" onClick={() => eliminarNumero("ganancia", index)}>
                  {valor}
                </Tag>
              ))}
            </div>
          </div>
          {modoActivo === "ganancia" && (
            <NumeroInput
              placeholder="Ingrese una ganancia"
              onAdd={(num) => setGanancias([...ganancias, num])}
              onClose={() => setModoActivo(null)}
            />
          )}
        </Col>
          <div>
        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("gastoEquitativoPagado"); }}>
            <strong>Gastos Equitativos pagados:</strong>
            <div className={css.tagsContainer}>
              {gastosEquitativosPagados.map((valor, index) => (
                <Tag key={index} color="red" onClick={() => eliminarNumero("gastoEquitativoPagado", index)}>
                  {valor}
                </Tag>
              ))}
            </div>
          </div>
          {modoActivo === "gastoEquitativoPagado" && (
            <NumeroInput
              placeholder="Ingrese un gasto"
              onAdd={(num) => setGastosEquitativosPagados([...gastosEquitativosPagados, num])}
              onClose={() => setModoActivo(null)}
            />
          )}
        </Col>

        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("gastoEquitativoPendiente"); }}>
            <strong>Gastos Equitativos Pendientes:</strong>
            <div className={css.tagsContainer}>
              {gastosEquitativosPendientes.map((valor, index) => (
                <Tag key={index} color="red" onClick={() => eliminarNumero("gastoEquitativoPendiente", index)}>
                  {valor}
                </Tag>
              ))}
            </div>
          </div>
          {modoActivo === "gastoEquitativoPendiente" && (
            <NumeroInput
              placeholder="Ingrese un gasto"
              onAdd={(num) => setGastosEquitativosPendientes([...gastosEquitativosPendientes, num])}
              onClose={() => setModoActivo(null)}
            />
          )}
        </Col>

        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("gastoIgualitarioPagado"); }}>
            <strong>Gastos Igualitarios pagados:</strong>
            <div className={css.tagsContainer}>
              {gastosIgualitariosPagados.map((valor, index) => (
                <Tag key={index} color="red" onClick={() => eliminarNumero("gastoIgualitarioPagado", index)}>
                  {valor}
                </Tag>
              ))}
            </div>
          </div>
          {modoActivo === "gastoIgualitarioPagado" && (
            <NumeroInput
              placeholder="Ingrese un gasto"
              onAdd={(num) => setGastosIgualitariosPagados([...gastosIgualitariosPagados, num])}
              onClose={() => setModoActivo(null)}
            />
          )}
        </Col>
        <Col span={24}>
          <div className={css.numerosContainer} onClick={(e) => { e.stopPropagation(); setModoActivo("gastoIgualitarioPendiente"); }}>
            <strong>Gastos Igualitario Pendiente:</strong>
            <div className={css.tagsContainer}>
              {gastosIgualitariosPendientes.map((valor, index) => (
                <Tag key={index} color="red" onClick={() => eliminarNumero("gastoIgualitarioPendiente", index)}>
                  {valor}
                </Tag>
              ))}
            </div>
          </div>
          {modoActivo === "gastoIgualitarioPendiente" && (
            <NumeroInput
              placeholder="Ingrese un gasto"
              onAdd={(num) => setGastosIgualitariosPendientes([...gastosIgualitariosPendientes, num])}
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
        <GastosDeOtros items={listaSinMiNombre} ref={gastosDeOtrosRef} >

        </GastosDeOtros>
        </Col>
      </Row>
      
    </Card>
  );
});

export default Persona;