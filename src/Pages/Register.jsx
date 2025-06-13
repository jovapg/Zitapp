import React, { useState, useRef } from 'react';
import fondoAzuli from '../assets/img/fondo_azul_editado.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

// ✅ Componente reutilizable para nombre, email, teléfono, contraseña
function FormularioUsuario({ email, setEmail, contrasena, setContrasena }) {
    return (
        <div className="client-form mx-auto">
            <input
                type="email"
                name="email"
                className="form-control bg-dark text-white mb-3"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)} required
            />

            <input
                type="password"
                name="contrasena"
                className="form-control bg-dark text-white mb-3"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)} required
            />
        </div>
    );
}

export default function ClienteRegister() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [tipo, setTipo] = useState('');
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [negocioData, setNegocioData] = useState({
        nombre: '',
        imagen_url: '',
        categoria: '',
        descripcion: '',
        direccion: '',
        telefono: ''
    });


    const [previewUrl, setPreviewUrl] = useState(''); // Para imagen subida desde el equipo
    const [fileSelected, setFileSelected] = useState(false); // Bandera para controlar subida de archivos
    const fileInputRef = useRef(null); // Referencia para resetear el input file

    const opcionesRecomendaciones = [
        'Belleza', 'Fitness', 'Salud', 'Recreación', 'Alimentación',
        'Finanzas', 'Bienes raíces', 'Hogar', 'Educación'
    ];

    const toggleRecomendacion = (opcion) => {
        if (recomendaciones.includes(opcion)) {
            setRecomendaciones(recomendaciones.filter(r => r !== opcion));
        } else {
            if (recomendaciones.length < 5) {
                setRecomendaciones([...recomendaciones, opcion]);
            } else {
                alert('Puedes seleccionar hasta 5 opciones.');
            }
        }
    };

    const handleClienteSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/users', {
                nombre,
                email,
                telefono,
                contrasena,
                tipo
            });
            alert('Usuario registrado correctamente');
            navigate('/LoginPage');
        } catch (err) {
            alert('Error al registrar el usuario');
            console.error(err);
        }
    };

    const handleNegocioSubmit = async () => {
        try {
            const data = {
                nombre: negocioData.nombre,
                imagen_url: previewUrl || negocioData.imagen_url,
                categoria: negocioData.categoria,
                descripcion: negocioData.descripcion,
                direccion: negocioData.direccion,
                telefono: negocioData.telefono
            };
            await axios.post('http://localhost:8081/api/businesses', data);
            alert('Negocio registrado con éxito');
            navigate('/LoginPage');
        } catch (error) {
            alert('Error al registrar negocio');
            console.error(error);
        }
    };
    const handleSubmit = () => {
        handleNegocioSubmit();
        handleClienteSubmit();
    };

    const [negocioImg, setNegocioImg] = useState({ imagen_url: "" });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setNegocioData({ ...negocioData, imagen_url: "" }); // Borra URL si se sube imagen
                setFileSelected(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const eliminarImagen = () => {
        setPreviewUrl("");
        setNegocioData({ ...negocioData, imagen_url: "" });
        setFileSelected(false);

        // 🔹 Resetear el campo de carga
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Borra el nombre del archivo
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

                    <form onSubmit={handleClienteSubmit}>
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

                        {(tipo === 'CLIENTE' || tipo === 'NEGOCIO') && (
                            <FormularioUsuario
                                email={email}
                                setEmail={setEmail}
                                contrasena={contrasena}
                                setContrasena={setContrasena}
                            />
                        )}

                        {tipo === 'CLIENTE' && (
                            <>
                                <div className="client-form mx-auto">
                                    <input type="text" name="nombre" className="form-control bg-dark text-white mb-3" placeholder="Full Name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                    <input type="tel" name="telefono" className="form-control bg-dark text-white mb-3" placeholder="Phone Number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                </div>
                                <h5 className="text-white mb-2 text-center">¿Qué recomendaciones te gustaría recibir?</h5>
                                <div className="d-flex flex-wrap justify-content-center" style={{ gap: "16px", maxWidth: "600px", margin: "0 auto" }}>


                                    {opcionesRecomendaciones.map((opcion) => (
                                        <button
                                            type="button"
                                            key={opcion}
                                            className={`btn btn-sm ${recomendaciones.includes(opcion) ? 'btn-info' : 'btn-outline-info'}`}
                                            onClick={() => toggleRecomendacion(opcion)}
                                        >
                                            {opcion}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-light mt-2 text-center" style={{ fontSize: '12px' }}>
                                    Puedes seleccionar hasta 5 opciones
                                </p>

                                <div className="d-flex justify-content-center mt-3">
                                    <button type="submit" className="btn btn-primary px-5 rounded-pill">Registrar</button>
                                </div>
                            </>
                        )}

                        {tipo === 'NEGOCIO' && (
                            <>
                                <h5 className="text-white text-center mb-3">Registra tu negocio</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Nombre del negocio *"
                                            value={negocioData.nombre}
                                            onChange={(e) => setNegocioData({ ...negocioData, nombre: e.target.value })}
                                            required />

                                        <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Categoría *"
                                            value={negocioData.categoria}
                                            onChange={(e) => setNegocioData({ ...negocioData, categoria: e.target.value.toUpperCase() })}
                                            required />

                                        <input type="tel" className="form-control bg-dark text-white mb-3" placeholder="Teléfono *"
                                            value={negocioData.telefono}
                                            onChange={(e) => setNegocioData({ ...negocioData, telefono: e.target.value })}
                                            required />

                                        <input type="text" className="form-control bg-dark text-white mb-3" placeholder="Dirección *"
                                            value={negocioData.direccion}
                                            onChange={(e) => setNegocioData({ ...negocioData, direccion: e.target.value })}
                                            required />
                                        <textarea className="form-control bg-dark text-white" placeholder="Descripción (máx. 500 palabras)"
                                            maxLength={500}
                                            rows={5}
                                            value={negocioData.descripcion}
                                            onChange={(e) => setNegocioData({ ...negocioData, descripcion: e.target.value })}></textarea>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Input para ingresar URL de imagen */}
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white mb-2"
                                            placeholder="Logo URL"
                                            value={negocioData.imagen_url}
                                            onChange={(e) => {
                                                setNegocioData({ ...negocioData, imagen_url: e.target.value });
                                                if (e.target.value) setFileSelected(false); // Deshabilitar archivo si hay URL
                                            }}
                                            disabled={fileSelected} // Se deshabilita si hay imagen subida
                                        />

                                        <div className="text-white my-2">O subir desde tu equipo</div>

                                        {/* Input para cargar imagen desde el equipo */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control mb-2"
                                            onChange={handleFileChange}
                                            disabled={negocioData.imagen_url} // Se deshabilita si hay URL escrita
                                            ref={fileInputRef} // 🔹 Agregar referencia
                                        />

                                        {/* Vista previa de la imagen */}
                                        {(previewUrl || negocioData.imagen_url) && (
                                            <div className="text-center mb-2">
                                                <img
                                                    src={negocioData.imagen_url || previewUrl}
                                                    alt="Vista previa"
                                                    style={{ width: '100px', height: '140px', objectFit: 'cover' }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                                <button type="button" className="btn btn-sm btn-danger mt-2" onClick={eliminarImagen}>
                                                    Eliminar Imagen
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-center mt-4">
                                        <button type="button" className="btn btn-primary px-5 rounded-pill" onClick={handleNegocioSubmit}
                                        >
                                            Registrar
                                        </button>
                                    </div>
                                </div>


                            </>
                        )}

                        <p className="text-center text-white mt-3">
                            ¿Ya tienes una cuenta? <a className="text-info" onClick={() => navigate('/LoginPage')}>Acceso</a>
                        </p>
                    </form>
                </div>
            </div>

            <Footer />

            <style>{`
                .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    font-weight: 300;
                }
                .client-form {
                    max-width: 400px;
                }
            `}</style>
        </>
    );
}
