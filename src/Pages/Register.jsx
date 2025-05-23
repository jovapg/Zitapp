import React, { useState } from 'react';
import fondoAzuli from '../assets/img/fondo Azul.png';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function Register() {
    let { register, handleSubit } = useForm();
    let onSubmited = (data) => {
        console.log(data)
    }

    let navigate = useNavigate();
    let [servicios, setServicios] = useState(['']);
    let [showSuccessModal, setShowSuccessModal] = useState(false);
    let [horarios, setHorarios] = useState({
        lunes: { inicio: '', fin: '' },
        martes: { inicio: '', fin: '' },
        miercoles: { inicio: '', fin: '' },
        jueves: { inicio: '', fin: '' },
        viernes: { inicio: '', fin: '' },
        sabado: { inicio: '', fin: '' },
        domingo: { inicio: '', fin: '' },
    });

    let handleServicioChange = (index, value) => {
        let nuevosServicios = [...servicios];
        nuevosServicios[index] = value;
        setServicios(nuevosServicios);
    };

    let agregarServicio = () => {
        setServicios([...servicios, '']);
    };

    let handleHorarioChange = (dia, campo, valor) => {
        setHorarios(prev => ({
            ...prev,
            [dia]: {
                ...prev[dia],
                [campo]: valor
            }
        }));
    };

    let [userType, setUserType] = useState('');
    let [step, setStep] = useState(0);
    let [selectedCategory, setSelectedCategory] = useState([]);
    let businessCategories = ['Belleza', 'Restaurantes', 'Salud', 'Educación', 'Tecnología', 'Deportes', 'Mascotas', 'Fotografía', 'Bienes Raices', 'Bienestar', 'Automotriz', 'Fitness'];

    let toggleCategory = (category) => {
        if (selectedCategory.includes(category)) {
            setSelectedCategory(selectedCategory.filter(c => c !== category));
        } else {
            setSelectedCategory([...selectedCategory, category]);
        }
    };

    let handleBusinessRegister = () => {
        let businessData = {
            servicios: servicios,
            horarios: horarios,
        };

        let existingBusinesses = JSON.parse(localStorage.getItem('businesses')) || [];
        existingBusinesses.push(businessData);
        localStorage.setItem('businesses', JSON.stringify(existingBusinesses));

        setShowSuccessModal(true);
    };

    let handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate('/LoginPage');
    };

    let businessQuestions = (
        <div className="text-white">
            <h2 className="text-center mb-4">Regístrate</h2>
            <div className="container">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>Nombre del negocio</label>
                        <input
                            className="form-control bg-dark text-white"
                            type='text'
                            {...register("nombre")}
                            placeholder="Nombre del negocio"
                            required />
                    </div>
                    <div className="col-md-6">
                        <label>Categoría del negocio</label>
                        <select className="form-select bg-dark text-white">
                            {businessCategories.map((cat, index) => (
                                <option
                                    key={index}>{cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-8">
                        <label>Describe tu negocio</label>
                        <textarea className="form-control bg-dark text-white" placeholder="Escribe una descripción..." rows="5" />
                    </div>
                    <div className="col-md-4">
                        <label>Imagen de perfil</label>
                        <input type="text" className="form-control bg-dark text-white" placeholder="Url de la imagen" />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>Coordenadas de tu negocio</label>
                        <input type="text" className="form-control bg-dark text-white" placeholder=" coordenadass de tu negocio ej:6.2610634, -75.445731 " />
                    </div>
                    <div className="col-md-6">
                        <label>Servicios que prestas</label>
                        {servicios.map((servicio, index) => (
                            <div key={index} className="d-flex mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-dark text-white me-2"
                                    placeholder={`Servicio ${index + 1}`}
                                    value={servicio}
                                    onChange={(e) => handleServicioChange(index, e.target.value)}
                                />
                                {index === servicios.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={agregarServicio}
                                        className="btn btn-primary"
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-secondary" onClick={() => setStep(0)}>Volver</button>
                    <button className="btn btn-primary" onClick={() => setStep(2)}>Siguiente</button>
                </div>
            </div>
        </div>
    );

    let businessCardExtra = (
        <>
            <div className="row mb-4">
                <div className="col-md-6">
                    <h5 className="text-white mb-2">¿Te gustaría subir el logo de tu negocio?</h5>
                    <input type="file" className="form-control bg-dark text-white" />

                    <hr /><hr /><hr />
                    <div className="md-8">
                        <h5 className="text-white mb-2">¿Quieres que tu negocio aparezca en recomendaciones?</h5>
                        <select className="form-select bg-dark text-white">
                            <option>SI</option>
                            <option>No</option>
                        </select>

                    </div>

                </div>
                <div className="col-md-6">
                    <h5 className="text-white mb-2">¿Qué horarios de atención manejas?</h5>
                    {Object.keys(horarios).map((dia, index) => (
                        <div key={index} className="row mb-2 text-white align-items-center">
                            <div className="col-4 text-capitalize">{dia}</div>
                            <div className="col-4">
                                <input
                                    type="time"
                                    className="form-control bg-dark text-white"
                                    value={horarios[dia].inicio}
                                    onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
                                />
                            </div>
                            <div className="col-4">
                                <input
                                    type="time"
                                    className="form-control bg-dark text-white"
                                    value={horarios[dia].fin}
                                    onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>


                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-secondary px-4 rounded-pill" onClick={() => setStep(1)}>Volver</button>
                    <button
                        type="submit"
                        className="btn btn-primary px-4 rounded-pill"
                        onClick={handleBusinessRegister}
                    >
                        CREAR CUENTA</button>
                </div>
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

            <div className="card register-card shadow-lg p-4 w-100 mx-3"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    borderRadius: '25px',
                    backdropFilter: 'blur(10px)',
                    maxWidth: '1100px'
                }}>
                {step === 0 && userType === '' && (
                    <>
                        <h2 className="text-center text-white mb-2">Create an Account</h2>
                        <p className="text-center text-light mb-4" style={{ fontSize: '14px' }}>Start your journey with Zitapp</p>
                        <form>
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
                        </form>
                    </>
                )}

                {userType === 'client' && step === 0 && (
                    <>
                        <form>
                            <div className="client-form mx-auto">

                                <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Full Name" />
                                {/* required */}
                                <input type="date" className="form-control bg-dark text-white mb-3" placeholder="Date of Birth" />
                                {/* required */}
                                <input type="email" className="form-control bg-dark text-white mb-3" placeholder="Email" />
                                {/* required */}
                                <input type="tel" className="form-control bg-dark text-white mb-3" placeholder="Phone Number" />
                                {/* required */}
                                <input type="password" className="form-control bg-dark text-white mb-3" placeholder="Password" />
                                {/* required */}

                            </div>

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

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary px-5 rounded-pill">Register</button>
                            </div>
                            <p className="text-center text-white mt-3">
                                Already have an account? <a className="text-info" onClick={() => navigate('/LoginPage')}>Log In</a>
                            </p>
                        </form>
                    </>
                )}

                {step === 1 && businessQuestions}
                {step === 2 && businessCardExtra}
            </div>

            <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
                <Modal.Body className="text-center">
                    <div style={{ fontSize: '3rem', color: 'green' }}>✔️</div>
                    <h5 className="mt-3">Registro realizado con éxito</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseModal}>Aceptar</Button>
                </Modal.Footer>
            </Modal>

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
                .client-form {
                    max-width: 400px;
                }
            `}</style>
        </div>
    );
}