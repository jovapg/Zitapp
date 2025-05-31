import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Helper para comparar arrays de notificaciones por id y mensaje (para detectar nuevas)
  const areNotificationsEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i].id || a[i].message !== b[i].message) return false;
    }
    return true;
  };

  const fetchNotifications = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      let userIdForNotifications =
        user.tipo === "NEGOCIO"
          ? localStorage.getItem("negocioId")
          : user.id;

      if (!userIdForNotifications) return;

      const url = `http://localhost:8081/api/notifications/${userIdForNotifications}`;
      const response = await axios.get(url);
      const newNotifications = Array.isArray(response.data)
        ? response.data
        : [];

      // Obtener estado de leído guardado localmente
      const readStates = JSON.parse(localStorage.getItem("notificationsRead") || "{}");

      // Combinar datos para mantener isRead según localStorage o backend
      const merged = newNotifications.map((n) => ({
        ...n,
        isRead: readStates[n.id] !== undefined ? readStates[n.id] : n.isRead,
      }));

      setNotifications((prevNotifs) => {
        // Solo actualizamos si hay cambios reales (para evitar parpadeos)
        if (areNotificationsEqual(prevNotifs, merged)) {
          return prevNotifs;
        }
        return merged;
      });
    } catch (error) {
      console.error("Error fetching notifications", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    // Detectar clicks fuera del dropdown para cerrarlo
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresca cada 30s
    return () => clearInterval(interval);
  }, []);

  // Cantidad de notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unread.map((n) =>
          axios.put(`http://localhost:8081/api/notifications/${n.id}/read`)
        )
      );

      // Guardar en localStorage que están leídas
      const readStates = {};
      notifications.forEach((n) => {
        readStates[n.id] = true;
      });
      localStorage.setItem("notificationsRead", JSON.stringify(readStates));

      // Actualizar localmente
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Error al marcar como leídas", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/notifications/${id}`);

      // Actualizar localStorage eliminando la notificación
      const readStates = JSON.parse(localStorage.getItem("notificationsRead") || "{}");
      delete readStates[id];
      localStorage.setItem("notificationsRead", JSON.stringify(readStates));

      // Actualizar localmente quitando la notificación
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar la notificación", error);
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-primary position-relative d-flex align-items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-bell-fill" style={{ fontSize: "1.2rem" }}></i>
        Notificaciones
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.7rem" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="dropdown-menu dropdown-menu-end show p-2"
          style={{
            minWidth: "320px",
            maxHeight: "350px",
            overflowY: "auto",
            boxShadow:
              "0 0.5rem 1rem rgba(0, 0, 0, 0.15), 0 0 0.25rem rgba(0,0,0,0.05)",
          }}
        >
          {notifications.length === 0 ? (
            <span className="dropdown-item text-muted">
              No hay notificaciones.
            </span>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="dropdown-item d-flex justify-content-between align-items-start flex-column mb-2"
                style={{
                  cursor: "default",
                  backgroundColor: notif.isRead ? "#e9ecef" : "#f8f9fa",
                  fontWeight: notif.isRead ? "normal" : "bold",
                }}
              >
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    lineHeight: "1.2em",
                    maxHeight: "3.6em",
                    marginBottom: "4px",
                  }}
                >
                  {notif.message}
                </div>
                <div className="d-flex justify-content-between w-100">
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: "0.65rem", padding: "0.1rem 0.3rem" }}
                    onClick={() => deleteNotification(notif.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
          {notifications.length > 0 && (
            <>
              <div className="dropdown-divider"></div>
              <button
                className="btn btn-sm btn-outline-primary w-100"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
