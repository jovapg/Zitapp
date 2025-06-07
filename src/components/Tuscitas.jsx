import React, { useState, useEffect } from 'react';

import axios from 'axios';

import AgendadeCitas from '../Pages/Calendar/AgendaDeCitas';

import Botonagendarcita from './Botonagendarcita';

import { Modal, Button, Form, ListGroup, Row, Col } from 'react-bootstrap'; // Asegúrate de importar esto si no lo hiciste





// Nuevo componente de modal para mostrar los detalles de la cita

const AppointmentDetailsModal = ({ show, handleClose, appointmentDetails }) => {

  if (!appointmentDetails) return null;



  return (

    <Modal show={show} onHide={handleClose} size="md" centered style={{ background: 'rgba(0, 0, 128, 0.9)', color: 'white' }}>

      <Modal.Header closeButton>

        <Modal.Title className="text-light">Detalles de la Cita</Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <p><strong>Negocio:</strong> {appointmentDetails.nombre_negocio}</p>

        <p><strong>Servicio:</strong> {appointmentDetails.service_nombre}</p>

        <p><strong>Precio:</strong> ${appointmentDetails.service_precio}</p>

        <p><strong>Dirección:</strong> {appointmentDetails.business?.direccion || 'N/A'}</p>

        <p><strong>Fecha:</strong> {appointmentDetails.fecha}</p>

        <p><strong>Hora:</strong> {appointmentDetails.hora}</p>

        <p><strong>Estado:</strong>

          <span className={`badge ms-2 ${appointmentDetails.estado === 'confirmada' ? 'bg-success' : appointmentDetails.estado === 'cancelada' ? 'bg-danger' : 'bg-warning text-dark'}`}>

            {appointmentDetails.estado}

          </span>

        </p>

      </Modal.Body>

      <Modal.Footer>

        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>

        <Button variant="danger" onClick={() => alert('Función de cancelar cita no implementada aún')}>Cancelar Cita</Button>

      </Modal.Footer>

    </Modal>

  );

};





