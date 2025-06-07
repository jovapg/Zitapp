import { useState } from 'react';
import Nav from '../components/Nav';
import Topbar from '../components/Topbar';
import Categories from '../components/Categories';
import TusCitas from '../components/Tuscitas';
import UserCalendar from './Calendar/UserCalendar';
import BusinessMap from '../components/BusinessMap';
import ConfigUser from '../components/ConfigUser';
import Contactanos from '../components/Contactanos';

export default function HomePageuser() {
    const [currentView, setCurrentView] = useState('tuscitas');
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    // Estado para manejar las nuevas citas agendadas
    const [nuevasCitas, setNuevasCitas] = useState([]);

    const handleNavigate = (view) => {
        console.log(`Navigating to: ${view}`);
        setCurrentView(view);
    };

    // Función que se ejecuta cuando se agenda una nueva cita
    const handleCitaAgendada = (nuevaCita) => {
        console.log('Nueva cita agendada:', nuevaCita);
        setNuevasCitas(prevCitas => [...prevCitas, nuevaCita]);
        
        // Aquí puedes hacer la llamada a la API para guardar la cita
        /*
        try {
            const response = await axios.post('http://localhost:8081/api/Appointments', {
                clientId: nuevaCita.id_cliente,
                businessId: nuevaCita.id_negocio,
                fecha: nuevaCita.fecha,
                hora: nuevaCita.hora,
                servicio: nuevaCita.servicio,
                estado: 'pendiente'
            });
            console.log('Cita guardada en la API:', response.data);
        } catch (error) {
            console.error('Error al guardar la cita:', error);
        }
        */
    };

    return (
        <>
            <div className="dashboard-layout">
                <br />
                <br />
                <Nav onNavigate={handleNavigate} />
                <div className="main-content">
                    <Topbar 
                        onNavigate={handleNavigate}
                        onSearch={(textBusqueda) => {
                            setFiltroBusqueda(textBusqueda);
                            handleNavigate('categorias');
                        }}
                    />

                    {currentView === 'tuscitas' && (
                        <TusCitas 
                            nuevasCitas={nuevasCitas}
                            onCitaAgendada={handleCitaAgendada}
                        />
                    )}
                    {currentView === 'categorias' && (
                        <Categories 
                            filtroBusqueda={filtroBusqueda}
                            onCitaAgendada={handleCitaAgendada}
                        />
                    )}
                    {currentView === 'calendar' && <UserCalendar />}
                    {currentView === 'mapa' && <BusinessMap />}
                    {currentView === 'configuser' && <ConfigUser />}
                    {currentView === 'ayuda' && <Contactanos/>}
                </div>
            </div>

            <style>{`
                .dashboard-layout {
                    display: flex;
                    height: 100vh;
                    overflow: hidden;
                    font-family: Arial, sans-serif;
                    color: white;
                    position: relative;
                }

                .dashboard-layout::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: url('https://images.unsplash.com/photo-1522199710521-72d69614c702?fit=crop&w=1950&q=80');
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.4);
                    z-index: -1;
                }

                .main-content {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 1rem 2rem;
                }
            `}</style>
        </>
    );
}