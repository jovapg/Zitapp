import React, { useState } from "react";
import axios from "axios";

function ModalLogin({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:8081/api/users/login", {
        email,
        contrasena,
      });
      const user = response.data;
      if (user.tipo !== "NEGOCIO") {
        setError("Solo usuarios de tipo 'NEGOCIO' pueden crear NEGOCIO.");
        setLoading(false);
        return;
      }
      onLoginSuccess(user);
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content p-3">
          <h5>Login para crear negocio</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label>Contraseña:</label>
              <input
                type="password"
                className="form-control"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Validando..." : "Ingresar"}
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;
