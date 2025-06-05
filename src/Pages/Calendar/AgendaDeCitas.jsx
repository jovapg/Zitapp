import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AgendadeCitas({ nuevasCitas = [] }) {
  // Estado para almacenar las citas transformadas
  const [appointments, setAppointments] = useState([]);

  // Estado para filtrar por estado (confirmada, pendiente, cancelada, etc.)
  const [statusFilter, setStatusFilter] = useState('all');

  // Estado para manejar la fecha actual (puede servir para filtros por fecha futura)
  const [currentDate, setCurrentDate] = useState(new Date());

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
    if (!Array.isArray(dateArray)) return '';
    const [y, m, d] = dateArray;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  // Función para formatear la hora desde un array [HH, MM] a string "HH:MM"
  const formatTime = (timeArray) => {
    if (!Array.isArray(timeArray)) return '';
    const [h, m] = timeArray;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Función para transformar la respuesta del backend a un formato que podamos mostrar fácilmente
  const transformAppointments = (data) => {
    return data.map(appt => ({
      appointment_id: appt.id,
      fecha: formatDate(appt.fecha),
      hora: formatTime(appt.hora),
      estado: appt.estado.toLowerCase(),
      servicio: appt.servicio?.nombre || '',
      costo: appt.servicio?.precio || null,
      nombre_negocio: appt.business?.nombre || '',
      business_description: appt.business?.descripcion || '',
      business_address: appt.business?.direccion || '',
      business_image: appt.business?.imagenUrl || '',
      client_name: appt.client?.nombre || '',
      client_email: appt.client?.email || '',
    }));
  };

  // useEffect para cargar las citas del cliente al cargar el componente
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        // Obtener el usuario del localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('Usuario no autenticado');

        // Hacer la petición al backend con el ID del cliente
        const response = await axios.get(`http://localhost:8081/api/appointments/clients/${user.id}`);
        const transformed = transformAppointments(response.data);
        setAppointments(transformed); // Guardar citas transformadas
      } catch (err) {
        console.error(err);
        setError('Error al cargar las citas. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchAppointments();
  }, []);

  // useEffect para agregar nuevas citas en tiempo real (si se pasan por props)
  useEffect(() => {
    if (nuevasCitas.length > 0) {
      const ultimaCita = nuevasCitas[nuevasCitas.length - 1];
      setAppointments(prev => [ultimaCita, ...prev]);
    }
  }, [nuevasCitas]);

  // Función para asignar un color según el estado de la cita
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'confirmada': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Función para mostrar el texto legible del estado
  const getStatusText = (estado) => {
    switch (estado) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
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
      <div className={`modal ${showModal ? 'd-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="modal-dialog">
          <div className="modal-content text-white bg-dark">
            <div className="modal-header">
              <h5 className="modal-title">Detalles de la Cita</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <p><strong>Negocio:</strong> {selectedAppointment.nombre_negocio}</p>
              <p><strong>Servicio:</strong> {selectedAppointment.servicio}</p>
              <p><strong>Precio:</strong> ${selectedAppointment.costo}</p>
              <p><strong>Dirección:</strong> {selectedAppointment.business_address}</p>
              <p><strong>Fecha:</strong> {selectedAppointment.fecha}</p>
              <p><strong>Hora:</strong> {selectedAppointment.hora}</p>
              <p><strong>Estado:</strong> <span className={`badge ${getStatusColor(selectedAppointment.estado)}`}>{getStatusText(selectedAppointment.estado)}</span></p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cerrar</button>
              {/* Si la cita no está cancelada, mostrar botón para cancelarla */}
              {selectedAppointment.estado !== 'cancelada' && (
                <button className="btn btn-danger">Cancelar Cita</button>
              )}
            </div>
          </div>
        </div>
      </div>
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
        </select>
      </div>

      {/* Mostrar mensajes de carga o error */}
      {isLoading && <div className="text-white">Cargando citas...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && filteredAppointments.length === 0 && (
        <div className="alert alert-info">No hay citas disponibles.</div>
      )}

      {/* Lista de citas */}
      <div className="list-group">
        {filteredAppointments.map((appt) => (
          <div
            key={appt.appointment_id}
            className="list-group-item list-group-item-action"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
            onClick={() => showAppointmentDetails(appt)}
          >
            <div className="d-flex justify-content-between">
              <h5>{appt.nombre_negocio}</h5>
              <small>{appt.fecha} {appt.hora}</small>
            </div>
            <p className="mb-1">{appt.servicio} - ${appt.costo}</p>
            <span className={`badge ${getStatusColor(appt.estado)}`}>{getStatusText(appt.estado)}</span>
          </div>
        ))}
      </div>

      {/* Renderizar modal si está activo */}
      {renderModal()}
    </div>
  );
}
