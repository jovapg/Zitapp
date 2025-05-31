import React from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import fondologin from '../assets/img/LOGO Zitapp.png';
import fondoAzuli from '../assets/img/fondo_azul_editado.png'

//hooks
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function LoginPage() {

    let navigate = useNavigate();
    let [email, setEmail] = useState('')
    let [contrasena, setPassword] = useState('')
    let [error, setError] = useState('')

    let handleLogin = async (e) => {
        e.preventDefault() //Evita que el formulario regargue la pg al enviarlo
        setError('')// Limpiar error previo

        try {
            let response = await axios.post('http://localhost:8081/api/users/login', { //Envia los datos a la API
                email: email,
                contrasena: contrasena
            });

            let data = response.data;
            

            if (response.status === 200) {
                if (data.tipo === 'CLIENTE') {
                    localStorage.setItem("user", JSON.stringify(data));
                    navigate('/HomePageuser');
                } else if (data.tipo === 'NEGOCIO') {
                    localStorage.setItem("user", JSON.stringify(data));
                    navigate('/HomePageNegocio');
                }
            } else {
                setError('Correo o contraseña incorrectos');
            }

        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error(err);
        }
    };

    return (
        <>
            <div
                className="login-page d-flex align-items-center justify-content-center"
                style={{
                    backgroundImage: `url(${fondoAzuli})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',

                }}
            >
                <div className="login-container row rounded-4 overflow-hidden">
                    {/* Left panel */}
                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-4 glass-panel">
                        <img
                            src={fondologin}
                            alt="login icon"
                            className="img-fluid mt-2"
                            style={{ width: '190px' }}
                        />
                        <h1 className="fw-bold fs-4 mb-2">ZITAPP</h1>
                        <h2 className="fw-bold fs-3 mb-1">Log in</h2>
                        <p className="text-light mb-3">to your account</p>

                    </div>

                    {/* Right panel */}
                    <div className="col-md-6 text-white p-5 glass-panel">
                        <h3 className="mb-4 fw-semibold">Welcome Back</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    className="form-control custom-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}

                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="form-control custom-input"
                                    value={contrasena}
                                    onChange={(e) => setPassword(e.target.value)}

                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3"
                            // onClick={() => navigate('/HomePageuser')}
                            >
                                Sign In
                            </button>
                            {error && <p style={{ color: 'red' }}>{error}</p>}

                        </form>

                        <div className="text-center text-light my-3">or</div>

                        <div className="d-grid gap-3">
                            <button className="btn btn-dark border d-flex align-items-center justify-content-center gap-2">
                                <FaGoogle size={20} />
                                Sign in with Google
                            </button>
                            <button className="btn btn-dark border d-flex align-items-center justify-content-center gap-2">
                                <FaApple size={20} />

                                Sign in with Apple
                            </button>
                        </div>

                        <p className="mt-4 text-center text-light">
                            Don’t have an account?{' '}
                            <a className="text-decoration-none text-info"
                                onClick={() => navigate('/Register')}
                            >Create Account</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Estilos personalizados */}
            <style>{`

        .login-container {
          width: 900px;
        }

        .glass-panel {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
        }

        .custom-input {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .custom-input::placeholder {
          color: #bbb;
        }

        .custom-input:focus {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          box-shadow: none;
        }

        a.text-info:hover {
          text-decoration: underline;
        }
      `}</style>
        </>
    );
}
