import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function Botonagendarcita({ show, setShow, onCitaAgendada }) {
  const servicios = [
    {
      nombre: "Corte de cabello",
      descripcion: "Corte clásico y moderno",
      duracion: "30 minutos",
      costo: "150.000"
    },
    {
      nombre: "Peinado",
      descripcion: "Peinado para eventos especiales",
      duracion: "45 minutos",
      costo: "150.000"
    },
    {
      nombre: "Coloración",
      descripcion: "Aplicación de color permanente",
      duracion: "1 hora",
      costo: "150.000"
    }
  ];

  const disponibilidad = [
    { dia: "Hoy", horas: ["10:00 AM", "11:00 AM", "1:00 PM"] },
    { dia: "Mañana", horas: ["9:00 AM", "12:00 PM", "3:00 PM"] },
    { dia: "Pasado Mañana", horas: ["11:00 AM", "2:00 PM"] }
  ];

  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const handleAgendar = () => {
    if (!servicioSeleccionado) {
      alert("Por favor selecciona un servicio.");
      return;
    }
    if (!fechaSeleccionada) {
      alert("Por favor selecciona una fecha.");
      return;
    }
    if (!horaSeleccionada) {
      alert("Por favor selecciona una hora.");
      return;
    }

    // Crear el objeto de la nueva cita
    const nuevaCita = {
      id_cliente: 7, // ID del usuario actual (puedes pasarlo como prop)
      id_negocio: 1, // ID del negocio (puedes pasarlo como prop)
      fecha: fechaSeleccionada,
      hora: `${horaSeleccionada}:00`,
      estado: "pendiente",
      nombre_negocio: "Salón de Belleza", // Nombre del negocio (puedes pasarlo como prop)
      client_name: "Usuario Actual", // Nombre del cliente (puedes pasarlo como prop)
      client_email: "usuario@email.com", // Email del cliente (puedes pasarlo como prop)
      business_description: "Servicios de belleza y cuidado personal",
      business_address: "Calle Principal #123",
      business_image: "",
      appointment_id: Date.now(), // ID temporal hasta que se guarde en la API
      servicio: servicioSeleccionado,
      costo: servicios.find(s => s.nombre === servicioSeleccionado)?.costo || "0"
    };

    // Llamar a la función callback para agregar la cita
    if (onCitaAgendada) {
      onCitaAgendada(nuevaCita);
    }

    alert(
      `Cita para "${servicioSeleccionado}" agendada correctamente. Se encuentra en estado PENDIENTE. En unos minutos te notificaremos...`
    );

    // Limpiar el formulario
    setServicioSeleccionado("");
    setFechaSeleccionada("");
    setHoraSeleccionada("");
    setShow(false);
  };

  const servicioInfo = servicios.find(s => s.nombre === servicioSeleccionado);

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="xl"
        centered
        backdrop="static"
        className="custom-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>AGENDA TU CITA FÁCIL</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Servicio</Form.Label>
                  <Form.Select
                    value={servicioSeleccionado}
                    onChange={(e) => setServicioSeleccionado(e.target.value)}
                  >
                    <option value="">Selecciona un servicio</option>
                    {servicios.map((servicio, idx) => (
                      <option key={idx} value={servicio.nombre}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {servicioInfo && (
                  <div className="mb-3 p-2 rounded servicio-info">
                    <p className="mb-1"><strong>Descripción:</strong> {servicioInfo.descripcion}</p>
                    <p className="mb-1"><strong>Duración:</strong> {servicioInfo.duracion}</p>
                    <p className="mb-1"><strong>Costo:</strong> ${servicioInfo.costo}</p>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Select
                    value={horaSeleccionada}
                    onChange={(e) => setHoraSeleccionada(e.target.value)}
                  >
                    <option value="">Selecciona una hora</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Col>
            <Col md={6} className="p-3 rounded">
              <h5 className="">Disponibilidad próximos 3 días</h5>
              <br />
              <ul>
                {disponibilidad.map((item, index) => (
                  <li key={index}>
                    <strong>{item.dia}:</strong> {item.horas.join(", ")}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAgendar}>
            Agendar Cita
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .custom-modal .modal-content {
          background: rgba(35, 35, 60, 0.92);
          color: white;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }
        .modal-header-custom,
        .modal-footer-custom {
          background: rgba(30, 30, 50, 0.85);
          border: none;
          text-align: center;
        }
        .modal-body-custom {
          background: rgba(40, 40, 70, 0.85);
        }
        .form-label {
          color: #ddd;
        }
        .servicio-info {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ccc;
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </>
  );
}