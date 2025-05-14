import React from 'react';
import Nav from '../components/Nav';
import Topbar from '../components/Topbar';
import Categories from '../components/Categories';
import TusCitas from '../components/tuscitas';

export default function HomePageuser() {
    return (
        <>
            <div className="dashboard-layout">
                <Nav />
                <div className="main-content">
                    <Topbar />
                    <TusCitas />
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
