import { useState, useEffect } from "react";

export default function ModalUser({ users, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    telefono: "",
    tipo: "",
    imagenPerfil: "",
    edad: "",
  });

  useEffect(() => {
    setFormData({
      nombre: users?.nombre || "",
      email: users?.email || "",
      contrasena: users?.contrasena || "",
      telefono: users?.telefono || "",
      tipo: users?.tipo || "cliente",
      imagenPerfil: users?.imagenPerfil || "",
      edad: users?.edad || "",
    });
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modaluserLabel"
      onClick={onClose} // cerrar modal si clic afuera
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modaluserLabel">
                {users ? "Editar usuario" : "Crear usuario"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contrasena" className="form-label">
                  Contraseña
                </label>
                <input
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imagenPerfil" className="form-label">
                  imagenPerfil
                </label>
                <input
                  id="imagenPerfil"
                  name="imagenPerfil"
                  value={formData.imagenPerfil}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="edad" className="form-label">
                  Edad
                </label>
                <input
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">
                  Tipo
                </label>
                <select
                  name="tipo"
                  id="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-select"
                  aria-label="Seleccionar tipo de usuario"
                  required
                >
                  <option value="">-- Seleccione un tipo --</option>
                  <option disabled>──────────</option>{" "}
                  {/* línea separadora solo visual */}
                  <option value="ADMIN">Admin</option>
                  <option value="CLIENTE">Cliente</option>
                  <option value="NEGOCIO">Negocio</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
