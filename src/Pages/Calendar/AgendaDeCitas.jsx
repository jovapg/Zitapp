import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AgendadeCitas() {
  // Estado para las citas
  const [appointments, setAppointments] = useState([]);
  // Estado para filtrar por estado
  const [statusFilter, setStatusFilter] = useState('all');
  // Estado para la fecha actual
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para mostrar el modal de detalles
  const [showModal, setShowModal] = useState(false);
  // Estado para la cita seleccionada
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Estado para loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado para errores
  const [error, setError] = useState(null);

  // Función para formatear la fecha del array a string
  const formatDateFromArray = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [year, month, day] = dateArray;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Función para formatear la hora del array a string
  const formatTimeFromArray = (timeArray) => {
    if (!Array.isArray(timeArray) || timeArray.length < 2) return '';
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  };

  // Función para transformar los datos de la API al formato esperado por el componente
  const transformAppointmentData = (apiData) => {
    return apiData.map(appointment => ({
      id_cliente: appointment.client.id,
      id_negocio: appointment.business.id,
      fecha: formatDateFromArray(appointment.fecha),
      hora: formatTimeFromArray(appointment.hora),
      estado: appointment.estado.toLowerCase(),
      nombre_negocio: appointment.business.nombre,
      // Datos adicionales que podrían ser útiles
      client_name: appointment.client.nombre,
      client_email: appointment.client.email,
      business_description: appointment.business.descripcion,
      business_address: appointment.business.direccion,
      business_image: appointment.business.imagenUrl,
      appointment_id: appointment.id
    }));
  };

  // Cargar citas desde la API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8081/api/Appointments/user/7');
        const transformedData = transformAppointmentData(response.data);
        setAppointments(transformedData);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error al cargar las citas. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Funciones para cambiar el mes
  const prevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long' });
  };

  const getYear = (date) => {
    return date.getFullYear();
  };

  // Filtrar citas según el estado seleccionado
  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(app => app.estado === statusFilter);

  // Mostrar detalles de una cita
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Función para obtener el color según el estado de la cita
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Función para obtener el texto del estado en español
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  // Modal para mostrar detalles de la cita
  const renderAppointmentModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <h5 className="modal-title">Detalles de la Cita</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <strong>Negocio:</strong> {selectedAppointment.nombre_negocio}
              </div>
              {selectedAppointment.business_description && (
                <div className="mb-2">
                  <strong>Descripción:</strong> {selectedAppointment.business_description}
                </div>
              )}
              {selectedAppointment.business_address && (
                <div className="mb-2">
                  <strong>Dirección:</strong> {selectedAppointment.business_address}
                </div>
              )}
              <div className="mb-2">
                <strong>Fecha:</strong> {selectedAppointment.fecha}
              </div>
              <div className="mb-2">
                <strong>Hora:</strong> {selectedAppointment.hora.substring(0, 5)}
              </div>
              <div className="mb-2">
                <strong>Cliente:</strong> {selectedAppointment.client_name}
              </div>
              <div className="mb-2">
                <strong>Estado:</strong>
                <span className={`badge ms-2 ${getStatusColor(selectedAppointment.estado)}`}>
                  {getStatusText(selectedAppointment.estado)}
                </span>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <button type="button" className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cerrar</button>
              {selectedAppointment.estado !== 'cancelada' && (
                <button type="button" className="btn btn-danger">Cancelar Cita</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      {/* Barra de controles */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button className="btn btn-outline-light" onClick={prevMonth}>←</button>
            <button className="btn btn-outline-light" onClick={goToToday}>Hoy</button>
            <button className="btn btn-outline-light" onClick={nextMonth}>→</button>
          </div>
          <h2 className="d-inline-block ms-3 text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            {getMonthName(currentDate)} {getYear(currentDate)}
          </h2>
        </div>
        <div className="col-md-6 text-md-end">
          <select
            className="form-select d-inline-block w-auto bg-transparent text-white border-light"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <option value="all" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Todos los estados</option>
            <option value="confirmada" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Confirmadas</option>
            <option value="pendiente" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Pendientes</option>
            <option value="cancelada" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Canceladas</option>
          </select>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="appointments-list mt-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)' }}>
        <h3 className="text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>Mis Citas</h3>
        
        {/* Loading state */}
        {isLoading && (
          <div className="text-center text-white">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando citas...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* No appointments */}
        {!isLoading && !error && filteredAppointments.length === 0 && (
          <div className="alert alert-info">No hay citas para mostrar.</div>
        )}

        {/* Appointments list */}
        {!isLoading && !error && filteredAppointments.length > 0 && (
          <div className="list-group">
            {filteredAppointments.map((app, idx) => (
              <div
                key={`list-app-${app.appointment_id || idx}`}
                className="list-group-item list-group-item-action"
                onClick={() => showAppointmentDetails(app)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'rgba(16, 10, 46, 0.5)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{app.nombre_negocio}</h5>
                  <small>{app.fecha} - {app.hora.substring(0, 5)}</small>
                </div>
                <p className="mb-1 small">Cliente: {app.client_name}</p>
                <span className={`badge ${getStatusColor(app.estado)}`}>
                  {getStatusText(app.estado)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {renderAppointmentModal()}
    </div>
  );
}