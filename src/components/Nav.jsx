import fondologin from '../assets/img/LOGO Zitapp.png';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import ConfigUser from './ConfigUser';

export default function Nav({ onNavigate }) {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false); // Aquí estaba el error: no se había definido este estado



  let handleLogout = () => {
    let confirmarLogin = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmarLogin) {
    localStorage.removeItem("user"); // elimina los datos de sesión
      navigate("/FirsPage"); // redirige al inicio
    } 
  };

  return (
    <div className="sidebar">
      <div className="mb-4 text-center">
        <img
          src={fondologin}
          alt="login icon"
          className="img-fluid mt-2"
          style={{ width: '90px' }}
        />
        <h2 className="text-white fw-bold">ZITAPP</h2>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-3">
          <button
            onClick={() => onNavigate('categorias')}
            className="nav-link dashboard-btn text-white btn btn-link text-start"
          >
            <i className="bi bi-circle me-2"></i> Categorías
          </button>
        </li>
        <li className="nav-item mb-3">
          <button
            onClick={() => onNavigate('tuscitas')}
            className="nav-link dashboard-btn text-white btn btn-link text-start"
          >
            <i className="bi bi-circle me-2"></i> Tus Citas
          </button>
        </li>
        <li className="nav-item mb-3">
          <button
            onClick={() => onNavigate('calendar')}
            className="nav-link dashboard-btn text-white btn btn-link text-start"
          >
            <i className="bi bi-circle me-2"></i> Calendar
          </button>
        </li>
      </ul>

      <div className="mt-auto">
        <button
          className="nav-link dashboard-btn btn btn-link text-start"
          onClick={() => setModalVisible(true)}
        >
          <i className="bi bi-gear me-2"></i>Settings
        </button>

      
      <button className="nav-link btn btn-link text-start" onClick={ handleLogout}>
        <i className="fas fa-sign-out-alt fa-sm text-white-50"></i> Salir
          </button>
            
      </div>

      {/* Modal de configuración de usuario */}
      <ConfigUser show={modalVisible} handleClose={() => setModalVisible(false)} />

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
          font-size: 0.9rem;
          transition: transform 0.2s ease;
        }

        .dashboard-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
