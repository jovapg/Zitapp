import { useState, useEffect } from 'react';
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
    // Simulamos una llamada a API que trae las citas
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
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Días en el mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Día de la semana del primer día (0 = Domingo)
    const startDay = firstDay.getDay();
    
    // Arreglo para los días
    const days = [];
    
    // Añadir días del mes anterior para completar la primera semana
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, appointments: [] });
    }
    
    // Añadir días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Filtrar citas para este día
      const dayAppointments = appointments.filter(app => app.fecha === dateString);
      
      days.push({
        day,
        date: dateString,
        appointments: dayAppointments
      });
    }
    
    return days;
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
    switch(status) {
      case 'confirmado': return 'bg-success';
      case 'pendiente': return 'bg-warning text-dark';
      case 'cancelado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Renderizar el calendario según la vista seleccionada
  const renderCalendar = () => {
    return renderMonthView();
  };

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
          {Array(Math.ceil(days.length / 7)).fill().map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row mb-3">
              {days.slice(rowIndex * 7, (rowIndex + 1) * 7).map((dayData, colIndex) => (
                <div key={`col-${rowIndex}-${colIndex}`} className="col p-0">
                  <div className={`calendar-day border ${dayData.day ? 'h-100' : ''}`} style={{backgroundColor: dayData.day ? 'rgba(0, 0, 0, 0.3)' : 'transparent'}}>
                    {dayData.day && (
                      <>
                        <div className="day-number p-1 text-end text-white">{dayData.day}</div>
                        <div className="day-appointments px-1">
                          {dayData.appointments.map((app, idx) => (
                            <div 
                              key={`app-${dayData.day}-${idx}`}
                              className={`appointment-dot mb-1 p-1 rounded-1 ${getStatusColor(app.estado)} text-white small`}
                              onClick={() => showAppointmentDetails(app)}
                              style={{cursor: 'pointer'}}
                            >
                              {app.hora.substring(0, 5)} - {app.nombre_negocio}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
    );
  };
  // Modal para mostrar detalles de la cita
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
            <div className="modal-footer" style={{borderTop: '1px solid rgba(255, 255, 255, 0.2)'}}>
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

  // Lista de citas (para vista móvil o complementaria)
  const renderAppointmentsList = () => {
    return (
      <div className="appointments-list mt-4 ">
        <h3>Mis Citas</h3>
        {filteredAppointments.length === 0 ? (
          <div className="alert alert-info">No hay citas para mostrar.</div>
        ) : (
          <div className="list-group">
            {filteredAppointments.map((app, idx) => (
              <div 
                key={`list-app-${idx}`} 
                className="list-group-item list-group-item-action"
                onClick={() => showAppointmentDetails(app)}
                style={{cursor: 'pointer'}}
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
    );
  };

  // Estilo para el contenedor del calendario
  const containerStyle = {
    backgroundColor: 'rgba(43, 38, 107, 0.7)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    marginTop: '2rem',
    marginBottom: '2rem'
  };

  return (
    <div className="container" style={containerStyle}>

      <h1 className="mb-4 text-white" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>Mis Citas</h1>
      
      {/* Barra de controles */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button className="btn btn-outline-light" onClick={prevMonth}>←</button>
            <button className="btn btn-outline-light" onClick={goToToday}>Hoy</button>
            <button className="btn btn-outline-light" onClick={nextMonth}>→</button>
          </div>
          <h2 className="d-inline-block ms-3 text-white" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
            {getMonthName(currentDate)} {getYear(currentDate)}
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
          </select>
        </div>
      </div>
      
      {/* Calendario */}
      <div className="calendar-container mb-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)'}}>
        {renderCalendar()}
      </div>
      
      {/* Lista de citas */}
      <div className="appointments-list mt-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '5px', backdropFilter: 'blur(5px)'}}>
        <h3 className="text-white" style={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}>Mis Citas</h3>
        {filteredAppointments.length === 0 ? (
          <div className="alert alert-info">No hay citas para mostrar.</div>
        ) : (
          <div className="list-group">
            {filteredAppointments.map((app, idx) => (
              <div 
                key={`list-app-${idx}`} 
                className="list-group-item list-group-item-action"
                onClick={() => showAppointmentDetails(app)}
                style={{cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)'}}
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
      
      {/* Bootstrap JS via CDN */}
      <script 
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js" 
      />
    </div>
  );
}