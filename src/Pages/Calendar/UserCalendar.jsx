import { useState, useEffect } from 'react';
import axios from 'axios';
import fondoAzuli from '../../assets/img/fondo_azul_editado.png';

export default function UserCalendar() {
  // Aplicar la imagen de fondo al body cuando se monte el componente
  useEffect(() => {
    const originalBodyStyle = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundRepeat: document.body.style.backgroundRepeat,
      backgroundColor: document.body.style.backgroundColor,
      margin: document.body.style.margin
    };
    
    document.body.style.backgroundImage = `url(${fondoAzuli})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = '#000'; // Fondo oscuro si la imagen no cubre
    document.body.style.margin = '0';
    
    return () => {
      document.body.style.backgroundImage = originalBodyStyle.backgroundImage;
      document.body.style.backgroundSize = originalBodyStyle.backgroundSize;
      document.body.style.backgroundPosition = originalBodyStyle.backgroundPosition;
      document.body.style.backgroundRepeat = originalBodyStyle.backgroundRepeat;
      document.body.style.backgroundColor = originalBodyStyle.backgroundColor;
      document.body.style.margin = originalBodyStyle.margin;
    };
  }, []);
  
  // Estado para las citas
  const [appointments, setAppointments] = useState([]);
  // Estado para filtrar por estado de la cita
  const [statusFilter, setStatusFilter] = useState('all');
  // Estado para la fecha actual que muestra el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para mostrar el modal de detalles de cita
  const [showModal, setShowModal] = useState(false);
  // Estado para la cita seleccionada cuyo detalle se mostrará en el modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Estado para indicar si está cargando la información
  const [isLoading, setIsLoading] = useState(true); 
  // Estado para manejar errores en la carga
  const [error, setError] = useState(null);
  // Estado para el ID del usuario logueado
  const [userId, setUserId] = useState(null);

  // Función para transformar los datos de la API en el formato esperado por el componente
  const transformAppointmentData = (apiData) => {
    if (!Array.isArray(apiData)) {
      console.warn("API data is not an array:", apiData);
      return []; 
    }

    return apiData.map(appointment => {
      const fechaArray = appointment.fecha || [];
      const horaArray = appointment.hora || [];

      const [year, month, day] = fechaArray;
      const fechaString = (year && month && day) ? `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
      
      const [hour, minute] = horaArray;
      const horaString = (hour && minute) ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00` : '';
      
      const client = appointment.client || {};
      const business = appointment.business || {};
      const service = appointment.service || {};

      const estado = appointment.estado ? appointment.estado.toLowerCase() : 'desconocido';

      return {
        id_cita: appointment.id,
        service_id: service.id || null,
        service_name: service.nombre || '',
        service_description: service.descripcion || '',
        service_price: service.precio || 0,
        service_duration: service.duracion || 0,
        fecha: fechaString,
        hora: horaString,
        estado: estado,
        client_name: client.nombre || 'N/A',
        client_email: client.email || 'N/A',
        client_phone: client.telefono || 'N/A',
        business_id: business.id || null,
        business_name: business.nombre || 'N/A',
        business_categoria: business.categoria || '',
        business_descripcion: business.descripcion || '',
        business_direccion: business.direccion || '',
        business_services: business.services || [],
        // Incluir business_telefono si tu API lo provee en el objeto 'business'
        // business_telefono: business.telefono || '' // Añadir si existe en la API
      };
    });
  };
  
  // --- PRIMER useEffect: Cargar el ID del usuario desde localStorage ---
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.id) {
        setUserId(userData.id);
      } else {
        setError('No se pudo obtener el ID de usuario desde localStorage. Por favor, inicia sesión.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error al parsear datos de usuario de localStorage:', err);
      setError('Error al leer la información de sesión. Por favor, intente de nuevo.');
      setIsLoading(false);
    }
  }, []);

  // Función para cargar las citas desde la API (depende de userId)
  const loadAppointments = async () => {
    if (!userId) {
      setIsLoading(false);
      return; 
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:8081/api/appointments/clients/${userId}`);
      
      const transformedData = transformAppointmentData(response.data);
      setAppointments(transformedData);
      
    } catch (err) {
      console.error('Error al cargar las citas:', err);
      if (err.response && err.response.status === 404) {
        setError('No se encontraron citas para este usuario.');
      } else {
        setError('Error al cargar las citas. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- SEGUNDO useEffect: Cargar citas cuando el userId o currentDate cambien ---
  useEffect(() => {
    loadAppointments();
  }, [userId, currentDate]); // Depende de userId y currentDate para recargar si cambian

  // Función para obtener el nombre del mes en español
  const getMonthName = (date) => {
    return date.toLocaleString('es-ES', { month: 'long' });
  };
  // Función para obtener el año
  const getYear = (date) => {
    return date.getFullYear();
  };

  // Navegar al mes anterior
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navegar al mes siguiente
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navegar al mes actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Función para generar los días del mes actual y asociar citas a cada día
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const startDay = firstDay.getDay(); 
    
    const days = [];
    
    // Añadir días vacíos para completar la primera semana
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, appointments: [] }); 
    }
    
    // Añadir los días del mes con las citas correspondientes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      const dayAppointments = appointments.filter(app => app.fecha === dateString); 
      
      days.push({
        day,
        date: dateString,
        appointments: dayAppointments 
      });
    }
    
    return days;
  };

  // Filtrar las citas DE LOS DÍAS según el filtro de estado seleccionado
  const filterDayAppointments = (dayAppointments) => {
    if (statusFilter === 'all') {
      return dayAppointments;
    }
    return dayAppointments.filter(app => app.estado === statusFilter);
  };

  // Mostrar modal con detalles de la cita seleccionada
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Obtener clase CSS para el color según el estado de la cita
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) { 
      case 'confirmada':
      case 'confirmado': 
        return 'bg-success';
      case 'pendiente': 
        return 'bg-warning text-dark'; 
      case 'cancelada':
      case 'cancelado': 
        return 'bg-danger';
      case 'finalizada': 
        return 'bg-info';
      default: 
        return 'bg-secondary';
    }
  };

  // Traducir el estado para mostrarlo en la UI
  const translateStatus = (status) => {
    switch(status.toLowerCase()) { 
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      case 'finalizada': return 'Finalizada';
      default: return status;
    }
  };

  // Renderizar la vista principal del calendario (vista de mes)
  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate); 
    
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <>
        {/* Encabezado de los días de la semana (usando CSS Grid para alinear) */}
        <div className="calendar-weekdays-header">
          {weekdays.map(dayName => (
            <div key={dayName} className="weekday-header-item">{dayName}</div>
          ))}
        </div>
        
        {/* Cuadrícula de días del calendario (usando CSS Grid) */}
        <div className="calendar-grid">
          {days.map((dayData, idx) => { 
              const today = new Date();
              const isToday = dayData.day &&
                              today.getFullYear() === currentDate.getFullYear() &&
                              today.getMonth() === currentDate.getMonth() &&
                              dayData.day === today.getDate();

              const appointmentsForDay = filterDayAppointments(dayData.appointments);

              return (
                <div
                  key={`day-${dayData.day || 'empty'}-${idx}`}
                  className={`calendar-day ${isToday ? 'current-day-highlight' : ''} ${dayData.day ? '' : 'empty-day'}`}
                >
                  <div className="day-number fw-bold text-white text-end">{dayData.day || ''}</div>
                  <div className="day-appointments px-1">
                    {appointmentsForDay.slice(0, 3).map(app => ( 
                      <div 
                        key={`app-${app.id_cita}`}
                        className={`appointment-item text-truncate px-1 rounded my-1 text-white small ${getStatusColor(app.estado)}`}
                        title={`${app.business_name} - ${translateStatus(app.estado)} - ${app.service_name}`}
                        onClick={(e) => { e.stopPropagation(); showAppointmentDetails(app); }} 
                        style={{cursor: 'pointer'}}
                      >
                        {app.hora.substring(0, 5)} - {app.business_name}
                        {app.service_name && (
                          <span className="ms-1 text-muted">
                            ({app.service_name})
                          </span>
                        )}
                      </div>
                    ))}
                    {appointmentsForDay.length > 3 && (
                      <div 
                        className="text-muted small more-appointments"
                        onClick={(e) => { e.stopPropagation(); alert(`Ver todas las ${appointmentsForDay.length} citas de este día.`); }}
                        style={{cursor: 'pointer'}}
                      >
                        +{appointmentsForDay.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  };

  // Modal para mostrar detalles de la cita (se mantiene igual)
  const renderAppointmentModal = () => {
    if (!selectedAppointment) return null;
    
    return (
      <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
        <div className="modal-dialog">
          <div className="modal-content" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
            <div className="modal-header" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
              <h5 className="modal-title">Detalles de la Cita</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {/* Información del Negocio en el Modal */}
              <div className="mb-3">
                <h6 className="text-info">Información del Negocio</h6>
                <div className="mb-2">
                  <strong>Nombre:</strong> {selectedAppointment.business_name || 'N/A'}
                </div>
                {selectedAppointment.business_categoria && (
                  <div className="mb-2">
                    <strong>Categoría:</strong> {selectedAppointment.business_categoria}
                  </div>
                )}
                {selectedAppointment.business_direccion && (
                  <div className="mb-2">
                    <strong>Dirección:</strong> {selectedAppointment.business_direccion}
                  </div>
                )}
                {selectedAppointment.business_descripcion && (
                  <div className="mb-2">
                    <strong>Descripción:</strong> {selectedAppointment.business_descripcion}
                  </div>
                )}
                {selectedAppointment.business_telefono && ( 
                  <div className="mb-2">
                    <strong>Teléfono del Negocio:</strong> {selectedAppointment.business_telefono}
                  </div>
                )}
              </div>

              {/* Información de la Cita en el Modal */}
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
                    {translateStatus(selectedAppointment.estado)}
                  </span>
                </div>
              </div>

              {/* Servicio Asociado a la Cita en el Modal */}
              {selectedAppointment.service_id && ( 
                <div className="mb-3">
                  <h6 className="text-info">Servicio de la Cita</h6>
                  <div className="mb-2 p-2 border rounded" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <div><strong>{selectedAppointment.service_name}</strong> - ${selectedAppointment.service_price}</div>
                      {selectedAppointment.service_description && (
                        <div className="small text-muted">{selectedAppointment.service_description}</div>
                      )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{borderTop: '1px solid rgba(255, 255, 255, 0.2)'}}>
              <button type="button" className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Estilo para el contenedor principal
  const containerStyle = {
    backgroundColor: 'rgba(18, 27, 70, 0.7)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    marginTop: '2rem',
    marginBottom: '2rem'
  };

  // Mostrar estado de carga, error o el calendario
  if (isLoading) { 
    return (
      <div className="container" style={containerStyle}>
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando citas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={containerStyle}>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={loadAppointments}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4 text-white" style={containerStyle}>
        <h2 className="mb-3" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
          Mi Calendario de Citas
        </h2>

        {/* Controles de navegación del mes */}
        <div className="d-flex align-items-center mb-3 gap-3">
          <button className="btn btn-outline-light" onClick={prevMonth}>←</button>
          <button className="btn btn-outline-light" onClick={goToToday}>Hoy</button>
          <button className="btn btn-outline-light" onClick={nextMonth}>→</button>
          <h4 className="mb-0 ms-auto me-auto text-white" style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}>
            {getMonthName(currentDate).toUpperCase()} {getYear(currentDate)}
          </h4>
          {/* Botón de actualizar al lado del filtro de estado */}
          <button className="btn btn-outline-light ms-auto" onClick={loadAppointments}>Actualizar</button>
        </div>

        {/* Filtro de estado */}
        <div className="mb-3">
          <label htmlFor="statusFilter" className="form-label text-white">Filtrar por estado:</label>
          <select 
            id="statusFilter"
            className="form-select d-inline-block w-auto bg-transparent text-white border-light"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          >
            <option value="all" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Todos los estados</option>
            <option value="confirmado" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Confirmadas</option>
            <option value="pendiente" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Pendientes</option>
            <option value="cancelado" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Canceladas</option>
            <option value="finalizado" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Finalizadas</option>
          </select>
        </div>
        
        {/* Mostrar mensaje si no hay citas para el mes o filtro actual */}
        {appointments.length === 0 && !isLoading && !error && (
          <div className="alert alert-info">
            No tienes citas agendadas para este mes o con el filtro seleccionado.
          </div>
        )}
        
        {/* Calendario */}
        {/* Siempre renderizamos el calendario para que la estructura y el espacio se mantengan */}
        <div className="calendar-container mb-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)'}}>
          {renderCalendar()}
        </div>
        
        {/* Modal de detalles */}
        {renderAppointmentModal()}
        
      </div>
      {/* Bloque de estilos CSS */}
      <style>{`
        /* Encabezado de los días de la semana (usando CSS Grid para alinear) */
        .calendar-weekdays-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr); /* 7 columnas de igual ancho */
            gap: 8px; /* Espacio entre los días de la semana */
            padding-bottom: 8px;
            font-weight: bold;
            color: white;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .calendar-weekdays-header .weekday-header-item {
            /* No necesita flex:1 aquí porque ya está en Grid */
        }

        /* Cuadrícula principal del calendario usando CSS Grid */
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            /* Esto es clave: Cada fila tendrá una altura fija de 120px. */
            /* Si una fila excede el contenido, el overflow de las celdas individuales lo manejará. */
            grid-auto-rows: 120px; /* CAMBIO CRÍTICO: Altura fija para cada fila */
            gap: 8px;
        }
        
        /* Estilo para cada día del calendario */
        .calendar-day {
          /* Eliminamos 'height' o 'min-height' aquí si ya definimos grid-auto-rows */
          /* Su altura ahora será dictada por grid-auto-rows */
          cursor: default; 
          user-select: none;
          background-color: rgba(0, 0, 0, 0.3); 
          border: 1px solid rgba(255, 255, 255, 0.2) !important; 
          padding: 5px; 
          color: white; 
          display: flex;
          flex-direction: column;
          border-radius: 5px; 
          transition: background-color 0.2s ease;
          /* Asegura que el contenido no se salga de los límites de la celda */
          overflow: hidden; /* Esto es importante para cortar cualquier cosa que se salga */
        }
        .calendar-day:hover {
            background-color: rgba(0, 0, 0, 0.5) !important; 
        }
        /* Estilo para el día actual */
        .calendar-day.current-day-highlight { 
            background-color: #0d6efd !important; 
            border-color: #0d6efd !important;
            box-shadow: 0 0 10px rgba(13, 110, 253, 0.5); 
        }
        /* Estilo para días vacíos (del mes anterior/siguiente) */
        .calendar-day.empty-day { 
            background-color: rgba(0, 0, 0, 0.1);
            border-color: rgba(255, 255, 255, 0.05) !important;
            cursor: default;
        }
        .calendar-day.empty-day:hover {
            background-color: rgba(0, 0, 0, 0.1); 
        }

        .calendar-day .day-number {
          font-weight: bold;
          text-align: right;
          padding: 0 5px;
          color: white; 
          /* Asegura que el número del día ocupe solo el espacio necesario */
          flex-shrink: 0; 
        }
        .day-appointments {
          flex-grow: 1; /* Permite que este elemento crezca para ocupar el espacio restante */
          overflow-y: auto; /* ¡Crucial para el scroll! */
          /* Calculamos un max-height que deje espacio para el número del día y el "más..." */
          /* Si la celda es 120px de alto, y el número del día es ~20px, el resto es para citas. */
          max-height: calc(100% - 25px); /* Ajusta este valor si el número del día ocupa más o menos */
          padding-bottom: 5px; /* Pequeño padding para el scrollbar */
        }
        /* Scrollbar personalizado para citas si aplica */
        .day-appointments::-webkit-scrollbar {
            width: 5px;
        }
        .day-appointments::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
        }
        .day-appointments::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.2);
        }

        .appointment-item {
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 4px 6px;
          margin-bottom: 4px; /* Espacio entre citas */
          border-radius: 3px;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s ease;
          line-height: 1.2; /* Ajusta si el texto se ve muy apretado */
        }
        .appointment-item:last-child {
            margin-bottom: 0; /* Elimina el margen inferior de la última cita para que no empuje */
        }
        .appointment-item:hover {
            opacity: 0.9; 
        }
        /* Colores de estado */
        .bg-success { background-color: #198754 !important; } 
        .bg-warning { background-color: #ffc107 !important; } 
        .bg-danger { background-color: #dc3545 !important; } 
        .bg-info { background-color: #0dcaf0 !important; } 
        .bg-secondary { background-color: #6c757d !important; } 
        .text-dark { color: #212529 !important; } 

        /* Estilos específicos para el modal de detalles */
        .modal-content {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .modal-header, .modal-footer {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .btn-close-white {
          filter: invert(1); 
        }
        /* Estilo para el texto "+X más" */
        .more-appointments {
            text-align: center;
            margin-top: 5px;
            font-style: italic;
            background-color: rgba(255, 255, 255, 0.1); /* Un fondo sutil */
            padding: 2px 5px;
            border-radius: 3px;
        }
      `}</style>
    </>
  );
}