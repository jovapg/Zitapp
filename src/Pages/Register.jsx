import React, { useState } from 'react';
import fondoAzuli from '../assets/img/fondo Azul.png';

export default function Register() {
    let [userType, setUserType] = useState('');
    let [step, setStep] = useState(0); // 0 = formulario, 1 = preguntas business, 2 = tarjeta extra
    let [selectedCategory, setSelectedCategory] = useState([]);
    let businessCategories = ['Estética', 'Restaurantes', 'Salud', 'Educación', 'Tecnología', 'Deportes', 'Mascotas', 'Fotografía', 'Bienes Raices'];

    let toggleCategory = (category) => {
        if (selectedCategory.includes(category)) {
            setSelectedCategory(selectedCategory.filter(c => c !== category));
        } else {
            setSelectedCategory([...selectedCategory, category]);
        }
    };

    let businessQuestions = (
        <div className="text-white text-center">
            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="mb-2">Nombre del negocio</h5>
                <input className="form-control bg-dark text-white" placeholder="Nombre del negocio" required />
            </div>

            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="mb-2">¿Categoría se encuentra?</h5>
                <select className="form-select bg-dark text-white">
                    <option>Estética</option>
                    <option>Restaurantes</option>
                    <option>Salud</option>
                    <option>Educación</option>
                    <option>Tecnología</option>
                    <option>Deportes</option>
                    <option>Bienes Raíces</option>
                </select>
            </div>

            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="mb-2">¿Negocio en funcionamiento?</h5>
                <select className="form-select bg-dark text-white">
                    <option>SÍ</option>
                    <option>NO</option>
                </select>
            </div>

            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="mb-2">Dirección o ubicación</h5>
                <input type="text" className="form-control bg-dark text-white" placeholder="Address" />
            </div>

            <div className="d-flex justify-content-between px-4 mt-4">
                <button className="btn btn-secondary" onClick={() => setStep(0)}>Volver</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Siguiente</button>
            </div>
        </div>
    );


    let businessCardExtra = (
        <>
            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="text-white text-center mb-4">¿Te gustaría subir el logo de tu negocio?</h5>
                <input type="file" className="form-control bg-dark text-white mb-3" />

            </div>


            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="text-white text-center mb-4">¿Qué horarios de atención manejas?</h5>
                <input type="text" className="form-control bg-dark text-white mb-3" />

            </div>

            <div className="mx-auto mb-4" style={{ maxWidth: '300px' }}>
                <h5 className="text-white text-center mb-4"> ¿Te interesa que tu negocio aparezca en recomendaciones para clientes?</h5>
                <select className="form-select bg-dark text-white mb-3">
                    <option>SI</option>
                    <option>No</option>

                </select>
            </div>

            <div className="d-flex justify-content-between">
                <button className="btn btn-secondary px-6 rounded-pill" onClick={() => setStep(1)}>Volver</button>
                <button className="btn btn-outline-light">Omitir o responder más tarde</button>

                <button type="submit" className="btn btn-primary px-6 rounded-pill">Register</button>

            </div>
        </>
    );

    return (
        <div className="container-fluid register-bg d-flex justify-content-center align-items-center"
            style={{
                backgroundImage: `url(${fondoAzuli})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh'
            }}>
            <div className="card register-card shadow-lg p-4"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    borderRadius: '25px',
                    backdropFilter: 'blur(10px)',
                    maxWidth: '500px',
                    width: '100%',
                }}>
                {step === 0 && (
                    <>
                        <h2 className="text-center text-white mb-2">Create an Account</h2>
                        <p className="text-center text-light mb-4" style={{ fontSize: '14px' }}>Start your journey with Zitapp</p>
                        <form>
                            <div className="">
                                <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Full Name" required />

                            </div>
                            <input type="date" className="form-control bg-dark text-white mb-3" placeholder="Date of Birth" required />
                            <input type="email" className="form-control bg-dark text-white mb-3" placeholder="Email" required />
                            <input type="tel" className="form-control bg-dark text-white mb-3" placeholder="Phone Number" required />
                            <input type="password" className="form-control bg-dark text-white mb-3" placeholder="Password" required />

                            <div className="d-flex justify-content-around text-white mb-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="userType" value="client"
                                        checked={userType === 'client'} onChange={() => setUserType('client')} />
                                    <label className="form-check-label">Client</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="userType" value="business"
                                        checked={userType === 'business'} onChange={() => { setUserType('business'); setStep(1); }} />
                                    <label className="form-check-label">Business</label>
                                </div>
                            </div>

                            {userType === 'client' && (
                                <>
                                    <h5 className="text-white text-center mb-3">What kind of businesses would you like to know?</h5>
                                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                                        {businessCategories.map((category, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`btn btn-outline-primary rounded-pill px-3 ${selectedCategory.includes(category) ? 'active' : ''}`}
                                                onClick={() => toggleCategory(category)}
                                                style={{
                                                    borderColor: 'cyan',
                                                    color: 'white',
                                                    borderWidth: '1px'
                                                }}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary px-5 rounded-pill">
                                    Register
                                </button>
                            </div>

                            <p className="text-center text-white mt-3">
                                Already have an account? <a href="/login" className="text-info">Log In</a>
                            </p>
                        </form>

                    </>
                )}

                {step === 1 && businessQuestions}
                {step === 2 && businessCardExtra}


            </div>

            <style jsx>{`
                .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    font-weight: 300;
                }
                input.form-control {
                    color: white !important;
                }
                .btn-outline-primary.active {
                    background-color: cyan;
                    color: black;
                }
            `}</style>
        </div>
    );
}
