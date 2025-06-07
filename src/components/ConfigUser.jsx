import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'; // Importa componentes de React-Bootstrap

export default function Contactanos({ show, handleClose }) {
    const [step, setStep] = useState(1); // Mantener el estado de los pasos del formulario

    // Función para manejar el avance del paso 1 al paso 2
    const handleStep1Submit = (e) => {
        e.preventDefault();
        // Aquí podrías añadir validación para los campos del paso 1 antes de avanzar
        setStep(2);
    };

    // Función para manejar el envío final del formulario
    const handleFinalSubmit = (e) => {
        e.preventDefault();
        // Aquí iría tu lógica para enviar los datos a un backend o servicio
        alert('¡Mensaje enviado!');
        handleClose(); // Cerrar el modal después de enviar
        setStep(1); // Opcional: reiniciar el paso a 1 para la próxima vez que se abra
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName="contact-custom-modal">
            <Modal.Header closeButton className="contact-modal-header-custom">
                <Modal.Title className="text-white">¡Conversemos!</Modal.Title>
            </Modal.Header>
            <Modal.Body className="contact-modal-body-custom p-0">
                <Row className="g-0">
                    {/* Imagen */}
                    <Col md={5} className="d-none d-md-block">
                        <img src='https://i.pinimg.com/736x/77/37/b4/7737b4798afbbbb10514a9866ed9d91e.jpg' alt="Contacto" className="img-fluid rounded-4 h-100" />
                    </Col>

                    {/* Formulario */}
                    <Col md={7} className="p-4">
                        {step === 1 && (
                            <div>
                                <h4 className="fw-bold mb-2 text-white">Ponte en contacto</h4>
                                <p className="text-white">Nos encantaría escucharte. Llena el formulario y nos pondremos en contacto contigo lo antes posible.</p>

                                <Form onSubmit={handleStep1Submit}>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Control type="text" className="contact-form-control" placeholder="Nombre*" required />
                                        </Col>
                                        <Col>
                                            <Form.Control type="text" className="contact-form-control" placeholder="Apellidos" />
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Control type="email" className="contact-form-control" placeholder="Correo*" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex">
                                        <Form.Select className="contact-form-control me-2" style={{ maxWidth: '80px' }}>
                                            <option value="+57" defaultValue>+57</option>
                                            <option value="+1">+1</option>
                                            <option value="+52">+52</option>
                                        </Form.Select>
                                        <Form.Control type="tel" className="contact-form-control" placeholder="Número de teléfono" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Select className="contact-form-control" required>
                                            <option value="" disabled defaultValue>¿Cómo conociste el sitio web?</option>
                                            <option value="Google">Google</option>
                                            <option value="Redes Sociales">Redes Sociales</option>
                                            <option value="Recomendacion">Recomendación</option>
                                            <option value="Publicidad">Publicidad</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <div className="progress mb-3" style={{height: '5px'}}>
                                        <div className="progress-bar bg-purple" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <Button type="submit" className="btn-purple w-100">Siguiente</Button>
                                </Form>
                            </div>
                        )}

                        {step === 2 && (
                            <Form onSubmit={handleFinalSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-white">¿Eres cliente o empresa?*</Form.Label>
                                    <Form.Select className="contact-form-control" required>
                                        <option value="Cliente">Cliente</option>
                                        <option value="Empresa">Empresa</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-white">Motivo del contacto*</Form.Label>
                                    <Form.Select className="contact-form-control" required>
                                        <option value="" disabled defaultValue>Comentarios y sugerencias</option>
                                        <option value="Informacion general">Información general</option>
                                        <option value="Quejas y reclamos">Quejas y reclamos</option>
                                        <option value="Felicitaciones">Felicitaciones</option>
                                        <option value="Otros">Otros</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-white">Escribe tu mensaje*</Form.Label>
                                    <Form.Control as="textarea" className="contact-form-control" rows={3} required />
                                </Form.Group>
                                <div className="progress mb-3" style={{height: '5px'}}>
                                    <div className="progress-bar bg-purple" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Button type="button" variant="secondary" onClick={() => setStep(1)} className="text-white">Anterior</Button>
                                    <Button type="submit" className="btn-purple">Enviar</Button>
                                </div>
                            </Form>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="contact-modal-footer-custom">
                {/* Puedes poner botones o información adicional aquí si es necesario */}
            </Modal.Footer>

            {/* Estilos CSS */}
            <style>{`
                /* Estilos para el modal de Contactanos */
                .contact-custom-modal .modal-content {
                    background-color: #1a1a2e; /* Fondo oscuro sólido para el modal */
                    color: white; /* Color de texto por defecto */
                    border-radius: 15px;
                    border: none;
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); /* Sombra brillante */
                    overflow: hidden; /* Para asegurar bordes redondeados */
                }

                .contact-modal-header-custom {
                    background-color: #0d1117; /* Fondo para el header del modal */
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 15px 15px 0 0; /* Solo esquinas superiores redondeadas */
                }
                .contact-modal-header-custom .btn-close {
                    filter: invert(1) brightness(200%); /* Hace la X blanca */
                }

                .contact-modal-body-custom {
                    background-color: #1a1a2e; /* Fondo sólido para el cuerpo del modal */
                    color: white;
                }

                .contact-modal-footer-custom {
                    background-color: #0d1117; /* Fondo para el footer del modal */
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0 0 15px 15px; /* Solo esquinas inferiores redondeadas */
                }

                /* Estilos de los inputs y selects (Form.Control, Form.Select) */
                .contact-form-control {
                    background-color: rgba(255, 255, 255, 0.08) !important; /* Fondo ligeramente visible */
                    color: white !important; /* Texto blanco */
                    border: 1px solid #0026ff !important; /* Borde morado */
                    border-radius: 8px !important; /* Bordes redondeados */
                }
                .contact-form-control::placeholder {
                    color: #bbb !important; /* Placeholder claro */
                    opacity: 1 !important;
                }
                .contact-form-control:focus {
                    background-color: rgba(255, 255, 255, 0.15) !important;
                    border-color: #0040ff !important;
                    box-shadow: 0 0 0 0.25rem rgba(0, 64, 255, 0.25) !important;
                }

                /* Para las opciones del select cuando se abren */
                .contact-form-control option {
                    background-color: #1a1a2e !important; /* Fondo oscuro para las opciones */
                    color: white !important;
                }

                /* Botones */
                .btn-purple {
                    background-color: #0177e5e0 !important; /* Azul de Zitapp */
                    color: black !important; /* Texto negro para contraste */
                    border: none !important;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                .btn-purple:hover {
                    background-color: #006aff !important;
                    color: white !important;
                }
                .btn-secondary {
                    background-color: #6c757d !important;
                    border-color: #6c757d !important;
                    color: white !important;
                }
                .btn-secondary:hover {
                    background-color: #5a6268 !important;
                    border-color: #545b62 !important;
                }

                /* Progreso */
                .progress-bar {
                    background-color: #0177e5e0 !important;
                }

                /* Otros estilos */
                .text-white { color: white !important; }
                .text-muted { color: #ccc !important; }
                .fw-bold { font-weight: bold !important; }
            `}</style>
        </Modal>
    );
}