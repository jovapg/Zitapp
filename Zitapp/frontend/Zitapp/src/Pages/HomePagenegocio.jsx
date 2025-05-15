
import  { useState } from 'react';
import NavNegocio from '../components/Navnegocio';
import TopbarNegocio from '../components/TopbarNegocio';
import Categories from '../components/Categories';
import CitasNegocio from '../components/CitasNegocio';

export default function HomePagenegocio() {
    
        const [currentView, setCurrentView] = useState('tuscitas');
    
        const handleNavigate = (view) => {
            console.log(`Navigating to: ${view}`);
            setCurrentView(view);
        };
    
        return (
            <>
        
                <div className="dashboard-layout">
                    <NavNegocio onNavigate={handleNavigate} />
                    <div className="main-content">
                        <TopbarNegocio onNavigate={handleNavigate} />
    
                        {currentView === 'tuscitas' && <CitasNegocio />}
                        {currentView === 'categorias' && <Categories />}
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
    
