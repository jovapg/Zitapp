import React, { useState, useEffect } from "react";

export default function ModalCitas({ show, onClose, onSave, cita }) {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    clientId: "",
    businessId: "",
    estado: "PENDIENTE",
  });

  const [loading, setLoading] = useState(false); // Estado para controlar el spinner

  // Si estamos editando una cita, precargar datos
  useEffect(() => {
    if (cita) {
      setFormData({
        fecha: cita.fecha || "",
        hora: cita.hora || "",
        clientId: cita.client?.id || "",
        businessId: cita.business?.id || "",
        estado: cita.estado || "PENDIENTE",
      });
    } else {
      setFormData({
        fecha: "",
        hora: "",
        clientId: "",
        businessId: "",
        estado: "PENDIENTE",
      });
    }
  }, [cita]);

  // Captura cambios del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // Enviar cita
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.fecha || !formData.hora || !formData.clientId || !formData.businessId) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true); // Muestra spinner
    try {
      await onSave({
        fecha: formData.fecha,
        hora: formData.hora,
        estado: formData.estado,
        client: { id: parseInt(formData.clientId, 10) },
        business: { id: parseInt(formData.businessId, 10) },
      });
    } catch (err) {
      alert("Error al guardar la cita.");
    } finally {
      setLoading(false); // Oculta spinner
    }
  };

  if (!show) return null; // Si el modal no debe mostrarse, no renderizar

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{cita ? "Editar Cita" : "Crear Cita"}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input type="date" className="form-control" name="fecha" value={formData.fecha} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Hora</label>
                <input type="time" className="form-control" name="hora" value={formData.hora} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Cliente ID</label>
                <input type="number" className="form-control" name="clientId" value={formData.clientId} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Negocio ID</label>
                <input type="number" className="form-control" name="businessId" value={formData.businessId} onChange={handleChange} />
              </div>
              {/* Spinner centrado (opcional) */}
              {loading && (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
