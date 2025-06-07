import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ModalServicio({ negocioId, onClose, onSave }) {
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");

  useEffect(() => {
    if (negocioId) {
      fetchServicios();
      limpiarFormulario();
    }
  }, [negocioId]);

  const fetchServicios = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/services/businesses/${negocioId}/services`
      );
      setServicios(res.data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setDuracion("");
    setServicioSeleccionado(null);
  };

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setNombre(servicio.nombre || "");
    setDescripcion(servicio.descripcion || "");
    setPrecio(servicio.precio?.toString() || "");
    setDuracion(servicio.duracion?.toString() || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepara los datos para enviar
    const datos = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      duracion: parseInt(duracion, 10),
    };

    try {
      if (servicioSeleccionado?.id) {
        // Actualizar servicio con PUT JSON body
        await axios.put(
          `http://localhost:8081/api/services/${servicioSeleccionado.id}`,
          datos
        );
        console.log("Servicio actualizado");
      } else {
        // Crear servicio usando POST con params en URL (no JSON en body)
        const params = new URLSearchParams({
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          precio: datos.precio,
          duracion: datos.duracion,
        }).toString();

        await axios.post(
          `http://localhost:8081/api/services/businesses/${negocioId}/from-params?${params}`
        );
        console.log("Servicio creado");
      }

      fetchServicios();
      limpiarFormulario();
      if (onSave) onSave();
    } catch (error) {
      console.error("Error guardando servicio:", error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/services/${id}`);
      console.log("Servicio eliminado");

      if (servicioSeleccionado?.id === id) {
        limpiarFormulario();
      }

      fetchServicios();
      if (onSave) onSave();
    } catch (error) {
      console.error("Error eliminando servicio:", error);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Servicios del negocio</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body d-flex">
            {/* Lista de servicios */}
            <div
              className="w-50 pe-3 border-end"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {servicios.length === 0 ? (
                <p>No hay servicios para mostrar</p>
              ) : (
                <ul className="list-group">
                  {servicios.map((s) => (
                    <li
                      key={s.id}
                      className={`list-group-item d-flex justify-content-between align-items-start ${
                        servicioSeleccionado?.id === s.id ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => seleccionarServicio(s)}
                    >
                      <div>
                        <strong>{s.nombre}</strong>
                        <br />
                        <small>{s.descripcion}</small>
                        <br />
                        <small>Precio: ${parseFloat(s.precio).toFixed(2)}</small>
                        <br />
                        <small>Duración: {s.duracion} min</small>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminar(s.id);
                        }}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Formulario */}
            <div className="w-50 ps-3">
              <h6>{servicioSeleccionado ? "Editar Servicio" : "Crear Servicio"}</h6>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Duración (minutos)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={limpiarFormulario}
                  >
                    Limpiar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {servicioSeleccionado ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
      
        </div>
      </div>
    </div>
  );
}
