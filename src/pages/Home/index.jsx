import { Button, Typography, Card } from 'antd';
import styles from './Home.module.css';

const { Title, Text } = Typography;

const Home = () => {
  return (
    <div className={styles.container}>
        <div className={styles.titulo}>
      <Title className={styles.title}>¡Bienvenido al Gestor de Gastos Compartidos!</Title>
      <Text className={styles.description}>
        Organiza los gastos del hogar de manera justa, igualitaria y/o equitativa.
      </Text>
      </div>
      <div className={styles.row}>
        {/* Card para Nueva Gestión */}
        <div className={styles.col}>
          <Card className={styles.card} title="Nueva Gestión" bordered={false}>
            <Text className={styles.cardDescription}>
              Comienza a cargar los datos del hogar y los gastos para gestionar las distribuciones.
            </Text>
            <Button className={styles.cardButton} href="/#/NuevaGestion/IngresoDatos">
              Comenzar Nueva Gestión
            </Button>
          </Card>
        </div>

        {/* Card para Distribución Rápida */}
        <div className={styles.col}>
          <Card className={styles.card} title="Distribución Rápida" bordered={false}>
            <Text className={styles.cardDescription}>
              Realiza una distribución rápida de los gastos sin necesidad de configuraciones previas.
            </Text>
            <Button className={styles.cardButton} href="/#/DistribucionRapida">
              Ir a Distribución Rápida
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
