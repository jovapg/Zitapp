import React from "react";
import { Modal, Button, Image } from "react-bootstrap";

export default function ModalViewCita({ show, onClose, cita }) {
  const formatFecha = (fecha) => {
    if (!Array.isArray(fecha) || fecha.length !== 3) return "";
    const [anio, mes, dia] = fecha;
    return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  };

  const formatHora = (hora) => {
    if (!Array.isArray(hora) || hora.length < 2) return "";
    const [h, m] = hora;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cita ? (
          <div className="row">
            {/* Información del cliente */}
            <div className="col-md-6 mb-3">
              <h5>Cliente</h5>
              <Image src={cita.client?.imagenPerfil} roundedCircle width={80} height={80} />
              <p><strong>Nombre:</strong> {cita.client?.nombre}</p>
              <p><strong>Teléfono:</strong> {cita.client?.telefono}</p>
              <p><strong>Email:</strong> {cita.client?.email}</p>
              <p><strong>Edad:</strong> {cita.client?.edad}</p>
            </div>

            {/* Información del negocio */}
            <div className="col-md-6 mb-3">
              <h5>Negocio</h5>
              <Image src={cita.business?.imagenUrl} rounded width="100%" height="150px" style={{ objectFit: "cover" }} />
              <p><strong>Nombre:</strong> {cita.business?.nombre}</p>
              <p><strong>Categoría:</strong> {cita.business?.categoria}</p>
              <p><strong>Descripción:</strong> {cita.business?.descripcion}</p>
              <p><strong>Dirección:</strong> {cita.business?.direccion}</p>
            </div>

            {/* Información del servicio */}
            <div className="col-md-6 mb-3">
              <h5>Servicio</h5>
              <p><strong>Nombre:</strong> {cita.service?.nombre}</p>
              <p><strong>Descripción:</strong> {cita.service?.descripcion}</p>
              <p><strong>Precio:</strong> ${cita.service?.precio}</p>
              <p><strong>Duración:</strong> {cita.service?.duracion} minutos</p>
            </div>

            {/* Información de la cita */}
            <div className="col-md-6 mb-3">
              <h5>Detalles de la Cita</h5>
              <p><strong>Fecha:</strong> {formatFecha(cita.fecha)}</p>
              <p><strong>Hora:</strong> {formatHora(cita.hora)}</p>
              <p><strong>Estado:</strong> {cita.estado}</p>
              <p><strong>ID de la Cita:</strong> {cita.id}</p>
            </div>
          </div>
        ) : (
          <p>No hay información disponible</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
