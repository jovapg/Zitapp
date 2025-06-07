import React, { useState, useEffect, useRef } from 'react';

export default function Contactanos({ show, handleClose }) {
    const [step, setStep] = useState(1);
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);

    useEffect(() => {
        if (!window.bootstrap) {
            console.error("Bootstrap JS no está cargado. Asegúrate de incluir bootstrap.bundle.min.js");
            // Puedes añadir una alerta o manejar esto de forma más robusta
            return;
        }

        // Inicializar la instancia de Bootstrap Modal solo una vez por componente
        // OJO: Si el modal ya está en el DOM por un render previo, getOrCreateInstance es más seguro.
        // Pero para el primer montaje, new Modal está bien si no hay conflictos de ID.
        if (!bsModalInstance.current && modalRef.current) {
            bsModalInstance.current = new window.bootstrap.Modal(modalRef.current, {
                backdrop: 'static', // Mantiene el backdrop y evita cierre con click fuera
                keyboard: false     // Evita cierre con ESC
            });

            // Listener para cuando el modal se oculta (ej. clic en la X del modal).
            modalRef.current.addEventListener('hidden.bs.modal', handleClose);
        }

        // Sincronizar la visibilidad del modal con el prop 'show'
        if (bsModalInstance.current) {
            if (show) {
                bsModalInstance.current.show();
            } else {
                bsModalInstance.current.hide();
            }
        }

        // Limpieza: destruir la instancia del modal y remover listener
        return () => {
            if (bsModalInstance.current) {
                // Si el modal está aún visible al desmontar, ocúltalo primero para evitar errores
                if (bsModalInstance.current._isShown) {
                    bsModalInstance.current.hide();
                }
                bsModalInstance.current.dispose();
                bsModalInstance.current = null;
            }
            if (modalRef.current) {
                modalRef.current.removeEventListener('hidden.bs.modal', handleClose);
            }
        };
    }, [show, handleClose]); // Dependencias: `show` para controlar el modal, `handleClose` para el listener

    useEffect(() => {
        if (show) {
            setStep(1); // Reiniciar el paso al abrir el modal
        }
    }, [show]);

    return (
        <>
            <div
                className="modal fade" // CLASES ORIGINALES DE BOOTSTRAP
                id="contactModal" // ID original
                tabIndex="-1"
                aria-labelledby="contactModalLabel"
                aria-hidden="true"
                ref={modalRef} // Referencia para JS de Bootstrap
            >
                <div className="modal-dialog modal-lg modal-dialog-centered"> {/* CLASES ORIGINALES */}
                    <div className="modal-content rounded-4 p-3"> {/* CLASES ORIGINALES */}
                        <div className="modal-header">
                            <h5 className="modal-title text-white" id="contactModalLabel">¡Conversemos!</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body"> {/* El color de texto se controlará con CSS */}
                            <div className="row">
                                <div className="col-md-5 d-none d-md-block">
                                    <img src='https://i.pinimg.com/736x/77/37/b4/7737b4798afbbbb10514a9866ed9d91e.jpg' alt="Contacto" className="img-fluid rounded-4 h-100" />
                                </div>
                                <div className="col-md-7">
                                    {step === 1 && (
                                        <div>
                                            <h4 className="fw-bold mb-2">Ponte en contacto</h4>
                                            <p>Nos encantaría escucharte. Llena el formulario y nos pondremos en contacto contigo lo antes posible.</p>
                                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                                <div className="row mb-3">
                                                    <div className="col">
                                                        <input type="text" className="form-control contact-input-custom" placeholder="Nombre*" required />
                                                    </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control contact-input-custom" placeholder="Apellidos" />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <input type="email" className="form-control contact-input-custom" placeholder="Correo*" required />
                                                </div>
                                                <div className="mb-3 d-flex">
                                                    <select className="form-select contact-input-custom me-2" style={{ maxWidth: '80px' }}>
                                                        <option value="+57" defaultValue>+57</option>
                                                        <option value="+1">+1</option>
                                                        <option value="+52">+52</option>
                                                    </select>
                                                    <input type="tel" className="form-control contact-input-custom" placeholder="Número de teléfono" />
                                                </div>
                                                <div className="mb-3">
                                                    <select className="form-select contact-input-custom" required>
                                                        <option value="" disabled defaultValue>¿Cómo conociste el sitio web?</option>
                                                        <option value="Google">Google</option>
                                                        <option value="Redes Sociales">Redes Sociales</option>
                                                        <option value="Recomendacion">Recomendación</option>
                                                        <option value="Publicidad">Publicidad</option>
                                                    </select>
                                                </div>
                                                <div className="progress mb-3" style={{height: '5px'}}>
                                                    <div className="progress-bar bg-purple" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <button type="submit" className="btn btn-purple w-100">Siguiente</button>
                                            </form>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado!'); handleClose(); }}>
                                            <div className="mb-3">
                                                <label className="form-label">¿Eres cliente o empresa?*</label>
                                                <select className="form-select contact-input-custom" required>
                                                    <option value="Cliente">Cliente</option>
                                                    <option value="Empresa">Empresa</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Motivo del contacto*</label>
                                                <select className="form-select contact-input-custom" required>
                                                    <option value="" disabled defaultValue>Comentarios y sugerencias</option>
                                                    <option value="Informacion general">Información general</option>
                                                    <option value="Quejas y reclamos">Quejas y reclamos</option>
                                                    <option value="Felicitaciones">Felicitaciones</option>
                                                    <option value="Otros">Otros</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Escribe tu mensaje*</label>
                                                <textarea className="form-control contact-input-custom" rows="3" required></textarea>
                                            </div>
                                            <div className="progress mb-3" style={{height: '5px'}}>
                                                <div className="progress-bar bg-purple" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <button type="button" className="btn btn-secondary text-white" onClick={() => setStep(1)}>Anterior</button>
                                                <button type="submit" className="btn btn-purple">Enviar</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ESTILOS CSS INLINE PARA SOBRESCRIBIR BOOTSTRAP */}
            <style>{`
                /* IMPORTANTE: Estas reglas con ID y clases de Bootstrap y !important
                   deben tener la máxima especificidad para funcionar. */

                /* Fondo del modal (backdrop) */
                /* Apuntamos al ID del modal para una especificidad alta */
                #contactModal.modal-backdrop.show { /* Selector combinado para máxima prioridad */
                    background-color: #000 !important; /* Negro sólido */
                    opacity: 0.85 !important; /* Más opaco */
                    z-index: 1040 !important; /* z-index del backdrop de Bootstrap */
                }

                /* El modal en sí */
                #contactModal.modal.fade.show { /* Selector combinado para máxima prioridad */
                    z-index: 1050 !important; /* z-index del modal de Bootstrap, por encima del backdrop */
                }

                /* Contenido del modal */
                #contactModal .modal-content { /* Apuntamos al ID y luego a la clase para especificidad */
                    background-color: #1a1a2e !important; /* ¡Fondo sólido y oscuro! */
                    color: white !important; /* Texto principal del modal en blanco */
                    border: 1px solid rgba(255, 255, 255, 0.2) !important; /* Asegura el borde */
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) !important; /* Asegura la sombra */
                }
                
                /* Colores de texto dentro del modal-body */
                #contactModal .modal-body h4, 
                #contactModal .modal-body p, 
                #contactModal .modal-body label {
                    color: white !important;
                }

                /* Estilo de los inputs y selects PERSONALIZADOS */
                /* Usamos una clase única 'contact-input-custom' para aislarlos */
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

                /* Otros estilos que no necesitan tanta especificidad si no hay conflictos */
                .btn-close-white {
                    filter: invert(1) brightness(200%) !important; /* Hace la X blanca y más visible */
                }
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
                /* Eliminado .border-purple ya que contact-input-custom lo maneja */
                .bg-purple {
                    background-color: #0d48ad !important;
                }
                .progress-bar {
                  background-color: #0177e5e0 !important;
                }
            `}</style>
        </>
    );
}