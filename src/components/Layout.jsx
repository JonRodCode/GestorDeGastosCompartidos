import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const location = useLocation(); // Obtiene la URL actual

  // Define qué ítem del menú debe estar seleccionado según la ruta
  const getSelectedKey = () => {
    if (location.pathname === "/") return "1";
    if (location.pathname.startsWith("/NuevaGestion")) return "2";
    if (location.pathname.startsWith("/DistribucionRapida")) return "3";
    return ""; // Ninguno seleccionado si la ruta no coincide
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} selectedKeys={[getSelectedKey()]}>
          <Menu.Item key="1">
            <Link to="/">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2">
           <Link to="/NuevaGestion/IngresoDatos">Nueva Gestión</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/DistribucionRapida">Distribución Rápida</Link>
          </Menu.Item>
        </Menu>
      </Header>

      {/* Contenido principal */}
      <Content style={{ padding: "20px" }}>
        <Outlet /> {/* Aquí se renderizan las páginas */}
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        © 2025 - Todos los derechos reservados
      </Footer>
    </Layout>
  );
};

export default AppLayout;

