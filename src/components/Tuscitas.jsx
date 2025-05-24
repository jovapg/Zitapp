import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgendadeCitas from '../Pages/Calendar/AgendaDeCitas';
import Botonagendarcita from './Botonagendarcita';

export default function TusCitas() {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para transformar los datos de la API
  const transformAppointmentData = (apiData) => {
    return apiData.map(appointment => {
      // Convertir el array de fecha [año, mes, día] a string formato YYYY-MM-DD
      const [year, month, day] = appointment.fecha;
      const fecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // Convertir el array de hora [horas, minutos] a string formato HH:MM:SS
      const [hours, minutes] = appointment.hora;
      const hora = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      return {
        id_cliente: appointment.client.id,
        id_negocio: appointment.business.id,
        id_cita: appointment.id,
        fecha: fecha,
        hora: hora,
        estado: appointment.estado.toLowerCase(),
        nombre_negocio: appointment.business.nombre,
        cliente_nombre: appointment.client.nombre,
        cliente_email: appointment.client.email,
        business: appointment.business,
        servicios: appointment.business.services || []
      };
    });
  };

  // Extraer negocios únicos de las citas
  const extractUniqueBusinesses = (appointmentsData) => {
    const businessMap = new Map();
    
    appointmentsData.forEach(appointment => {
      if (!businessMap.has(appointment.business.id)) {
        businessMap.set(appointment.business.id, {
          id: appointment.business.id,
          nombre: appointment.business.nombre,
          categoria: appointment.business.categoria || 'General',
          descripcion: appointment.business.descripcion || 'Servicios profesionales',
          direccion: appointment.business.direccion,
          imagenUrl: appointment.business.imagenUrl || 'https://via.placeholder.com/300x160?text=Sin+Imagen',
          services: appointment.business.services || [],
          appointmentCount: 1
        });
      } else {
        const business = businessMap.get(appointment.business.id);
        business.appointmentCount += 1;
      }
    });
    
    return Array.from(businessMap.values());
  };

  // Cargar citas desde la API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:8081/api/Appointments/user/2');
        const transformedData = transformAppointmentData(response.data);
        setAppointments(transformedData);
        
        // Extraer negocios únicos
        const uniqueBusinesses = extractUniqueBusinesses(response.data);
        setBusinesses(uniqueBusinesses);
        
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error al cargar las citas. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Función para obtener el número de citas próximas por negocio
  const getUpcomingAppointmentsCount = (businessId) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.id_negocio === businessId && 
      apt.fecha >= today && 
      apt.estado !== 'cancelada'
    ).length;
  };

  // Función para obtener la próxima cita de un negocio
  const getNextAppointment = (businessId) => {
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments.filter(apt => 
      apt.id_negocio === businessId && 
      apt.fecha >= today && 
      apt.estado !== 'cancelada'
    ).sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));
    
    return upcomingAppointments[0] || null;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-white">Cargando tus citas...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
        <button 
          className="btn btn-outline-danger" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex content-section">
        {/* Left Column */}
        <div className="flex-grow-1">
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(35, 35, 60, 0.8)" }}>
            <AgendadeCitas appointments={appointments} />
          </div>

          <div className="p-3 mb-4 rounded" style={{ background: "rgba(40, 40, 90, 0.85)" }}>
            <h6 className="text-info">RECORDATORIO</h6>
            <p className="mb-1 fw-bold">LLEVA UN RECORDATORIO DE TUS CITAS</p>
            {appointments.length > 0 ? (
              <div>
                <p>Tienes {appointments.filter(apt => apt.estado !== 'cancelada').length} citas activas</p>
                {appointments
                  .filter(apt => apt.estado !== 'cancelada' && apt.fecha >= new Date().toISOString().split('T')[0])
                  .slice(0, 3)
                  .map((apt, idx) => (
                    <div key={idx} className="small text-light mb-1">
                      • {apt.nombre_negocio} - {formatDate(apt.fecha)} a las {apt.hora.substring(0, 5)}
                    </div>
                  ))
                }
              </div>
            ) : (
              <p>No tienes ningún recordatorio creado</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="p-3 rounded" style={{ width: "360px", background: "rgba(45, 45, 70, 0.85)" }}>
          {businesses.length > 0 ? (
            businesses.map((business, index) => {
              const nextAppointment = getNextAppointment(business.id);
              const upcomingCount = getUpcomingAppointmentsCount(business.id);
              
              return (
                <div key={business.id} className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 90, 0.9)" }}>
                  <div className="card border-0">
                    <img
                      src={business.imagenUrl}
                      className="card-img-top rounded"
                      alt={business.nombre}
                      style={{ height: "160px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x160?text=' + encodeURIComponent(business.nombre);
                      }}
                    />
                    <div className="card-body bg-dark text-white rounded-bottom">
                      <h5 className="card-title mb-1">{business.nombre}</h5>
                      <p className="card-text mb-2">
                        {business.descripcion || `Categoría: ${business.categoria || 'General'}`}
                      </p>
                      
                      {/* Información de citas */}
                      <div className="mb-2">
                        {upcomingCount > 0 ? (
                          <small className="text-info">
                            {upcomingCount} cita{upcomingCount > 1 ? 's' : ''} próxima{upcomingCount > 1 ? 's' : ''}
                          </small>
                        ) : (
                          <small className="text-muted">Sin citas próximas</small>
                        )}
                      </div>

                      {/* Próxima cita */}
                      {nextAppointment && (
                        <div className="mb-2 p-2 rounded" style={{ background: "rgba(0, 123, 255, 0.2)" }}>
                          <small className="text-light">
                            <strong>Próxima cita:</strong><br />
                            {formatDate(nextAppointment.fecha)} a las {nextAppointment.hora.substring(0, 5)}
                          </small>
                        </div>
                      )}

                      {/* Servicios disponibles */}
                      {business.services.length > 0 && (
                        <div className="mb-2">
                          <small className="text-muted">Servicios:</small>
                          <div className="small">
                            {business.services.slice(0, 2).map((service, idx) => (
                              <span key={idx} className="badge bg-secondary me-1 mb-1">
                                {service.nombre} ${service.precio}
                              </span>
                            ))}
                            {business.services.length > 2 && (
                              <span className="badge bg-outline-secondary">+{business.services.length - 2} más</span>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        className="btn btn-primary mt-2 w-100"
                        onClick={() => setShowModal(true)}
                      >
                        Agendar nueva cita
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Mostrar tarjetas por defecto si no hay negocios
            <>
              <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 90, 0.9)" }}>
                <div className="card border-0">
                  <img
                    src="https://unimedios.usc.edu.co/wp-content/uploads/2023/08/Publicidad-para-barberia.jpg"
                    className="card-img-top rounded"
                    alt="Barber shop"
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <div className="card-body bg-dark text-white rounded-bottom">
                    <h5 className="card-title mb-1">Barber shop</h5>
                    <p className="card-text mb-2">La mejor barberia en la ciudad</p>
                    <small className="text-muted">Sin citas programadas</small>
                    <button
                      className="btn btn-primary mt-2 w-100"
                      onClick={() => setShowModal(true)}
                    >
                      Agendar cita
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 100, 0.9)" }}>
                <div className="card border-0">
                  <img
                    src="https://www.shortcuts.es/wp-content/uploads/2015/11/beauty1-1030x686.jpg"
                    className="card-img-top rounded"
                    alt="Belleza Total"
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <div className="card-body bg-dark text-white rounded-bottom">
                    <h5 className="card-title mb-1">Belleza Total</h5>
                    <p className="card-text mb-2">Peinados y manicure profesional</p>
                    <small className="text-muted">Sin citas programadas</small>
                    <button
                      className="btn btn-primary mt-2 w-100"
                      onClick={() => setShowModal(true)}
                    >
                      Agendar cita
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal para agendar */}
        {showModal && <Botonagendarcita show={showModal} setShow={setShowModal} />}
      </div>

      <style>{`
        .content-section {
          display: flex;
          gap: 24px;
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}