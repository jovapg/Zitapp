import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondologin from "../assets/img/logo.png";
import fondoAzuli from "../assets/img/fondo_azul_editado.png";
import axios from "axios";
import Footer from '../components/Footer';


export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/api/users/login", {
        email: email,
        contrasena: password,
      });

      const user = response.data;

      if (user.tipo === "ADMIN") {
        // 🟢 Guardar sesión en localStorage
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/Dashboard");
      } else {
        alert("Acceso denegado. Solo los administradores pueden ingresar.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas o error del servidor.");
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
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-4 glass-panel">
            <img src={fondologin} alt="login icon" className="img-fluid mt-2" style={{ width: "190px" }} />
            <h1 className="fw-bold fs-4 mb-2">ZITAPP</h1>
            <h2 className="fw-bold fs-3 mb-1">Inicio de Sesión</h2>
          </div>

          <div className="col-md-6 text-white p-5 glass-panel">
            <h3 className="mb-4 fw-semibold">Bienvenido de vuelta</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control custom-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control custom-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
        <Footer />


      <style jsx>{`
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
      `}</style>
    </>
  );
}
