import { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de que Axios esté instalado: npm install axios
import fondoAzuli from '../../assets/img/fondo_azul_editado.png';

// Componente principal del calendario de negocio
export default function BusinessCalendar() {
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
    document.body.style.backgroundColor = '#000';
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
  // Estado para controlar la carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para filtrar por estado
  const [statusFilter, setStatusFilter] = useState('all');
  // Estado para la fecha actual
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para mostrar el modal de detalles
  const [showModal, setShowModal] = useState(false);
  // Estado para la cita seleccionada
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Estado para el ID del negocio obtenido de localStorage (¡Nuevo!)
  const [businessId, setBusinessId] = useState(null);

  // Función para transformar los datos de la API al formato esperado
  const transformAppointmentData = (apiData) => {
    if (!Array.isArray(apiData)) {
      console.warn("API data is not an array:", apiData);
      return []; 
    }

    return apiData.map(appointment => {
      // Manejo seguro de 'fecha' y 'hora' que pueden ser arrays o null
      const fechaArray = appointment.fecha || [];
      const horaArray = appointment.hora || [];

      // Convertir fecha del array [year, month, day] a string YYYY-MM-DD
      const [year, month, day] = fechaArray;
      const fechaString = (year && month && day) ? `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
      
      // Convertir hora del array [hour, minute] a string HH:MM:SS
      const [hour, minute] = horaArray;
      const horaString = (hour && minute) ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00` : '';
      
      // Manejo seguro de 'client' y 'business' que pueden ser nulos/undefined
      const client = appointment.client || {};
      const business = appointment.business || {};
      const service = appointment.service || {}; // También el servicio, por si acaso

      // Mapear el estado de la API al formato esperado (ej. "PENDIENTE" -> "pendiente")
      // Asegurarse de que los estados en la API y los de la app coincidan
      const estadoMapping = {
        'CONFIRMADA': 'confirmado',
        'PENDIENTE': 'pendiente',
        'CANCELADA': 'cancelado',
        'FINALIZADA': 'finalizado' // Agregando el estado 'finalizada' al mapeo
      };
      const estado = appointment.estado ? estadoMapping[appointment.estado.toUpperCase()] || appointment.estado.toLowerCase() : 'desconocido';

      return {
        id: appointment.id,
        id_cliente: client.id, // Acceso seguro
        fecha: fechaString,
        hora: horaString,
        estado: estado,
        nombre_usuario: client.nombre, // Acceso seguro
        client_email: client.email, // Acceso seguro
        client_telefono: client.telefono, // Acceso seguro
        business_id: business.id, // Acceso seguro
        business_name: business.nombre, // Acceso seguro
        business_categoria: business.categoria, // Acceso seguro
        business_descripcion: business.descripcion, // Acceso seguro
        business_direccion: business.direccion, // Acceso seguro
        // Aquí pasamos el único servicio asociado a la cita, si lo hay, como un array de un solo elemento
        // Si quieres que el modal muestre solo el servicio de esa cita, usa [service]
        services: service.id ? [service] : [] // Acceso seguro, asegura que sea un array
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
          setLoading(false);
          // Redireccionar si no es un negocio válido para esta vista
          // navigate('/acceso-denegado');
        }
      } else {
        setError('No hay sesión iniciada. Por favor, inicia sesión.');
        setLoading(false);
        // Redireccionar al login
        // navigate('/login');
      }
    } catch (err) {
      console.error('Error al parsear datos de usuario de localStorage:', err);
      setError('Error al leer la información de sesión. Por favor, intente nuevamente.');
      setLoading(false);
    }
  }, []); // Se ejecuta solo una vez al montar

  // Función para cargar las citas desde la API (depende de businessId)
  const loadAppointments = async () => {
    if (!businessId) {
      setLoading(false);
      return; // No intentar cargar si no hay businessId
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:8081/api/appointments/business/${businessId}`);
      
      const transformedData = transformAppointmentData(response.data);
      setAppointments(transformedData);
      
    } catch (err) {
      console.error('Error al cargar las citas:', err);
      if (err.response && err.response.status === 404) {
        setError('No se encontraron citas para este negocio. Es posible que aún no tengas citas.');
      } else {
        setError('Error al cargar las citas. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- SEGUNDO useEffect: Cargar datos cuando el businessId esté listo ---
  useEffect(() => {
    loadAppointments(); // Llama a la función para cargar citas
  }, [businessId, currentDate]); // Depende de businessId y currentDate (para navegar por meses)

  // Función para obtener el nombre del mes
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
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

  // Navegar a hoy
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Función para generar los días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const startDay = firstDay.getDay(); // Día de la semana del primer día (0 = Domingo)
    
    const days = [];
    
    // Añadir días del mes anterior para completar la primera semana
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, appointments: [] });
    }
    
    // Añadir días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // Formato YYYY-MM-DD
      
      // Aquí se filtran las citas para el día, pero NO por estado aún
      const dayAppointments = appointments.filter(app => app.fecha === dateString);
      
      days.push({
        day,
        date: dateString,
        appointments: dayAppointments // Contiene TODAS las citas para ese día
      });
    }
    
    return days;
  };

  // NO necesitas 'filteredAppointments' como estado global aquí.
  // El filtro se aplicará en el renderizado de cada día.

  // Mostrar detalles de una cita
  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Función para obtener el color según el estado de la cita
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmado': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelado': return 'bg-danger';
      case 'finalizado': return 'bg-info'; 
      default: return 'bg-secondary';
    }
  };

  // Función para refrescar los datos (volver a cargar citas)
  const refreshData = () => {
    loadAppointments();
  };

  // Renderizar el calendario (vista mensual)
  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate); // Obtiene todos los días con sus citas (sin filtrar por estado)
    
    return (
      <>
      <div className="calendar-month">
        <div className="row text-center fw-bold border-bottom mb-2 text-white">
          <div className="col">Dom</div>
          <div className="col">Lun</div>
          <div className="col">Mar</div>
          <div className="col">Mié</div>
          <div className="col">Jue</div>
          <div className="col">Vie</div>
          <div className="col">Sáb</div>
        </div>
        
        <div className="calendar-grid">
          {Array(Math.ceil(days.length / 7)).fill().map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row mb-3">
              {days.slice(rowIndex * 7, (rowIndex + 1) * 7).map((dayData, colIndex) => {
                // Aquí, dentro de cada día, aplicamos el filtro de estado
                const appointmentsForDay = dayData.appointments.filter(app => 
                  statusFilter === 'all' || app.estado === statusFilter
                );

                return (
                  <div key={`col-${rowIndex}-${colIndex}`} className="col p-0">
                    <div className={`calendar-day border ${dayData.day ? 'h-100' : ''}`} style={{backgroundColor: dayData.day ? 'rgba(0, 0, 0, 0.3)' : 'transparent'}}>
                      {dayData.day && (
                        <>
                          <div className="day-number p-1 text-end text-white">{dayData.day}</div>
                          <div className="day-appointments px-1">
                            {appointmentsForDay.map((app, idx) => ( // <-- Usamos appointmentsForDay aquí
                              <div 
                                key={`app-${dayData.day}-${idx}`}
                                className={`appointment-dot mb-1 p-1 rounded-1 ${getStatusColor(app.estado)} text-white small`}
                                onClick={() => showAppointmentDetails(app)}
                                style={{cursor: 'pointer'}}
                              >
                                {app.hora.substring(0, 5)} - {app.nombre_usuario}
                                {app.services && app.services.length > 0 && (
                                  <span className="ms-1 text-muted">
                                    ({app.services.map(s => s.nombre).join(', ')})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
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
              {/* Información del Cliente en el Modal */}
              <div className="mb-3">
                <h6 className="text-info">Información del Cliente</h6>
                <div className="mb-2">
                  <strong>Nombre:</strong> {selectedAppointment.nombre_usuario || 'N/A'}
                </div>
                {selectedAppointment.client_email && (
                  <div className="mb-2">
                    <strong>Email:</strong> {selectedAppointment.client_email}
                  </div>
                )}
                {selectedAppointment.client_telefono && (
                  <div className="mb-2">
                    <strong>Teléfono:</strong> {selectedAppointment.client_telefono}
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
                    {selectedAppointment.estado}
                  </span>
                </div>
              </div>

              {/* Servicios Asociados a la Cita en el Modal */}
              {selectedAppointment.services && selectedAppointment.services.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-info">Servicios de la Cita</h6>
                  <ul className="list-unstyled ms-3">
                    {selectedAppointment.services.map((service, idx) => (
                      <li key={service.id || idx}>
                        <div><strong>{service.nombre}</strong> - ${service.precio}</div>
                        {service.descripcion && (
                          <small className="text-muted d-block">{service.descripcion}</small>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{borderTop: '1px solid rgba(255, 255, 255, 0.2)'}}>
              <button type="button" className="btn btn-outline-light" onClick={() => setShowModal(false)}>Cerrar</button>
              {/* Considera agregar funciones para Confirmar/Cancelar/Finalizar cita aquí */}
              {/* Por ejemplo, como lo tenías en AgendadeCitasNegocio.jsx */}
              {/* {selectedAppointment.estado === 'pendiente' && (
                <button type="button" className="btn btn-success" onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmado')}>Confirmar Cita</button>
              )}
              {selectedAppointment.estado !== 'cancelado' && (
                <button type="button" className="btn btn-danger" onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelado')}>Cancelar Cita</button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Estilo para el contenedor del calendario
  const containerStyle = {
    backgroundColor: 'rgba(18, 27, 70, 0.7)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    marginTop: '2rem',
    marginBottom: '2rem'
  };

  // Mostrar estado de carga
  if (loading) {
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

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="container" style={containerStyle}>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={refreshData}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={containerStyle}>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
          Calendario de Citas
        </h1>
        <button className="btn btn-outline-light" onClick={refreshData}>
          🔄 Actualizar
        </button>
      </div>
      
      {/* Barra de controles */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button className="btn btn-outline-light" onClick={prevMonth}>←</button>
            <button className="btn btn-outline-light" onClick={goToToday}>Hoy</button>
            <button className="btn btn-outline-light" onClick={nextMonth}>→</button>
          </div>
          <h2 className="d-inline-block ms-3 text-white" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
            {getMonthName(currentDate).toUpperCase()} {getYear(currentDate)}
          </h2>
        </div>
        <div className="col-md-6 text-md-end">
          <select 
            className="form-select d-inline-block w-auto bg-transparent text-white border-light"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
          >
            <option value="all" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Todos los estados</option>
            <option value="confirmado" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Confirmados</option>
            <option value="pendiente" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Pendientes</option>
            <option value="cancelado" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Cancelados</option>
            <option value="finalizado" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>Finalizados</option> {/* Agregado el estado finalizado */}
          </select>
        </div>
      </div>
      
      {/* Mostrar mensaje si no hay citas para el mes o filtro actual */}
      {/* La visibilidad de este mensaje ahora es más compleja, ya que el calendario siempre se renderiza */}
      {/* y las citas pueden ser filtradas a cero. Podrías mover esta lógica dentro de renderCalendar si es necesario. */}
      {/* Para simplificar, si no hay citas en el estado 'appointments' (originalmente cargadas), mostramos esto */}
      {appointments.length === 0 && !loading && !error && (
        <div className="alert alert-info">
          No hay citas registradas para este negocio.
        </div>
      )}
      
      {/* Calendario */}
      {/* Siempre renderizamos el calendario para que la estructura y el espacio se mantengan */}
      <div className="calendar-container mb-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)'}}>
        {renderCalendar()}
      </div>
      
      {/* Modal de detalles */}
      {renderAppointmentModal()}
      
      {/* Bootstrap JS via CDN (esto es generalmente para un index.html global, no aquí en un componente) */}
      {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js" /> */}
    </div>
  );
}