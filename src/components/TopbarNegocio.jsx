import React from "react";
import NotificationsDropdown from "./Notifacation/NotificationsDropdown"; // Asegúrate de que la ruta sea correcta

export default function TopbarNegocio({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Obtener la imagen de perfil directamente del objeto 'user'
  // Si user o user.imagenPerfil son null/undefined, usa un placeholder por defecto
  const userProfileImage = user?.imagenPerfil || "https://via.placeholder.com/50x50?text=User";

  return (
    <>
      <br />
      <div className="topbar d-flex justify-content-between align-items-center p-3">
        <div>
          <h2 className="mt-2 text-white">¡Haz las cosas sencillas!</h2>
          <p className="text">
            Administra y planea tu agenda de la mejor manera a un click
          </p>
          <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
            <span
              className="badge rounded-pill bg-primary px-3 py-2 topbar-btn"
              onClick={() => onNavigate?.('')}
              style={{ cursor: 'pointer' }}
            >
              NUEVA CITA
            </span>

            {/* No se necesita una barra de búsqueda si no hay un input */}
            <span
              className="badge rounded-pill bg-primary px-3 py-2 topbar-btn"
              onClick={() => onNavigate?.('reportes')}
              style={{ cursor: 'pointer' }}
            >
              REPORTES
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <NotificationsDropdown />
          <h4 className="topbar-btn text-white">{user?.nombre}</h4> {/* Añadido text-white */}
          <img
            src={userProfileImage} // Usamos la URL de la imagen de perfil del usuario
            alt="User Profile"
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/50x50?text=Error"; // Placeholder si la URL falla
            }}
          />
        </div>
      </div>

      {/* Estilos específicos del Topbar */}
      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(6px);
          color: white; /* Asegura que el texto general del topbar sea blanco */
          box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* Sombra sutil */
        }
        .topbar h2, .topbar p {
            color: white; /* Asegura que estos textos sean blancos */
        }
        .topbar-btn {
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .topbar-btn:hover {
          transform: scale(1.05); /* Escala un poco menos para ser sutil */

      `}</style>
    </>
  );
}