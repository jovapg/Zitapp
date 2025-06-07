import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Importamos Modal, Button, Form de react-bootstrap

export default function Contactanos({ show, handleClose }) { // Recibe props 'show' y 'handleClose'
    const [step, setStep] = useState(1);

    // useEffect para reiniciar el paso al abrir el modal
    useEffect(() => {
        if (show) {
            setStep(1); // Reiniciar el paso al abrir el modal
        }
    }, [show]);

    return (
        // Usamos el componente Modal de React-Bootstrap
        // 'show' controla si el modal está visible
        // 'onHide' es la prop de React-Bootstrap para cerrar el modal (equivalente a tu handleClose)
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark">¡Conversemos!</Modal.Title> {/* Asegura que el texto sea visible */}
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#1a1a2e', color: 'white' }}> {/* Estilos para el body */}
                <div className="row">
                    <div className="col-md-5 d-none d-md-block">
                        <img src='https://i.pinimg.com/736x/77/37/b4/7737b4798afbbbb10514a9866ed9d91e.jpg' alt="Contacto" className="img-fluid rounded-4 h-100" />
                    </div>
                    <div className="col-md-7">
                        {step === 1 && (
                            <div>
                                <h4 className="fw-bold mb-2">Ponte en contacto</h4>
                                <p>Nos encantaría escucharte. Llena el formulario y nos pondremos en contacto contigo lo antes posible.</p>
                                <Form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <Form.Control type="text" className="contact-input-custom" placeholder="Nombre*" required />
                                        </div>
                                        <div className="col">
                                            <Form.Control type="text" className="contact-input-custom" placeholder="Apellidos" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <Form.Control type="email" className="contact-input-custom" placeholder="Correo*" required />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <Form.Select className="contact-input-custom me-2" style={{ maxWidth: '80px' }}>
                                            <option value="+57" defaultValue>+57</option>
                                            <option value="+1">+1</option>
                                            <option value="+52">+52</option>
                                        </Form.Select>
                                        <Form.Control type="tel" className="contact-input-custom" placeholder="Número de teléfono" />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Select className="contact-input-custom" required>
                                            <option value="" disabled defaultValue>¿Cómo conociste el sitio web?</option>
                                            <option value="Google">Google</option>
                                            <option value="Redes Sociales">Redes Sociales</option>
                                            <option value="Recomendacion">Recomendación</option>
                                            <option value="Publicidad">Publicidad</option>
                                        </Form.Select>
                                    </div>
                                    <div className="progress mb-3" style={{ height: '5px' }}>
                                        <div className="progress-bar bg-purple" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <Button type="submit" className="btn-purple w-100">Siguiente</Button>
                                </Form>
                            </div>
                        )}

                        {step === 2 && (
                            <Form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado!'); handleClose(); }}>
                                <div className="mb-3">
                                    <Form.Label className="text-white">¿Eres cliente o empresa?*</Form.Label>
                                    <Form.Select className="contact-input-custom" required>
                                        <option value="Cliente">Cliente</option>
                                        <option value="Empresa">Empresa</option>
                                    </Form.Select>
                                </div>
                                <div className="mb-3">
                                    <Form.Label className="text-white">Motivo del contacto*</Form.Label>
                                    <Form.Select className="contact-input-custom" required>
                                        <option value="" disabled defaultValue>Comentarios y sugerencias</option>
                                        <option value="Informacion general">Información general</option>
                                        <option value="Quejas y reclamos">Quejas y reclamos</option>
                                        <option value="Felicitaciones">Felicitaciones</option>
                                        <option value="Otros">Otros</option>
                                    </Form.Select>
                                </div>
                                <div className="mb-3">
                                    <Form.Label className="text-white">Escribe tu mensaje*</Form.Label>
                                    <Form.Control as="textarea" className="contact-input-custom" rows="3" required></Form.Control>
                                </div>
                                <div className="progress mb-3" style={{ height: '5px' }}>
                                    <div className="progress-bar bg-purple" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Button type="button" variant="secondary" onClick={() => setStep(1)} className="text-white">Anterior</Button>
                                    <Button type="submit" className="btn-purple">Enviar</Button>
                                </div>
                            </Form>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
            {/* Los estilos permanecen aquí para mantener la personalización */}
            <style>{`
                /* IMPORTANTE: Estas reglas con ID y clases de Bootstrap y !important
                    deben tener la máxima especificidad para funcionar. */

                /* El modal en sí (el componente Modal de React-Bootstrap genera las clases y z-index) */
                .modal-content {
                    background-color: #1a1a2e !important; /* Fondo sólido y oscuro! */
                    color: white !important; /* Texto principal del modal en blanco */
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) !important;
                }
                
                /* Colores de texto dentro del modal-body */
                .modal-header .modal-title,
                .modal-body h4, 
                .modal-body p, 
                .modal-body label {
                    color: white !important;
                }

                /* Estilo del botón de cerrar (la 'x') */
                .btn-close {
                    filter: invert(1) brightness(200%) !important; /* Hace la X blanca y más visible */
                }
                .btn-close:focus {
                    box-shadow: none !important; /* Quita el focus por defecto si no lo deseas */
                }
                
                /* Estilo de los inputs y selects PERSONALIZADOS */
                .form-control.contact-input-custom, 
                .form-select.contact-input-custom {
                    background-color: rgba(255, 255, 255, 0.1) !important; /* Fondo ligeramente translúcido pero oscuro */
                    color: white !important; /* Texto que se escribe en el input */
                    border: 1px solid #0026ff !important; /* Borde morado */
                    border-radius: 10px !important; /* Para que coincida con border-purple */
                }
                
                /* Placeholders */
                .form-control.contact-input-custom::placeholder {
                    color: #ccc !important;
                    opacity: 1 !important;
                }
                
                /* Opciones del select (dropdown) */
                .form-select.contact-input-custom option {
                    background-color: #1a1a2e !important;
                    color: white !important;
                }
                
                /* Focus de inputs y selects */
                .form-control.contact-input-custom:focus, 
                .form-select.contact-input-custom:focus {
                    background-color: rgba(255, 255, 255, 0.15) !important;
                    border-color: #0040ff !important;
                    box-shadow: 0 0 0 0.25rem rgba(0, 64, 255, 0.25) !important;
                }

                /* Botones personalizados */
                .btn-purple {
                    background-color: #0177e5e0 !important;
                    color: black !important;
                    border: none !important;
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
                /* Barra de progreso */
                .bg-purple {
                    background-color: #0d48ad !important;
                }
                .progress-bar {
                    background-color: #0177e5e0 !important;
                }
            `}</style>
        </Modal>
    );
}