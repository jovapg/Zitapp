import React, { useState } from "react"; // ¡Importar useState!
import NotificationsDropdown from "./Notifacation/NotificationsDropdown"; // Asegúrate de que la ruta sea correcta
import Botonagendarcita from "./Botonagendarcita"; // Asegúrate de que la ruta sea correcta

export default function TopbarNegocio({ onNavigate }) { // onShowAppointmentModal ya no es necesario como prop
  const user = JSON.parse(localStorage.getItem("user"));

  // Estado para controlar la visibilidad del modal Botonagendarcita
  const [showAgendarModal, setShowAgendarModal] = useState(false);

  const userProfileImage = user?.imagenPerfil || "https://via.placeholder.com/50x50?text=User";

  // Función para abrir el modal Botonagendarcita
  const handleOpenAgendarModal = () => {
    setShowAgendarModal(true);
  };

  // Función para cerrar el modal Botonagendarcita
  const handleCloseAgendarModal = () => {
    setShowAgendarModal(false);
    // Opcional: podrías recargar algo aquí si necesitas que la página principal se actualice
    // después de agendar una cita desde el topbar.
  };

  // Manejador para cuando una cita es agendada exitosamente desde el modal
  const handleCitaAgendada = (nuevaCita) => {
    console.log("Cita agendada desde Topbar:", nuevaCita);
    handleCloseAgendarModal(); // Cerrar el modal
    // Aquí podrías disparar una notificación, o una recarga de datos principal si fuera necesario
  };


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
              onClick={handleOpenAgendarModal} // Llama a la función para abrir el modal
              style={{ cursor: 'pointer' }}
            >
              NUEVA CITA
            </span>

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
          <h4 className="topbar-btn text-white">{user?.nombre}</h4>
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

      {/* Renderizado condicional del modal Botonagendarcita */}
      {showAgendarModal && (
        <Botonagendarcita
          show={showAgendarModal}
          handleClose={handleCloseAgendarModal}
          business={null} // Pasa null o undefined si el negocio no está pre-seleccionado
          onCitaAgendada={handleCitaAgendada}
        />
      )}

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(6px);
          color: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .topbar h2, .topbar p {
            color: white;
        }
        .topbar-btn {
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .topbar-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}