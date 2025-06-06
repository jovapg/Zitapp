import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './Notifacation/NotificationsDropdown';
import ConfigUser from './ConfigUser';

export default function Topbar({ onNavigate, onSearch }) {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
    const [modalVisible, setModalVisible] = useState(false); 

  // URL de imagen de perfil del usuario o una por defecto
  // Tus datos de localStorage muestran que tienes 'imagenPerfil', así que lo usamos.
  const userProfileImage = user?.imagenPerfil || "https://via.placeholder.com/50x50?text=Usuario"; 

  const manejarBusqueda = () => {
    if (busqueda.trim() !== '') {
      onSearch(busqueda.toLowerCase());
    } else {
      onSearch('');
    }
  };

  return (
    <>
      <br />
      <div className="topbar d-flex justify-content-between align-items-center p-3">
        {/* Sección izquierda */}
        <div>
          <h2 className="mt-2 text-white">¡Haz las cosas sencillas!</h2>
          <p className="text">
            Administra y planea tus citas de la mejor manera a un click
          </p>
          <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
            <span
              className="badge rounded-pill bg-primary px-3 py-2 topbar-btn"
              onClick={() => onNavigate?.('mapa')}
              style={{ cursor: 'pointer' }}
            >
              CERCA DE TI
            </span>

            {/* Barra de búsqueda */}
            <div className="d-flex align-items-center search-bar px-2 py-1 rounded text-black">
              <input
                type="text"
                className="form-control form-control-sm text-white bg-transparent border-1 border-light me-2"
                placeholder="Buscar..."
                style={{ minWidth: "270px", borderRadius: "50px" }}
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  onSearch(e.target.value);
                }}
                onKeyDown={(e) => e.key === 'Enter' && manejarBusqueda()}
              />
              <button
                className="btn btn-sm btn-outline-light"
                style={{ borderRadius: "8px" }}
                onClick={manejarBusqueda}
              >
                🔍
              </button>
            </div>
          </div>
        </div>

        {/* Sección derecha: usuario */}
        <div className="d-flex align-items-center gap-3">
          <NotificationsDropdown />
          <h4 className="  light topbar-btn"
          onClick={() => setModalVisible(true)}
          >
            {user?.nombre}
          </h4>
          <img
            src={userProfileImage}
            alt="User Profile"
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/50x50?text=Error"; 
            }}
          />
        </div>
      </div>
            {/* Modal de configuración de usuario */}
            <ConfigUser show={modalVisible} handleClose={() => setModalVisible(false)} />


      {/* Estilos específicos */}
      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: rgba(0, 0, 0, 0.6);
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
      `}</style>
    </>
  );
}