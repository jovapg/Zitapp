import React from 'react';
import Nav from '../components/Nav';
import Topbar from '../components/Topbar';

export default function HomePageuser() {
    return (
        <>
            <div className="dashboard-layout">
                <Nav />

                <div className="main-content">
                    <Topbar />

                    <div className="d-flex content-section">
                        {/* Left Column */}
                        <div className="flex-grow-1">
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(35, 35, 60, 0.8)" }}>
                                <h6 className="text-info">Today</h6>
                                <p className="mb-1 fw-bold">ESTAS SON TUS CITAS PENDIENTES</p>
                                <p className="mb-1">Description:</p>
                                <small>08:00 AM - 10:00 AM</small>
                            </div>
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(40, 40, 90, 0.85)" }}>
                                <h6 className="text-info">RECORDATORIO</h6>
                                <p className="mb-1 fw-bold">LLEVA UN RECORDATORIO DE TUS CITAS</p>
                                <p>No tienes ningún recordatorio creado</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="p-3 rounded" style={{ width: "360px", background: "rgba(45, 45, 70, 0.85)" }}>
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 90, 0.9)" }}>
                                <h6>Tarjetas de negocios con posibles citas</h6>
                                <p>Aca van algunas tarjetas de negocio que pueden interesarte</p>
                                <button className="btn btn-sm btn-primary d-block mt-2">Botón para abrir el negocio</button>
                            </div>
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 100, 0.9)" }}>
                                <h6>Barbería</h6>
                                <p>Nuestra barbería es la mejor, agenda tu cita ya</p>
                                <p>Cel: 3012408555</p>
                                <button className="btn btn-sm btn-outline-light">Más info</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos */}
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

                .topbar {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(6px);
                    color: white;
                }

                .topbar-btn {
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }

                .topbar-btn:hover {
                    transform: scale(1.1);
                }

                .search-bar input::placeholder {
                    color: #ccc;
                }

                .search-bar input:focus {
                    box-shadow: none;
                    outline: none;
                    border-color: #0d6efd;
                    background-color: rgba(255, 255, 255, 0.05);
                }

                .content-section {
                    display: flex;
                    gap: 24px;
                    margin-top: 1rem;
                }
            `}</style>
        </>
    );
}
