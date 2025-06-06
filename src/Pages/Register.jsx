// Register.jsx
import React, { useState } from 'react';
import fondoAzuli from '../assets/img/fondo_azul_editado.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function ClienteRegister() {
    let navigate = useNavigate();
    let [nombre, setNombre] = useState('')
    let [email, setEmail] = useState('')
    let [telefono, setTelefono] = useState('')
    let [contrasena, setContrasena] = useState('')
    let [tipo, setTipo] = useState('')

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
            let response = await axios.post('http://localhost:8081/api/users',{ //Envia los datos a la API
                nombre: nombre,
                email: email,
                telefono: telefono,
                contrasena: contrasena,
                tipo: tipo
            });
            alert('Usuario registrado correctamente');
            console.log(response.data);
            navigate('/LoginPage');
        } catch (err) {
            alert('Error al registrar el usuario');
            console.error(err);
        }
    };

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


                    <h2 className="text-center text-white mb-2">Crear una cuenta</h2>
                    <p className="text-center text-light mb-4" style={{ fontSize: '14px' }}>Comienza tu viaje con Zitapp</p>

                    <form onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-around text-white mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="tipo"
                                    value="CLIENTE"
                                    checked={tipo === 'CLIENTE'}
                                    onChange={(e) => setTipo(e.target.value)}
                                />
                                <label className="form-check-label">Cliente</label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio" 
                                    name="tipo"
                                    value="NEGOCIO"
                                    checked={tipo === 'NEGOCIO'}
                                    onChange={(e) => setTipo(e.target.value)}
                                />
                                <label className="form-check-label">Negocio</label>
                            </div>
                        </div>

                        <div className="client-form mx-auto">
                            <input type="text" name="nombre" className="form-control bg-dark text-white mb-3" placeholder="Full Name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            <input type="email" name="email" className="form-control bg-dark text-white mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type="tel" name="telefono" className="form-control bg-dark text-white mb-3" placeholder="Phone Number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                            <input type="password" name="contrasena" className="form-control bg-dark text-white mb-3" placeholder="Password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                        </div>

                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary px-5 rounded-pill">Registrar</button>
                        </div>
                        <p className="text-center text-white mt-3">
                            ¿Ya tienes una cuenta? <a className="text-info" onClick={() => navigate('/LoginPage')}>Acceso</a>
                        </p>
                    </form>
                </div>

                <style >{`
                .form-control::placeholder {
                    color: rgba(33, 22, 22, 0.7) !important;
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


