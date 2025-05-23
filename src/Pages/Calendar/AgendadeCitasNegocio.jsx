import React, { useState, useEffect } from 'react';

export default function AgendadeCitasNegocio() {
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

  // Datos de ejemplo
  useEffect(() => {
    const sampleData = [
      {
        id_cliente: 1,
        id_negocio: 10,
        fecha: "2025-05-10",
        hora: "10:30:00",
        estado: "confirmado",
        nombre_negocio: "BBC Salon"
      },
      {
        id_cliente: 1,
        id_negocio: 12,
        fecha: "2025-05-12",
        hora: "14:00:00",
        estado: "pendiente",
        nombre_negocio: "MediClinic"
      },
      {
        id_cliente: 1,
        id_negocio: 15,
        fecha: "2025-05-14",
        hora: "09:15:00",
        estado: "cancelado",
        nombre_negocio: "Fitness Center"
      },
      {
        id_cliente: 1,
        id_negocio: 18,
        fecha: "2025-05-15",
        hora: "16:45:00",
        estado: "confirmado",
        nombre_negocio: "Dental Care"
      },
      {
        id_cliente: 1,
        id_negocio: 20,
        fecha: "2025-05-20",
        hora: "11:00:00",
        estado: "pendiente",
        nombre_negocio: "SPA Center"
      }
    ];
    setAppointments(sampleData);
  }, []);

  // Funciones para cambiar el mes (simplificadas por ahora)
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
      case 'confirmado': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelado': return 'bg-danger';
      default: return 'bg-secondary';
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
              <div className="mb-2">
                <strong>Fecha:</strong> {selectedAppointment.fecha}
              </div>
              <div className="mb-2">
                <strong>Hora:</strong> {selectedAppointment.hora}
              </div>
              <div className="mb-2">
                <strong>Estado:</strong>
                <span className={`badge ms-2 ${getStatusColor(selectedAppointment.estado)}`}>
                  {selectedAppointment.estado}
                </span>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <button type="button" className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cerrar</button>
              {selectedAppointment.estado !== 'cancelado' && (
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
            <option value="confirmado" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Confirmados</option>
            <option value="pendiente" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Pendientes</option>
            <option value="cancelado" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Cancelados</option>
          </select>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="appointments-list mt-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)' }}>
        <h3 className="text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>Mis Citas</h3>
        {filteredAppointments.length === 0 ? (
          <div className="alert alert-info">No hay citas para mostrar.</div>
        ) : (
          <div className="list-group">
            {filteredAppointments.map((app, idx) => (
              <div
                key={`list-app-${idx}`}
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
                <span className={`badge ${getStatusColor(app.estado)}`}>
                  {app.estado}
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
