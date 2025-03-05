import DistribucionRapidaPage from "./pages/DistribucionRapida";
import NuevaGestionIngresoDatos from "./pages/NuevaGestion/IngresoDatos";
import NuevaGestionAnalisisClasificacion from "./pages/NuevaGestion/AnalisisClasificacion";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "antd/dist/reset.css";

const App = () => {
  return (
    <Routes>
      {/* Layout envuelve todas las rutas hijas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="DistribucionRapida" element={<DistribucionRapidaPage/>} />
        <Route path="NuevaGestion/IngresoDatos" element={<NuevaGestionIngresoDatos />} />
        <Route path="NuevaGestion/AnalisisClasificacion" element={<NuevaGestionAnalisisClasificacion />} />
      </Route>
    </Routes>
  );
};

export default App;
