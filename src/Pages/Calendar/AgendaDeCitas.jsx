import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; // Importar Modal y Button de react-bootstrap

export default function AgendadeCitas({ nuevasCitas = [] }) {
  // Estado para almacenar las citas transformadas
  const [appointments, setAppointments] = useState([]);

  // Estado para filtrar por estado (confirmada, pendiente, cancelada, etc.)
  const [statusFilter, setStatusFilter] = useState('all');

  // Estado para manejar la fecha actual (puede servir para filtros por fecha futura)
  const [currentDate, setCurrentDate] = useState(new Date()); // No usado actualmente, pero mantenido

  // Estado para controlar la visibilidad del modal de detalles
  const [showModal, setShowModal] = useState(false);

  // Estado para guardar la cita seleccionada que se muestra en el modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Estado para indicar si se está cargando la información
  const [isLoading, setIsLoading] = useState(true);

  // Estado para errores de carga
  const [error, setError] = useState(null);

  // Función para formatear la fecha desde un array [YYYY, MM, DD] a string "YYYY-MM-DD"
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [y, m, d] = dateArray;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  // Función para formatear la hora desde un array [HH, MM] a string "HH:MM"
  const formatTime = (timeArray) => {
    if (!Array.isArray(timeArray) || timeArray.length < 2) return '';
    const [h, m] = timeArray;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Función para transformar la respuesta del backend a un formato que podamos mostrar fácilmente
  const transformAppointments = (data) => {
    return data.map(appt => {
      const service = appt.service || {}; // Objeto servicio de la API
      const business = appt.business || {}; // Objeto negocio de la API

      return {
        appointment_id: appt.id,
        fecha: formatDate(appt.fecha),
        hora: formatTime(appt.hora),
        estado: appt.estado.toLowerCase(),

        // Accediendo a propiedades del servicio y negocio directamente
        servicio_nombre: service.nombre || 'N/A', // Usar 'nombre' para el servicio
        servicio_precio: service.precio || 0, // Usar 'precio' para el servicio
        servicio_descripcion: service.descripcion || '', // Usar 'descripcion' para el servicio

        nombre_negocio: business.nombre || 'N/A', // Usar 'nombre' para el negocio
        business_description: business.descripcion || '', // Usar 'descripcion' para el negocio
        business_address: business.direccion || 'N/A', // Usar 'direccion' para el negocio
        business_image: business.imagenUrl || 'https://via.placeholder.com/150x150?text=Negocio', // Asegurar URL de imagen
        business_phone: business.telefono || 'N/A', // Añadir teléfono si existe
        
        client_name: appt.client?.nombre || '', // Acceder al nombre del cliente si existe
        client_email: appt.client?.email || '', // Acceder al email del cliente si existe
      };
    });
  };

  // useEffect para cargar las citas del cliente al cargar el componente
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Obtener el usuario del localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}'); // Asegurar parseo seguro
        if (!user || !user.id) throw new Error('Usuario no autenticado');

        // Hacer la petición al backend con el ID del cliente
        const response = await axios.get(`http://localhost:8081/api/appointments/clients/${user.id}`);
        const transformed = transformAppointments(response.data);
        setAppointments(transformed); // Guardar citas transformadas
      } catch (err) {
        console.error("Error al cargar citas en AgendadeCitas:", err);
        setError('Error al cargar las citas. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchAppointments();
  }, []); // Se ejecuta solo una vez al montar

  // useEffect para agregar nuevas citas en tiempo real (si se pasan por props)
  // Nota: Este prop 'nuevasCitas' se pasa de TusCitas, pero actualmente se usa
  // para recargar fetchAppointments() en TusCitas. Puedes ajustar esta lógica
  // si realmente quieres agregar citas individuales a la lista aquí.
  useEffect(() => {
    // Si la prop 'nuevasCitas' cambia y contiene citas nuevas, podrías agregarlas.
    // Sin embargo, si 'TusCitas' ya llama a 'fetchAppointments' después de agendar,
    // este useEffect aquí podría no ser estrictamente necesario para la actualización.
    // Por simplicidad, se mantiene como estaba, pero ten en cuenta la lógica.
    if (nuevasCitas && nuevasCitas.length > 0) {
      // Para evitar duplicados o lógica compleja de merge, podrías recargar todo
      // o agregar de forma más controlada.
      // Aquí simplemente se añade la última cita como se hacía.
      const ultimaCita = nuevasCitas[nuevasCitas.length - 1];
      // Para evitar que AgendadeCitas sea el único que "vea" nuevas citas
      // y si TusCitas ya las trae por su propio fetch, esta línea podría
      // generar un duplicado temporal si no se maneja bien.
      // Una opción es recargar todo: fetchAppointments();
      // Otra es filtrar si la cita ya existe:
      setAppointments(prev => {
        if (!prev.some(appt => appt.appointment_id === ultimaCita.appointment_id)) {
            return [ultimaCita, ...prev];
        }
        return prev;
      });
    }
  }, [nuevasCitas]);

  // Función para asignar un color según el estado de la cita
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'confirmada': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelada': return 'bg-danger';
      case 'finalizada': return 'bg-primary'; // Si tienes estado finalizada
      default: return 'bg-secondary';
    }
  };

  // Función para mostrar el texto legible del estado
  const getStatusText = (estado) => {
    switch (estado) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      case 'finalizada': return 'Finalizada';
      default: return estado;
    }
  };

  // Función para mostrar el modal de detalles al seleccionar una cita
  const showAppointmentDetails = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  // Función para renderizar el modal con los detalles de la cita seleccionada
  const renderModal = () => {
    if (!selectedAppointment) return null;

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-light">Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark"> {/* Body en oscuro para buen contraste con texto claro */}
          {/* Aquí podrías añadir la imagen del negocio */}
          {selectedAppointment.business_image && (
            <div className="text-center mb-3">
              <img
                src={selectedAppointment.business_image}
                alt={selectedAppointment.nombre_negocio}
                style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}
          <p><strong>Negocio:</strong> {selectedAppointment.nombre_negocio}</p>
          <p><strong>Descripción del Negocio:</strong> {selectedAppointment.business_description || 'N/A'}</p>
          <p><strong>Dirección:</strong> {selectedAppointment.business_address}</p>
          <p><strong>Teléfono:</strong> {selectedAppointment.business_phone}</p> {/* Mostrar teléfono */}
          <hr />
          <p><strong>Servicio:</strong> {selectedAppointment.servicio_nombre}</p>
          <p><strong>Precio:</strong> ${selectedAppointment.servicio_precio}</p>
          <p><strong>Duración:</strong> {selectedAppointment.servicio_duracion} min</p>
          <hr />
          <p><strong>Fecha:</strong> {selectedAppointment.fecha}</p>
          <p><strong>Hora:</strong> {selectedAppointment.hora}</p>
          <p><strong>Estado:</strong> <span className={`badge ${getStatusColor(selectedAppointment.estado)}`}>{getStatusText(selectedAppointment.estado)}</span></p>
          <hr />
          <p className="text-muted small">Cliente: {selectedAppointment.client_name} ({selectedAppointment.client_email})</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          {selectedAppointment.estado !== 'cancelada' && selectedAppointment.estado !== 'finalizada' && (
            <Button variant="danger">Cancelar Cita</Button> // Implementar lógica de cancelación
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  // Filtrar las citas según el filtro seleccionado
  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.estado === statusFilter);

  return (
    <div className="container py-4">
      {/* Título y selector de filtro */}
      <div className="d-flex justify-content-between mb-3">
        <h2 className="text-white">Mis Citas</h2>
        <select
          className="form-select w-auto bg-dark text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="confirmada">Confirmadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="cancelada">Canceladas</option>
          <option value="finalizada">Finalizadas</option> {/* Si manejas este estado */}
        </select>
      </div>

      {/* Mostrar mensajes de carga o error */}
      {isLoading && <div className="text-white text-center"><div className="spinner-border text-light" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-2">Cargando citas...</p></div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {!isLoading && !error && filteredAppointments.length === 0 && (
        <div className="alert alert-info text-center">No hay citas disponibles con los filtros seleccionados.</div>
      )}

      {/* Lista de citas */}
      <div className="list-group">
        {filteredAppointments.map((appt) => (
          <div
            key={appt.appointment_id}
            className="list-group-item list-group-item-action border-0 mb-2 rounded"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
            onClick={() => showAppointmentDetails(appt)} // Abre el modal de detalles
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0 text-info">{appt.nombre_negocio}</h5>
              <span className={`badge ${getStatusColor(appt.estado)}`}>{getStatusText(appt.estado)}</span>
            </div>
            <p className="mb-1">{appt.servicio_nombre} (${appt.servicio_precio})</p>
            <small className="text-muted d-block">{appt.fecha} - {appt.hora}</small>
          </div>
        ))}
      </div>

      {/* Renderizar modal si está activo */}
      {renderModal()}
    </div>
  );
}