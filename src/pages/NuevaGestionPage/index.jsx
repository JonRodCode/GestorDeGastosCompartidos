import { useState } from "react";
import { Typography, Button } from "antd";
import MiembrosInput from "../../components/MiembrosInput";
import PersonaConGastos from "./components/PersonaConGastos";
import css from "./css/NuevaGestionPage.module.css";


const { Title } = Typography;

const NuevaGestionPage = () => {
    const [activeView, setActiveView] = useState(null);
    const [personas, setPersonas] = useState([]);
    const [miembrosDelHogar, setMiembrosDelHogar] = useState([]);

    // Función para actualizar los gastos de una persona específica
    const actualizarGastosDePersona = (nombre, nuevosGastos) => {
        setPersonas((prevPersonas) =>
            prevPersonas.map((persona) =>
                persona.nombre === nombre ? { ...persona, gastos: nuevosGastos } : persona
            )
        );
    };

    return (
        <div className={css.container}>
          
            <Title level={2} className={css.title}>
                Nueva Gestión de Gastos del Hogar
            </Title>

            <div className={css.buttonContainer}>
                <Button 
                    className={activeView === 'view1' ? css.activeButton : css.defaultButton} 
                    onClick={() => setActiveView('view1')}
                >
                    Gastos
                </Button>
                <Button 
                    className={activeView === 'view2' ? css.activeButton : css.defaultButton} 
                    onClick={() => setActiveView('view2')}
                >
                    Especificaciones
                </Button>
            </div>

            <div>
                {activeView === 'view1' && (
                    <div>
                        <Title level={3} className={css.subtitle}>
                            Cargar Gastos Por Persona
                        </Title>
                        <MiembrosInput 
                            personas={personas} 
                            setPersonas={setPersonas} 
                            miembrosDelHogar={miembrosDelHogar} 
                            setMiembrosDelHogar={setMiembrosDelHogar}
                        />
                        <div className={css.mainContainer}>
                            <div className={css.leftSection}>
                                {personas.length !== 0 ? (
                                    personas.map((persona, index) => (
                                        <PersonaConGastos
                                            key={index}
                                            nombre={persona.nombre}
                                            gastos={persona.gastos || []} // Asegurar que siempre tenga un array
                                            setGastos={(nuevosGastos) => actualizarGastosDePersona(persona.nombre, nuevosGastos)}
                                        />
                                    ))
                                ) : (
                                    <p>Agregue una persona</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeView === 'view2' && (
                    <div>
                        <h1>Especificaciones</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NuevaGestionPage;