export default function TusCitas({ onCitaAgendada }) {

  const [showAgendarCitaModal, setShowAgendarCitaModal] = useState(false);

  const [selectedBusinessForAgendarCitaModal, setSelectedBusinessForAgendarCitaModal] = useState(null);

 

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);



  const [appointments, setAppointments] = useState([]);

  const [businesses, setBusinesses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  // --- Mover todas las funciones auxiliares AQUÍ, ANTES de los useEffect y del return principal ---



  // Formatear fecha a formato legible

  const formatDate = (dateString) => {

    const date = new Date(dateString);

    return date.toLocaleDateString('es-ES', {

      day: 'numeric',

      month: 'short',

      year: 'numeric',

    });

  };



  // Función para contar citas próximas por negocio

  const getUpcomingAppointmentsCount = (businessId) => {

    const today = new Date().toISOString().split('T')[0];

    return appointments.filter(

      (apt) =>

        apt.id_negocio === businessId && apt.fecha >= today && apt.estado !== 'cancelada'

    ).length;

  };



  // Función para obtener la próxima cita de un negocio

  const getNextAppointment = (businessId) => {

    const today = new Date().toISOString().split('T')[0];

    const upcomingAppointments = appointments

      .filter(

        (apt) =>

          apt.id_negocio === businessId && apt.fecha >= today && apt.estado !== 'cancelada'

      )

      .sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));



    return upcomingAppointments[0] || null;

  };



  // Funciones para manejar el modal de agendar nueva cita

  const handleOpenAgendarCitaModal = (business) => {

    setSelectedBusinessForAgendarCitaModal(business);

    setShowAgendarCitaModal(true);

  };



  const handleCloseAgendarCitaModal = () => {

    setShowAgendarCitaModal(false);

    setSelectedBusinessForAgendarCitaModal(null);

  };



  // Funciones para manejar el modal de detalles de la cita

  const handleOpenDetailsModal = (appointmentDetails) => {

    setSelectedAppointmentDetails(appointmentDetails);

    setShowDetailsModal(true);

  };



  const handleCloseDetailsModal = () => {

    setShowDetailsModal(false);

    setSelectedAppointmentDetails(null);

  };



  // Manejar nueva cita agendada (se llama al cerrar el modal de agendar cita exitosamente)

  const handleCitaAgendada = (nuevaCita) => {

    if (onCitaAgendada) {

      onCitaAgendada(nuevaCita);

    }

    fetchAppointments(); // Vuelve a cargar las citas para actualizar la lista

    setShowAgendarCitaModal(false); // Cierra el modal

  };

 

  // Función para transformar los datos de la API (DEJAR AQUÍ O ANTES DE fetchAppointments)

  // La pongo aquí porque usa las funciones de formateo, pero en este caso no causaría error

  // si estuviera después de fetchAppointments, siempre y cuando fetchAppointments se defina después.

  // Pero lo más limpio es tenerla aquí.

  const transformAppointmentData = (apiData) => {

    return apiData.map((appointment) => {

      // FECHA: Array [año, mes, día] -> String "YYYY-MM-DD"

      const [year, month, day] = appointment.fecha || [0,0,0];

      const fecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;



      // HORA: Array [horas, minutos] -> String "HH:MM"

      const [hours, minutes] = appointment.hora || [0,0];

      const hora = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;



      const service = appointment.service || {};

      const client = appointment.cliente || {};

      const business = appointment.business || {}; // Acceso directo al objeto business de la cita



      return {

        id_cliente: client.id || null,

        id_negocio: business.id || null,

        id_cita: appointment.id,

        fecha,

        hora,

        estado: appointment.estado?.toLowerCase() || 'desconocido',

        nombre_negocio: business.nombre || 'Negocio desconocido',

        cliente_nombre: client.nombre || '',

        cliente_email: client.email || '',

       

        service_id: service.id || null,

        service_nombre: service.nombre || 'Servicio desconocido',

        service_precio: service.precio || 0,

        service_descripcion: service.descripcion || '',

        service_duracion: service.duracion || 0,

       

        business: { // Aseguramos que el objeto business que se pasa sea completo para el modal

          id: business.id || null,

          nombre: business.nombre || 'Negocio desconocido',

          categoria: business.categoria || 'General',

          descripcion: business.descripcion || '',

          direccion: business.direccion || '',

          imagenUrl: business.imagenUrl || '',

          telefono: business.telefono || '',

          services: business.services || []

        },

        business_info: business // Para el modal de detalles, si quieres toda la info tal cual viene

      };

    });

  };



  // Extraer negocios únicos de las citas transformadas (DEJAR AQUÍ)

  const extractUniqueBusinesses = (appointmentsData) => {

    const businessMap = new Map();



    appointmentsData.forEach((apt) => {

      const business = apt.business;

      if (business && business.id && !businessMap.has(business.id)) {

        businessMap.set(business.id, business);

      }

    });

    return Array.from(businessMap.values());

  };





  // Función para cargar las citas desde la API (DEJAR AQUÍ)

  const fetchAppointments = async () => {

    try {

      setLoading(true);

      setError(null);



      const user = JSON.parse(localStorage.getItem('user'));

      const idClient = user?.id;



      if (!idClient) {

        setError('Usuario no autenticado. Por favor, inicia sesión.');

        setLoading(false);

        return;

      }



      const appointmentsResponse = await axios.get(

        `http://localhost:8081/api/appointments/clients/${idClient}`

      );



      const transformedData = transformAppointmentData(appointmentsResponse.data);

      setAppointments(transformedData);



      const uniqueBusinesses = extractUniqueBusinesses(transformedData);

      setBusinesses(uniqueBusinesses);



    } catch (err) {

      console.error('Error al cargar las citas:', err);

      if (err.response) {

        setError(`Error del servidor: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`);

      } else if (err.request) {

        setError('No se pudo conectar al servidor. Verifica tu conexión o que el backend esté corriendo.');

      } else {

        setError(`Error inesperado: ${err.message}`);

      }

    } finally {

      setLoading(false);

    }

  };





  // Hook para disparar la carga al montar el componente (DEJAR AQUÍ)

  useEffect(() => {

    fetchAppointments();

  }, []);



  // --- Renderizado Condicional ---

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



  if (error) {

    return (

      <div className="alert alert-danger" role="alert">

        <h4 className="alert-heading">Error</h4>

        <p>{error}</p>

        <button className="btn btn-outline-danger" onClick={fetchAppointments}>

          Reintentar

        </button>

      </div>

    );

  }



  return (

    <>

      <br />

      <div className="d-flex content-section">

        {/* Left Column - Calendario y Recordatorio */}

        <div className="flex-grow-1 me-3">

          <div className="p-3 mb-4 rounded" style={{ background: 'rgba(35, 35, 60, 0.8)' }}>

            <AgendadeCitas appointments={appointments} />

          </div>



          <div className="p-3 mb-4 rounded" style={{ background: 'rgba(40, 40, 90, 0.85)' }}>

            <h6 className="text-info">RECORDATORIO</h6>

            <p className="mb-1 fw-bold">LLEVA UN RECORDATORIO DE TUS CITAS</p>

            {appointments.length > 0 ? (

              <div>

                <p>

                  Tienes {appointments.filter((apt) => apt.estado !== 'cancelada').length} Citas activas

                </p>

                {appointments

                  .filter(

                    (apt) =>

                      apt.estado !== 'cancelada' &&

                      apt.fecha >= new Date().toISOString().split('T')[0]

                  )

                  .slice(0, 3)

                  .map((apt, idx) => (

                    <div key={idx} className="small text-light mb-1">

                      • {apt.nombre_negocio} - {formatDate(apt.fecha)} a las{' '}

                      {apt.hora.substring(0, 5)}

                    </div>

                  ))}

              </div>

            ) : (

              <p className="text-muted">No tienes ningún recordatorio creado.</p>

            )}

          </div>

        </div>



        {/* Right Column - Tarjetas de Negocios y Citas */}

        <div

          className="p-3 rounded"

          style={{ width: '360px', background: 'rgba(45, 45, 70, 0.85)' }}

        >

          <h4 className="text-light mb-3">Tus Citas por Negocio</h4>

          {businesses.length > 0 ? (

            businesses.map((business) => {

              const nextAppointment = getNextAppointment(business.id);

              const upcomingCount = getUpcomingAppointmentsCount(business.id);



              const businessAppointments = appointments.filter(

                (apt) => apt.business && apt.business.id === business.id

              ).sort((a,b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));



              return (

                <div

                  key={business.id}

                  className="p-3 mb-4 rounded"

                  style={{ background: 'rgba(55, 55, 90, 0.9)', color: 'white' }}

                >

                  <div className="card border-0">



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

                        <div

                          className="mb-2 p-2 rounded"

                          style={{ background: 'rgba(0, 123, 255, 0.2)' }}

                        >

                          <small className="text-light">

                            <strong>Próxima cita:</strong>

                            <br />

                            {formatDate(nextAppointment.fecha)} a las{' '}

                            {nextAppointment.hora.substring(0, 5)}

                          </small>

                        </div>

                      )}



                      {/* Detalles de TODAS las citas con este negocio */}

                      {businessAppointments.length > 0 && (

                        <div className="mt-3">

                          <h6 className="text-info">Detalle de Citas:</h6>

                          <ListGroup variant="flush">

                            {businessAppointments.map((apt, idx) => (

                              <ListGroup.Item

                                key={apt.id_cita}

                                style={{ background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}

                                className="d-flex justify-content-between align-items-center"

                              >

                                <div>

                                  <small className="d-block">{apt.service_nombre} (${apt.service_precio})</small>

                                  <small className="d-block text-muted">{formatDate(apt.fecha)} - {apt.hora.substring(0,5)}</small>

                                  {/* Botón para abrir el modal de detalles de la cita específica */}

                                  <button

                                    className="btn btn-sm btn-outline-info mt-1"

                                    onClick={() => handleOpenDetailsModal(apt)}

                                  >

                                    Ver Detalle

                                  </button>

                                </div>

                                <span className={`badge ${apt.estado === 'confirmada' ? 'bg-success' : apt.estado === 'cancelada' ? 'bg-danger' : 'bg-warning text-dark'}`}>

                                  {apt.estado}

                                </span>

                              </ListGroup.Item>

                            ))}

                          </ListGroup>

                        </div>

                      )}



                      <button

                        className="btn btn-primary mt-3 w-100"

                        onClick={() => handleOpenAgendarCitaModal(business)}

                      >

                        Agendar nueva cita

                      </button>

                    </div>

                  </div>

                </div>

              );

            })

          ) : (

            <p className="text-light">No tienes citas agendadas con negocios.</p>

          )}

        </div>

      </div>



      {/* Modal de Agendar Cita */}

      {showAgendarCitaModal && selectedBusinessForAgendarCitaModal && (

        <Botonagendarcita

          show={showAgendarCitaModal}

          handleClose={handleCloseAgendarCitaModal}

          business={selectedBusinessForAgendarCitaModal}

          onCitaAgendada={handleCitaAgendada}

        />

      )}



      {/* Nuevo Modal para Detalles de la Cita */}

      {showDetailsModal && selectedAppointmentDetails && (

        <AppointmentDetailsModal

          show={showDetailsModal}

          handleClose={handleCloseDetailsModal}

          appointmentDetails={selectedAppointmentDetails}

        />

      )}

    </>

  );

}