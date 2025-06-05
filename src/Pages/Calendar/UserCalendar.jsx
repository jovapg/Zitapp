import { useState, useEffect } from 'react';
import axios from 'axios';
import fondoAzuli from '../../assets/img/fondo_azul_editado.png'

// Componente principal del calendario de usuario
export default function UserCalendar() {
  // Aplicar la imagen de fondo al body cuando se monte el componente
  useEffect(() => {
    // Guardar el estilo original del body para restaurarlo cuando se desmonte
    const originalBodyStyle = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundRepeat: document.body.style.backgroundRepeat,
      backgroundColor: document.body.style.backgroundColor,
      margin: document.body.style.margin
    };
    
    // Aplicar el nuevo estilo al body
    document.body.style.backgroundImage = `url(${fondoAzuli})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = '#000';
    document.body.style.margin = '0';
    
    // Limpiar el efecto cuando el componente se desmonte
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
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores en la carga
  const [error, setError] = useState(null);

  // Función para transformar los datos de la API en el formato esperado por el componente
  const transformAppointmentData = (apiData) => {
    return apiData.map(appointment => {
      // Convertir el array de fecha [año, mes, día] a string con formato YYYY-MM-DD
      const [year, month, day] = appointment.fecha;
      const fecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // Convertir el array de hora [horas, minutos] a string con formato HH:MM:SS
      const [hours, minutes] = appointment.hora;
      const hora = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      // Retornar el objeto transformado con los campos necesarios para mostrar
      return {
      id_cita: appointment.id,
      id_servicio: appointment.service?.id || null,
      nombre_servicio: appointment.service?.nombre || '',
      descripcion_servicio: appointment.service?.descripcion || '',
      precio_servicio: appointment.service?.precio || 0,
      duracion_servicio: appointment.service?.duracion || 0,
      fecha,
      hora,
      estado: appointment.estado.toLowerCase(),
      };
    });
  };
  

  // Efecto para cargar las citas desde la API usando el ID del usuario guardado en localStorage
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener el usuario almacenado en localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) throw new Error("Usuario no encontrado en localStorage");
        
        // Hacer petición GET a la API para obtener las citas del usuario
        const response = await axios.get(`http://localhost:8081/api/appointments/clients/${user.id}`);
        
        console.log("Datos recibidos de la API:", response.data);

        // Transformar los datos para adecuarlos al formato del componente
        const transformedData = transformAppointmentData(response.data);
        
        // Actualizar el estado con las citas obtenidas
        setAppointments(transformedData);
        
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error al cargar las citas. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []); // Solo se ejecuta al montar el componente

  // Función para obtener el nombre del mes en español
  const getMonthName = (date) => {
    return date.toLocaleString('es-ES', { month: 'long' });
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
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Número de días en el mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Día de la semana del primer día del mes (0 = Domingo, 6 = Sábado)
    const startDay = firstDay.getDay();
    
    // Arreglo que contendrá los días para renderizar
    const days = [];
    
    // Añadir días vacíos para completar la semana si el mes no empieza en domingo
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, appointments: [] });
    }
    
    // Añadir los días del mes con las citas correspondientes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateString = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Filtrar las citas para ese día específico
      const dayAppointments = appointments.filter(app => app.fecha === dateString);
      
      days.push({
        day,
        date: dateString,
        appointments: dayAppointments
      });
    }
    
    return days;
  };

  // Filtrar las citas según el filtro de estado seleccionado
  const filteredAppointments = statusFilter === 'all' 
    ? appointments 
    : appointments.filter(app => app.estado === statusFilter);

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
      default: return status;
    }
  };

  // Renderizar la vista principal del calendario (por ahora solo mes)
  const renderCalendar = () => {
    return renderMonthView();
  };

  // Renderizar la vista de mes con los días y citas
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
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
          {Array(Math.ceil(days.length / 7)).fill(0).map((_, weekIndex) => {
            return (
              <div className="row mb-2" key={`week-${weekIndex}`}>
                {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((dayObj, idx) => (
                  <div
                    key={`day-${weekIndex}-${idx}`}
                    className={`col border rounded calendar-day p-1 position-relative ${
                      dayObj.day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear()
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark'
                    }`}
                    style={{ minHeight: '100px', cursor: dayObj.appointments.length ? 'pointer' : 'default' }}
                    onClick={() => dayObj.appointments.length ? showAppointmentDetails(dayObj.appointments[0]) : null}
                  >
                    <div className="day-number fw-bold">{dayObj.day || ''}</div>
                    {/* Mostrar hasta 3 citas por día con su estado */}
                    {dayObj.appointments.slice(0, 3).map(app => (
                      <div
                        key={`app-${app.id_cita}`}
                        className={`appointment-item text-truncate px-1 rounded my-1 text-white ${getStatusColor(app.estado)}`}
                        title={`${app.nombre_negocio} - ${translateStatus(app.estado)}`}
                      >
                        {app.nombre_negocio} ({translateStatus(app.estado)})
                      </div>
                    ))}
                    {dayObj.appointments.length > 3 && (
                      <div className="text-muted small">+{dayObj.appointments.length - 3} más</div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
      </>
    );
  };

  return (
    <>
      <div className="container py-4 text-white" style={{ maxWidth: '900px' }}>
        <h2 className="mb-3">Mi Calendario de Citas</h2>

        {/* Controles de navegación del mes */}
        <div className="d-flex align-items-center mb-3 gap-3">
          <button className="btn btn-outline-light" onClick={prevMonth}>Anterior</button>
          <button className="btn btn-outline-light" onClick={goToToday}>Hoy</button>
          <button className="btn btn-outline-light" onClick={nextMonth}>Siguiente</button>
          <h4 className="mb-0 ms-auto me-auto">
            {getMonthName(currentDate).toUpperCase()} {currentDate.getFullYear()}
          </h4>
        </div>

        {/* Filtro de estado */}
        <div className="mb-3">
          <label htmlFor="statusFilter" className="form-label">Filtrar por estado:</label>
          <select
            id="statusFilter"
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        {/* Mostrar loading, error o calendario */}
        {loading ? (
          <p>Cargando citas...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            {appointments.length === 0 ? (
              <p>No tienes citas agendadas.</p>
            ) : (
              renderCalendar()
            )}
          </>
        )}

        {/* Modal para mostrar detalles de la cita */}
        {showModal && selectedAppointment && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content text-dark">
                <div className="modal-header">
                  <h5 className="modal-title">Detalles de la Cita</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Negocio:</strong> {selectedAppointment.nombre_negocio}</p>
                  <p><strong>Fecha:</strong> {selectedAppointment.fecha}</p>
                  <p><strong>Hora:</strong> {selectedAppointment.hora}</p>
                  <p><strong>Estado:</strong> {translateStatus(selectedAppointment.estado)}</p>
                  <p><strong>Cliente:</strong> {selectedAppointment.cliente_nombre}</p>
                  <p><strong>Email Cliente:</strong> {selectedAppointment.cliente_email}</p>
                  <hr />
                  <h6>Servicios solicitados:</h6>
                  {selectedAppointment.servicios.length > 0 ? (
                    <ul>
                      {selectedAppointment.servicios.map(serv => (
                        <li key={serv.id}>{serv.nombre} - ${serv.precio}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay servicios asociados.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .calendar-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .calendar-day {
          min-height: 100px;
          cursor: pointer;
          user-select: none;
        }
        .appointment-item {
          font-size: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bg-success {
          background-color: #198754 !important;
        }
        .bg-warning {
          background-color: #ffc107 !important;
        }
        .bg-danger {
          background-color: #dc3545 !important;
        }
        .bg-secondary {
          background-color: #6c757d !important;
        }
      `}</style>
    </>
  );
}
