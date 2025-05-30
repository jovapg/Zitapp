import { useState } from 'react';



export default function Contactanos() {
    const [step, setStep] = useState(1);
    return (
        <>
            <div
                className="modal fade"
                id="contactModal"
                tabIndex="-1"
                aria-labelledby="contactModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content rounded-4 p-3" style={{ backgroundColor: '#02021df1' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">¡Conversemos!</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {/* Imagen */}
                                <div className="col-md-5 d-none d-md-block">
                                    <img src='https://i.pinimg.com/736x/77/37/b4/7737b4798afbbbb10514a9866ed9d91e.jpg' alt="Contacto" className="img-fluid rounded-4 h-100" />
                                    
                                </div>

                                {/* Formulario */}
                                <div className="col-md-7">
                                    {step === 1 && (
                                        <div>
                                            <h4 className="fw-bold mb-2">Ponte en contacto</h4>
                                            <p>Nos encantaría escucharte. Llena el formulario y nos pondremos en contacto contigo lo antes posible.</p>

                                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                                <div className="row mb-3">
                                                    <div className="col">
                                                        <input type="text" className="form-control border-purple" placeholder="Nombre*" required />
                                                    </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control border-purple" placeholder="Apellidos" />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <input type="email" className="form-control border-purple" placeholder="Correo*" required />
                                                </div>
                                                <div className="mb-3 d-flex">
                                                    <select className="form-select border-purple me-2" style={{ maxWidth: '80px' }}>
                                                        <option defaultValue>+57</option>
                                                        <option>+1</option>
                                                        <option>+52</option>
                                                    </select>
                                                    <input type="tel" className="form-control border-purple" placeholder="Número de teléfono" />
                                                </div>
                                                <div className="mb-3">
                                                    <select className="form-select border-purple" required>
                                                        <option disabled defaultValue>¿Cómo conociste el sitio web?</option>
                                                        <option>Google</option>
                                                        <option>Redes Sociales</option>
                                                        <option>Recomendación</option>
                                                        <option>Publicidad</option>
                                                    </select>
                                                </div>
                                                <div className="progress mb-3">
                                                    <div className="progress-bar bg-purple" role="progressbar" style={{ width: '50%' }}></div>
                                                </div>
                                                <button type="submit" className="btn btn-purple w-100">Siguiente</button>
                                            </form>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={(e) => { e.preventDefault(); /* Aquí podrías manejar el envío */ }}>
                                            <div className="mb-3">
                                                <label>¿Eres cliente o empresa?*</label>
                                                <select className="form-select" required>
                                                    <option>Cliente</option>
                                                    <option>Empresa</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label>Motivo del contacto*</label>
                                                <select className="form-select border-purple" required>
                                                    <option disabled defaultValue>Comentarios y sugerencias</option>
                                                    <option>Información general</option>
                                                    <option>Quejas y reclamos</option>
                                                    <option>Felicitaciones</option>
                                                    <option>otros</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label>Escribe tu mensaje*</label>
                                                <textarea className="form-control" rows="3" required></textarea>
                                            </div>
                                            <div className="progress mb-3">
                                                <div className="progress-bar w-100"></div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Anterior</button>
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

            <style>{`
 /* Modal */
   .btn-purple {
       background-color: #0177e5e0;
       color: black;
   }

   .btn-purple:hover {
       background-color: #006aff;
   }

   .border-purple {
       border: 1px solid #0026ff !important;
       border-radius: 10px;
   }

   .bg-purple {
       background-color: #0d48ad !important;
   }
    `}</style>
        </>
    )
}
