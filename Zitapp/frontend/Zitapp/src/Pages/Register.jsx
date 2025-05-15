import React, { useState } from 'react';
import fondoAzuli from '../assets/img/fondo Azul.png';

export default function Register() {
    let [userType, setUserType] = useState('');

    let [selectedCategory, setSelectedCategory] = useState('');

    let businessCategories = [
        'Estética',
        'Restaurantes',
        'Salud',
        'Educación',
        'Tecnología',
        'Deportes',
        'Mascotas',
        'Fotografía'
    ];

    return (
        <>
            <div className="container-fluid register-bg d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: `url(${fondoAzuli})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh'
                }}
            >
                <div className="card register-card shadow-lg p-4"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        borderRadius: '25px',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '450px',
                        width: '100%',
                    }}
                >
                    <h2 className="text-center text-white mb-2">Create an Account</h2>
                    <p className="text-center text-light mb-4" style={{ fontSize: '14px' }}>Start your journey with Zitapp</p>

                    <form>
                        {/** NOMBRE */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                placeholder="Full Name"
                                required
                                style={{ border: '1px solid #444', fontWeight: 300 }}
                            />
                        </div>

                        {/** FECHA */}
                        <div className="mb-3">
                            <input
                                type="date"
                                className="form-control bg-dark text-white"
                                placeholder="Date of Birth"
                                required
                                style={{ border: '1px solid #444', fontWeight: 300 }}
                            />
                        </div>

                        {/** CORREO */}
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control bg-dark text-white"
                                placeholder="Email"
                                required
                                style={{ border: '1px solid #444', fontWeight: 300 }}
                            />
                        </div>

                        {/** TELÉFONO */}
                        <div className="mb-3">
                            <input
                                type="tel"
                                className="form-control bg-dark text-white"
                                placeholder="Phone Number"
                                required
                                style={{ border: '1px solid #444', fontWeight: 300 }}
                            />
                        </div>

                        {/** CONTRASEÑA */}
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control bg-dark text-white"
                                placeholder="Password"
                                required
                                style={{ border: '1px solid #444', fontWeight: 300 }}
                            />
                        </div>

                        {/** RADIOS */}
                        <div className="mb-4 d-flex justify-content-around text-white">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="userType"
                                    value="client"
                                    checked={userType === 'client'}
                                    onChange={() => setUserType('client')}
                                />
                                <label className="form-check-label">Client</label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="userType"
                                    value="business"
                                    checked={userType === 'business'}
                                    onChange={() => setUserType('business')}
                                />
                                <label className="form-check-label">Business</label>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary px-5 rounded-pill">
                                Register
                            </button>
                        </div>


                        <p className="text-center text-white mt-3">
                            Already have an account? <a href="/login" className="text-info">Log In</a>
                        </p>
                    </form>
                </div>
            </div>
            <style jsx>{`
            .form-control::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
                font-weight: 300;
            }

            input[type="date"]::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
            }

            input.form-control {
                color: white !important;
            }
`}</style>


        </>
    );
}
