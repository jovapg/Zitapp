import React, { useState } from 'react';
import fondologin from '../assets/img/LOGO Zitapp.png';
import { useNavigate } from "react-router-dom";
import Contactanos from './Contactanos';
import ConfigNegocio from './ConfigNegocio';
import CitasNegocio from './CitasNegocio';

export default function NavNegocio({ onNavigate }) {
  const navigate = useNavigate();
  const [configneModalVisible, setConfigneModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("negocioId");
      navigate("/FirsPage");
    }
  };

  return (
    <div className="sidebar">
      {/* Logo y título */}
      <div className="mb-4 text-center">
        <img
          src={fondologin}
          alt="Zitapp logo"
          className="img-fluid mt-2"
          style={{
            width: '150px',
            display: 'block',
            margin: '0 auto',
            transition: 'transform 0.3s ease-in-out',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <h2 className="text-white fw-bold mt-2">ZITAPP</h2>
      </div>

      <hr className="text-light my-1" />

      {/* Navegación */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-3">
          <button
            onClick={() => onNavigate('tuscitas')}
            className="nav-link text-white dashboard-btn btn btn-link text-start"
          >
            <i className="bi bi-house-door me-2"></i> Mi Negocio
          </button>
        </li>
        <li className="nav-item mb-3">
          <button
            onClick={() => onNavigate('calendar')}
            className="nav-link text-white dashboard-btn btn btn-link text-start"
          >
            <i className="bi bi-calendar3 me-2"></i> Calendario
          </button>
        </li>
        <li className="nav-item mb-3">
          <button
            onClick={() => setContactModalVisible(true)}
            className="nav-link text-white dashboard-btn btn btn-link text-start"
          >
            <i className="bi bi-question-circle me-2"></i> Ayuda y Servicio
          </button>
        </li>
      </ul>

      {/* Sección inferior */}
      <div className="mt-auto">
        <button
          onClick={() => setConfigneModalVisible(true)}
          className="nav-link text-white dashboard-btn btn btn-link text-start"
        >
          <i className="bi bi-gear me-2"></i> Configuración
        </button>
        <button
          onClick={handleLogout}
          className="nav-link text-white dashboard-btn btn btn-link text-start mt-2"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Salir
        </button>
      </div>

      {/* Modales - Se pasan las props 'show' y 'handleClose' */}
      <ConfigNegocio show={configneModalVisible} handleClose={() => setConfigneModalVisible(false)} />
      <Contactanos show={contactModalVisible} handleClose={() => setContactModalVisible(false)} />

      {/* Estilos */}
      <style>{`
        .sidebar {
          width: 250px;
          background-color: rgba(18, 18, 28, 0.85);
          padding: 1rem;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          color: white;
        }

        .dashboard-btn {
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .dashboard-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}