// src/main/jsx/components/LoginPage.jsx (o donde tengas tu archivo)

import React from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import fondologin from "../assets/img/LOGO Zitapp.png";
import fondoAzuli from "../assets/img/fondo_azul_editado.png";

//hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [contrasena, setPassword] = useState("");
  let [error, setError] = useState("");

  let handleLogin = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página al enviarlo
    setError(""); // Limpiar error previo

    try {
      let response = await axios.post("http://localhost:8081/api/users/login", {
        email: email,
        contrasena: contrasena,
      });

      let userData = response.data; // Renombrado a userData para mayor claridad

      if (response.status === 200) {
        // Guardas la info común del usuario logueado (ahora con businessId si es negocio)
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.tipo === "CLIENTE") {
          navigate("/HomePageuser");
        } else if (userData.tipo === "NEGOCIO") {
          // 🔥 CAMBIO CLAVE AQUÍ: Accedemos directamente a userData.businessId
          // Ya no necesitamos hacer una SEGUNDA petición a /api/business/user/{id}
          
          if (userData.businessId) {
            localStorage.setItem("negocioId", userData.businessId.toString());
            navigate("/HomePageNegocio");
          } else {
            // Manejar el caso si el usuario es NEGOCIO pero no tiene businessId (debería ser raro si la BD es consistente)
            setError("Error: Usuario de negocio sin negocio asociado. Contacte al administrador.");
            console.error("Usuario NEGOCIO sin businessId en la respuesta de login:", userData);
          }
        }
      } else {
        // Este bloque se ejecuta si el status no es 200 (ej. 401, aunque Axios lanza error para 4xx/5xx)
        setError("Correo o contraseña incorrectos");
      }
    } catch (error) {
      // Este bloque captura errores de red o códigos de estado de error (4xx, 5xx)
      if (error.response) {
        // El servidor respondió con un código de estado de error
        if (error.response.status === 401) {
          setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
        } else if (error.response.status === 500) {
          // Este 500 ya no debería ocurrir en el login si los cambios en Java están correctos
          setError("Error interno del servidor al procesar el login.");
        } else {
          setError(`Error: ${error.response.status} - ${error.response.data.message || error.response.statusText || 'Error desconocido'}`);
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta (ej. backend no corre)
        setError("No se pudo conectar con el servidor. Verifica que el backend esté funcionando.");
      } else {
        // Algo más ocurrió al configurar la petición
        setError("Error al enviar la petición de login.");
      }
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <>
      <div
        className="login-page d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${fondoAzuli})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="login-container row rounded-4 overflow-hidden">
          {/* Left panel */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-4 glass-panel">
            <img
              src={fondologin}
              alt="login icon"
              className="img-fluid mt-2"
              style={{ width: "190px" }}
            />
            <h1 className="fw-bold fs-4 mb-2">ZITAPP</h1>
            <h2 className="fw-bold fs-3 mb-1">Iniciar sesión</h2>
            <p className="text-light mb-3">Tu cuenta</p>
          </div>

          {/* Right panel */}
          <div className="col-md-6 text-white p-5 glass-panel">
            <h3 className="mb-4 fw-semibold">Bienvenido De Nuevo</h3>
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
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
              >
                Iniciar Sesión
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>

            <div className="text-center text-light my-3">or</div>

            <div className="d-grid gap-3">
              <button className="btn btn-dark border d-flex align-items-center justify-content-center gap-2">
                <FaGoogle size={20} />
                Iniciar Sesión Con Google
              </button>
              <button className="btn btn-dark border d-flex align-items-center justify-content-center gap-2">
                <FaApple size={20} />
                Iniciar Sesión Con Apple
              </button>
            </div>

            <p className="mt-4 text-center text-light">
              No tienes cuentat?{" "}
              <a
                className="text-decoration-none text-info"
                onClick={() => navigate("/Register")}
              >
                Crear cuenta
              </a>
            </p>
          </div>
        </div>
        <Footer />
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