import fondologin from '../assets/img/LOGO Zitapp.png';
import { useNavigate } from "react-router-dom";


export default function NavNegocio({ onNavigate }) {
    const Navigate = useNavigate();

      let handleLogout = () => {
    let confirmarLogin = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmarLogin) {
        localStorage.removeItem("user");
     localStorage.removeItem("negocioId");    // elimina los datos de sesión
      Navigate("/FirsPage"); // redirige al inicio
    } 
  };

    return (
        <div className="sidebar">
            <div className="mb-4 text-center">
              <img
                src={fondologin}
                alt="login icon"
                className="img-fluid mt-2"
                style={{
                  width: '150px',
                  display: 'block',     // Para que 'margin: auto' funcione y centre la imagen
                  margin: '0 auto',     // Centra la imagen horizontalmente
                  transition: 'transform 0.3s ease-in-out', // Suaviza la transición al hacer hover
                  cursor: 'pointer' // Cambia el cursor a una mano para indicar que es interactivo
                }}
                // Añadir un manejador de eventos onMouseOver y onMouseOut para el efecto de aumento
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} // Aumenta 10%
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}  // Vuelve al tamaño original
              />
                      <h2 className="text-white fw-bold">ZITAPP</h2>
                    </div>
              <hr className="text-light my-1" /> 
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-3">

                </li>
                <li className="nav-item mb-3">

                </li>
                <li className="nav-item mb-3">
                    <a href="" className="nav-link dashboard-btn text-white">
                        <i className="-circle me-2"></i> Mi Negocio
                    </a>
                </li>


                <li className="nav-item mb-3">
                    <button
                        onClick={() => onNavigate('calendar')}
                        className="nav-link dashboard-btn text-white btn btn-link text-start"
                    >
                        <i className="-circle me-2"></i> Calendario
                    </button>
                </li>
                                <li className="nav-item mb-3">
                    <button
                        onClick={() => onNavigate('')}
                        className="nav-link dashboard-btn text-white btn btn-link text-start"
                    >
                        <i className="-circle me-2"></i> Ayuda y Servicio al cliente
                    </button>
                </li>

                                 <li className="nav-item mb-3">
                    <button
                        onClick={() => onNavigate('calendar')}
                        className="nav-link dashboard-btn text-white btn btn-link text-start"
                    >
                        <i className="-circle me-2"></i> Agregar empleados
                    </button>
                </li>
                
                
            </ul>
            <div className="mt-auto">
                <a  className="nav-link dashboard-btn"
                 onClick={() => onNavigate('config')}
                >
                    <i className="bi bi-gear me-2"></i>Configuración
                </a>
                <a  className="nav-link dashboard-btn mt-2"
                onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"
                       ></i>Logout
                </a>
            </div>

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
