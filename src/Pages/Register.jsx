// Register.jsx
import React, { useState } from 'react';
import fondoAzuli from '../assets/img/fondo Azul.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function ClienteRegister() {
    let [form, setForm] = useState({
        nombre: '',
        fechaNacimiento: '',
        email: '',
        telefono: '',
        contrasena: '',
        tipo: ''
    });

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/users',);
            alert('Usuario registrado correctamente');
        } catch (err) {
            alert('Error al registrar el usuario');
            console.error(err);
        }
    };

    let categorias = [
        'Belleza', 'Restaurantes', 'Salud', 'Educación', 'Tecnología',
        'Deportes', 'Mascotas', 'Fotografía', 'Bienestar', 'Automotriz', 'Fitness'
    ];

    return (
        <>
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


                    <h2 className="text-center text-white mb-2">Create an Account</h2>
                    <p className="text-center text-light mb-4" style={{ fontSize: '14px' }}>Start your journey with Zitapp</p>
                    <form>
                        <div className="d-flex justify-content-around text-white mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="userType" value="client"
                                />
                                <label className="form-check-label">Client</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="userType" value="business"
                                />
                                <label className="form-check-label">Business</label>
                            </div>
                        </div>

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

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary px-5 rounded-pill">Register</button>
                        </div>
                        <p className="text-center text-white mt-3">
                            Already have an account? <a className="text-info" onClick={() => navigate('/LoginPage')}>Log In</a>
                        </p>
                    </form>
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
                .client-form {
                    max-width: 400px;
                }
            `}</style>
            </div>

        </>
    );
}



