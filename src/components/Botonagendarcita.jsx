import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup, Row, Col } from 'react-bootstrap';

// Recibe 'business' (objeto completo del negocio) en lugar de solo 'businessId'
const Botonagendarcita = ({ show, handleClose, business }) => {
  // Estados para almacenar los datos del modal
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorServices, setErrorServices] = useState(null);

  // Estados para la disponibilidad de horas
  const [availableHours, setAvailableHours] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [errorAvailability, setErrorAvailability] = useState(null);

  // Obtener la información del usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Corregido: leer de 'user'
  const isUserLoggedIn = !!user.id;

  // Función auxiliar para obtener la fecha actual en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayDate = getTodayDate();

  // Efecto para cargar los servicios del negocio
  useEffect(() => {
    if (show && business && business.id) {
      setLoadingServices(true);
      setErrorServices(null);

      const serviceApiUrl = `http://localhost:8081/api/services/businesses/${business.id}/services`;

      fetch(serviceApiUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          setServices(data);
          setLoadingServices(false);
        })
        .catch(err => {
          console.error("Error al obtener servicios:", err);
          setErrorServices("No se pudieron cargar los servicios. " + err.message);
          setLoadingServices(false);
        });
    } else if (!show) {
      setSelectedServices([]);
      setFecha('');
      setHora('');
      setServices([]);
      setLoadingServices(false);
      setErrorServices(null);
      setAvailableHours([]);
      setLoadingAvailability(false);
      setErrorAvailability(null);
    }
  }, [show, business]);

  // Efecto para cargar la disponibilidad de horas
  useEffect(() => {
    if (show && business && business.id && fecha) {
      setLoadingAvailability(true);
      setErrorAvailability(null);
      setAvailableHours([]);

      const availabilityApiUrl = `http://localhost:8081/api/availability/businesses/${business.id}/available-hours?date=${fecha}`;

      fetch(availabilityApiUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error al verificar disponibilidad: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          setAvailableHours(data);
          setLoadingAvailability(false);
          if (hora && !data.includes(hora)) {
            setHora('');
          }
        })
        .catch(err => {
          console.error("Error al obtener disponibilidad:", err);
          setErrorAvailability("No se pudo obtener la disponibilidad para esta fecha. " + err.message);
          setLoadingAvailability(false);
          setAvailableHours([]);
          setHora('');
        });
    } else {
      setAvailableHours([]);
      setLoadingAvailability(false);
      setErrorAvailability(null);
      setHora('');
    }
  }, [fecha, business, show]);

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    if (!isUserLoggedIn) {
      alert('Debes iniciar sesión para agendar una cita.');
      return;
    }
    if (selectedServices.length === 0 || !fecha || !hora) {
      alert('Por favor, selecciona al menos un servicio, la fecha y la hora.');
      return;
    }
    if (!availableHours.includes(hora)) {
      alert('La hora seleccionada no está disponible. Por favor, elige otra de las opciones.');
      return;
    }

    try {
      await Promise.all(selectedServices.map(async (service) => {
        const cita = {
          fecha,
          hora,
          // CAMBIO AQUÍ: Cambiar 'idServicio' a 'serviceId' para que coincida con el DTO del backend
          serviceId: service.id,
          clientId: user.id, // CAMBIO AQUÍ: Cambiar 'idCliente' a 'clientId' para que coincida con el DTO
          businessId: business.id // CAMBIO AQUÍ: Cambiar 'idNegocio' a 'businessId' para que coincida con el DTO
        };

        const appointmentApiUrl = 'http://localhost:8081/api/appointments';

        const response = await fetch(appointmentApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cita),
        });

        if (!response.ok) {
          let errorMessage = `Error desconocido al agendar cita para ${service.nombre}.`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || response.statusText;
          } catch (jsonError) {
            errorMessage = response.statusText;
          }
          throw new Error(errorMessage);
        }
      }));

      alert('Cita(s) agendada(s) con éxito.');
      handleClose();
    } catch (err) {
      console.error('Error al agendar cita:', err);
      alert(`Error al agendar la cita: ${err.message || 'Por favor, inténtalo de nuevo.'}`);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = business.telefono || '573001234567';
    const message = encodeURIComponent(`Hola, tengo una duda sobre la cita en ${business.nombre}.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Agendar Cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {business && (
          <div className="mb-4 text-center">
            <img
              src={business.imagenUrl || "https://via.placeholder.com/800x300?text=Imagen+Negocio"}
              alt={business.nombre}
              className="mb-2"
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h4>{business.nombre}</h4>
            <p>{business.descripcion}</p>
            <hr />
          </div>
        )}

        <Row>
          <Col md={7}>
            <h5>Selecciona Servicios</h5>
            {loadingServices ? (
              <p>Cargando servicios...</p>
            ) : errorServices ? (
              <p className="text-danger">{errorServices}</p>
            ) : services.length > 0 ? (
              <ListGroup>
                {services.map(service => (
                  <ListGroup.Item
                    key={service.id}
                    onClick={() => toggleService(service)}
                    active={selectedServices.some(s => s.id === service.id)}
                    action
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{service.nombre}</strong>
                        {service.descripcion && <div><small>{service.descripcion}</small></div>}
                        {service.duracion && <span><small>Duración: {service.duracion} min</small></span>}
                      </div>
                      <strong>${service.precio}</strong>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No hay servicios disponibles para este negocio.</p>
            )}

            <Form.Group className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setHora('');
                }}
                min={todayDate}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                as="select"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                disabled={!fecha || loadingAvailability}
              >
                <option value="">Selecciona una hora</option>
                {loadingAvailability && <option disabled>Cargando disponibilidad...</option>}
                {errorAvailability && <option disabled className="text-danger">{errorAvailability}</option>}
                {!loadingAvailability && !errorAvailability && availableHours.length === 0 && fecha &&
                  <option disabled>No hay horas disponibles para esta fecha.</option>
                }
                {availableHours.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={5} className="d-flex flex-column">
            <h5>Resumen de la Cita</h5>
            <ul className="list-group flex-grow-1 mb-3">
              {selectedServices.length > 0 ? (
                selectedServices.map((s, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    <span>{s.nombre}</span>
                    <span>${s.precio}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No hay servicios seleccionados.</li>
              )}
            </ul>
            <hr />
            <h6>Total: ${selectedServices.reduce((sum, s) => sum + s.precio, 0)}</h6>

            <div className="mt-auto d-grid gap-2">
              <Button variant="success" onClick={handleWhatsAppClick} className="d-flex align-items-center justify-content-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                ¿Dudas con tu cita?
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={!fecha || !hora || selectedServices.length === 0 || !isUserLoggedIn || !availableHours.includes(hora)}
        >
          Confirmar Cita
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Botonagendarcita;