import React from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import fondologin from "../assets/img/logo.png";
import fondoAzuli from "../assets/img/fondo Azul.png";

export default function LoginAdmin() {
  const navigate = useNavigate();

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
            <h2 className="fw-bold fs-3 mb-1">Log in</h2>
          </div>

          {/* Right panel */}
          <div className="col-md-6 text-white p-5 glass-panel">
            <h3 className="mb-4 fw-semibold">Welcome Back</h3>
            <form>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control custom-input"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control custom-input"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Sign In
              </button>
              <button
                className="btn btn-secondary w-100 mb-3"
                onClick={() => navigate("/Dashboard")}
              >
                TestLogin
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
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

        a.text-info:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
