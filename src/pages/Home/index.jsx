import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const irADistribucion = () => {
        navigate("/DistribucionRapida");
    };

    const irANuevaGestionI = () => {
        navigate("/NuevaGestion/IngresoDatos");
    };
    const irANuevaGestionC = () => {
        navigate("/NuevaGestion/AnalisisClasificacion");
    };

    return <>
    <h1>Bienvenido</h1>
    <h1>Distribución</h1>
    <button onClick={irADistribucion}>Ir a Distribuidor</button>
    <h1>Nueva gestión</h1>
    <button onClick={irANuevaGestionI}>Ir a Nueva Gestión</button>
    <h1>Nueva gestión Clasificacion</h1>
    <button onClick={irANuevaGestionC}>Ir a Nueva Gestión Clasificacion</button>
    </>
}

export default Home;