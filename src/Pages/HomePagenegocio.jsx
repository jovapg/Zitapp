import { useState } from 'react';
import NavNegocio from '../components/NavNegocio';
import fondoAzul from '../assets/img/fondonegocio.jpg';
import TopbarNegocio from '../components/TopbarNegocio';
import Categories from '../components/Categories';
import CitasNegocio from '../components/CitasNegocio';
import BusinessCalendar from './Calendar/BusinessCalendar';
import ConfigNegocio from '../components/ConfigNegocio';


export default function HomePagenegocio() {
    const [currentView, setCurrentView] = useState('tuscitas');

    const handleNavigate = (view) => {
        console.log(`Navigating to: ${view}`);
        setCurrentView(view);
    };

    return (
        <div className="page-container">
            <div className="dashboard-layout">
                <NavNegocio onNavigate={handleNavigate} />
                <div className="main-content">
                    <TopbarNegocio onNavigate={handleNavigate} />

                    {currentView === 'tuscitas' && <CitasNegocio />}                  
                    {currentView === 'calendar' && <BusinessCalendar />}
                    {currentView === 'config' && <ConfigNegocio />}
                </div>
            </div>

            <style>{`
                .page-container {
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                    font-family: Arial, sans-serif;
                    color: white;
                }

                .page-container::before {
                    content: "";
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: url(${fondoAzul});
                    background-size: cover;
                    background-position: center;
                    filter: brightness(1);
                    z-index: ;
                }

                .dashboard-layout {
                    display: flex;
                    height: 100%;
                    position: relative;
                    z-index: 1;
                }

                .main-content {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 1rem 2rem;
                }
            `}</style>
        </div>
    );
}
