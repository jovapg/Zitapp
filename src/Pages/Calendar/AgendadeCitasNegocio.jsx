import React, { useState, useEffect } from 'react';

export default function AgendadeCitasNegocio() {
  // Estado para las citas
  const [appointments, setAppointments] = useState([]);
  // Estado para filtrar por estado
  const [statusFilter, setStatusFilter] = useState('all');
  // Estado para la fecha actual (manteniendo la funcionalidad del calendario si aplica)
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para mostrar el modal de detalles
  const [showModal, setShowModal] = useState(false);
  // Estado para la cita seleccionada
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Estado para loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado para errores
  const [error, setError] = useState(null);
  // Estado para el ID del negocio obtenido de localStorage
  const [businessId, setBusinessId] = useState(null);
  // Estado para loading de botones individuales
  const [buttonLoading, setButtonLoading] = useState({});

  // Función para formatear la fecha del array a string (ej. [2025, 6, 6] -> "2025-06-06")
  const formatDateFromArray = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [year, month, day] = dateArray;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Función para formatear la hora del array a string (ej. [9, 30] -> "09:30:00")
  const formatTimeFromArray = (timeArray) => {
    if (!Array.isArray(timeArray) || timeArray.length < 2) return '';
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  };

  // Función para transformar los datos de la API al formato esperado por el componente
  const transformAppointmentData = (apiData) => {
    if (!Array.isArray(apiData)) {
      console.warn("API data is not an array:", apiData);
      return []; 
    }

    return apiData.map(appointment => {
      const client = appointment.client || {}; 
      const business = appointment.business || {};

      return {
        id_cliente: client.id,
        id_negocio: business.id,
        fecha: formatDateFromArray(appointment.fecha),
        hora: formatTimeFromArray(appointment.hora),
        estado: appointment.estado ? appointment.estado.toLowerCase() : 'pendiente',
        nombre_negocio: business.nombre,
        client_name: client.nombre,
        client_email: client.email,
        client_phone: client.telefono,
        business_description: business.descripcion || '',
        business_address: business.direccion || '',
        business_image: business.imagenUrl || '',
        business_services: business.services || [],
        appointment_id: appointment.id
      };
    });
  };

  // --- PRIMER useEffect: Cargar el ID del negocio desde localStorage ---
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.tipo === 'NEGOCIO' && user.businessId) {
          setBusinessId(user.businessId);
        } else {
          setError('No eres un usuario de negocio o no se encontró el ID del negocio asociado.');
          setIsLoading(false);
        }
      } else {
        setError('No hay sesión iniciada. Por favor, inicia sesión.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error al parsear datos de usuario de localStorage:', err);
      setError('Error al leer la información de sesión. Por favor, intenta de nuevo.');
      setIsLoading(false);
    }
  }, []);

  // --- SEGUNDO useEffect: Cargar citas cuando el businessId esté disponible ---
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!businessId) {
        setIsLoading(false);
        return; 
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8081/api/appointments/business/${businessId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || 'Error desconocido'}`);
        }
        
        const data = await response.json();
        const transformedData = transformAppointmentData(data);
        setAppointments(transformedData);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        if (err.message.includes('404')) {
          setError('No se encontraron citas para este negocio. Es posible que aún no tengas citas o la ruta de la API sea incorrecta.');
        } else {
          setError('Error al cargar las citas. Por favor, verifica la conexión o inténtalo de nuevo más tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [businessId]);

  // Funciones para cambiar el mes del calendario
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
      case 'finalizada': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  // Función para obtener el texto del estado en español
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      case 'finalizada': return 'Finalizada';
      default: return status;
    }
  };

  // Función genérica para hacer llamadas a la API de cambio de estado
  const updateAppointmentStatus = async (appointmentId, action) => {
    const loadingKey = `${appointmentId}-${action}`;
    
    try {
      setButtonLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      const response = await fetch(`http://localhost:8081/api/appointments/${appointmentId}/${action}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al ${action} la cita`);
      }
      
      const updatedAppointment = await response.json();
      
      // Actualizar el estado local con la cita actualizada
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app.appointment_id === appointmentId 
            ? { ...app, estado: updatedAppointment.estado.toLowerCase() }
            : app
        )
      );
      
      // Actualizar la cita seleccionada si es la misma
      if (selectedAppointment && selectedAppointment.appointment_id === appointmentId) {
        setSelectedAppointment(prev => ({
          ...prev,
          estado: updatedAppointment.estado.toLowerCase()
        }));
      }
      
      // Mostrar mensaje de éxito
      alert(`Cita ${action}da exitosamente`);
      
    } catch (err) {
      console.error(`Error al ${action} la cita:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setButtonLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Función para determinar qué botones mostrar según el estado
  const getAvailableActions = (appointment) => {
    const estado = appointment.estado;
    const actions = [];

    switch (estado) {
      case 'pendiente':
        actions.push(
          {
            action: 'confirmar',
            label: 'Confirmar',
            className: 'btn-success',
            icon: '✓'
          },
          {
            action: 'cancelar', 
            label: 'Cancelar',
            className: 'btn-danger',
            icon: '✕'
          },
          {
            action: 'finalizar',
            label: 'Finalizar',
            className: 'btn-info',
            icon: '✓✓'
          }
        );
        break;
        
      case 'confirmada':
        actions.push(
          {
            action: 'finalizar',
            label: 'Finalizar',
            className: 'btn-info',
            icon: '✓✓'
          }
        );
        break;
        
      case 'cancelada':
      case 'finalizada':
        // No hay acciones disponibles para estos estados
        break;
    }

    return actions;
  };

  // Modal para mostrar detalles de la cita
  const renderAppointmentModal = () => {
    if (!selectedAppointment) return null;

    const availableActions = getAvailableActions(selectedAppointment);

    return (
      <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <h5 className="modal-title">Detalles de la Cita</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <h6 className="text-info">Información del Cliente</h6>
                <div className="mb-2">
                  <strong>Nombre:</strong> {selectedAppointment.client_name}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {selectedAppointment.client_email}
                </div>
                {selectedAppointment.client_phone && (
                  <div className="mb-2">
                    <strong>Teléfono:</strong> {selectedAppointment.client_phone}
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <h6 className="text-info">Información de la Cita</h6>
                <div className="mb-2">
                  <strong>Fecha:</strong> {selectedAppointment.fecha}
                </div>
                <div className="mb-2">
                  <strong>Hora:</strong> {selectedAppointment.hora.substring(0, 5)}
                </div>
                <div className="mb-2">
                  <strong>Estado:</strong>
                  <span className={`badge ms-2 ${getStatusColor(selectedAppointment.estado)}`}>
                    {getStatusText(selectedAppointment.estado)}
                  </span>
                </div>
              </div>

              {selectedAppointment.business_services.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-info">Servicios de la Cita</h6>
                  {selectedAppointment.business_services.map((service, idx) => (
                    <div key={service.id || idx} className="mb-2 p-2 border rounded" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <div><strong>{service.nombre}</strong></div>
                      <div className="small text-muted">{service.descripcion}</div>
                      <div className="text-success">${service.precio}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <button type="button" className="btn btn-outline-light" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
              
              {availableActions.map((actionObj) => {
                const loadingKey = `${selectedAppointment.appointment_id}-${actionObj.action}`;
                const isLoading = buttonLoading[loadingKey];
                
                return (
                  <button 
                    key={actionObj.action}
                    type="button" 
                    className={`btn ${actionObj.className}`}
                    disabled={isLoading}
                    onClick={() => updateAppointmentStatus(selectedAppointment.appointment_id, actionObj.action)}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <span className="me-1">{actionObj.icon}</span>
                        {actionObj.label}
                      </>
                    )}
                  </button>
                );
              })}
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
            <option value="pendiente" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Pendientes</option>
            <option value="confirmada" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Confirmadas</option>
            <option value="finalizada" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Finalizadas</option>
            <option value="cancelada" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>Canceladas</option>
          </select>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="appointments-list mt-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)' }}>
        <h3 className="text-white" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>Citas del Negocio</h3>
        
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
            {filteredAppointments.map((app, idx) => {
              const availableActions = getAvailableActions(app);
              
              return (
                <div
                  key={`list-app-${app.appointment_id || idx}`}
                  className="list-group-item list-group-item-action"
                  style={{
                    backgroundColor: 'rgba(16, 10, 46, 0.5)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="flex-grow-1" onClick={() => showAppointmentDetails(app)} style={{ cursor: 'pointer' }}>
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{app.client_name}</h5>
                        <small>{app.fecha} - {app.hora.substring(0, 5)}</small>
                      </div>
                      <p className="mb-1 small">Email: {app.client_email}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${getStatusColor(app.estado)}`}>
                          {getStatusText(app.estado)}
                        </span>
                        {app.business_services.length > 0 && (
                          <small className="text-muted">
                            {app.business_services.length} servicio{app.business_services.length > 1 ? 's' : ''}
                          </small>
                        )}
                      </div>
                    </div>
                    
                    {/* Botones de acción */}
                    {availableActions.length > 0 && (
                      <div className="ms-3 d-flex gap-2 flex-wrap">
                        {availableActions.map((actionObj) => {
                          const loadingKey = `${app.appointment_id}-${actionObj.action}`;
                          const isLoading = buttonLoading[loadingKey];
                          
                          return (
                            <button
                              key={actionObj.action}
                              className={`btn btn-sm ${actionObj.className}`}
                              disabled={isLoading}
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar que se abra el modal
                                updateAppointmentStatus(app.appointment_id, actionObj.action);
                              }}
                              title={`${actionObj.label} cita`}
                            >
                              {isLoading ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <>
                                  <span className="me-1">{actionObj.icon}</span>
                                  {actionObj.label}
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {renderAppointmentModal()}
    </div>
  );
}