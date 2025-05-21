// ModalNegocio.jsx
import React, { useState, useEffect } from "react";

function ModalNegocio({ negocio, onClose, onSave }) {
  const [formData, setFormData] = useState({
    categoria: "",
    descripcion: "",
    direccion: "",
    imagenUrl: "",
    nombre: "",
  });

  useEffect(() => {
    setFormData({
      categoria: negocio?.categoria || "",
      descripcion: negocio?.descripcion || "",
      direccion: negocio?.direccion || "",
      imagenUrl: negocio?.imagenUrl || "",
      nombre: negocio?.nombre || "",
    });
  }, [negocio]);

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
      aria-labelledby="modalNegocioLabel"
      onClick={onClose} // cerrar modal si clic afuera
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()} // evitar cerrar modal al clic dentro
      >
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalNegocioLabel">
                {negocio ? "Editar Negocio" : "Crear Negocio"}
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
                <label htmlFor="categoria" className="form-label">
                  Categoría
                </label>
                <input
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imagenUrl" className="form-label">
                  URL Imagen
                </label>
                <input
                  id="imagenUrl"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleChange}
                  className="form-control"
                  type="url"
                  required
                />
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

export default ModalNegocio;
