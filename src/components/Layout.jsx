import { Outlet, Link } from "react-router-dom";
import { Layout, Menu } from "antd";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/NuevaGestion/IngresoDatos">Nueva Gestión</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/DistribucionRapida">Distribución Rápida</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/LoginPage">Login</Link>
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

