import React, { useState, useEffect } from "react";
import axios from "axios";

// Función para convertir [hora, minuto] a "HH:mm"
function formatHora(horaArray) {
  if (!horaArray || !Array.isArray(horaArray) || horaArray.length !== 2) return "";
  const [h, m] = horaArray;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function ModalDisponibilidad({ negocioId, onClose, onSave }) {
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID para editar

  useEffect(() => {
    fetchDisponibilidades();
    clearForm();
  }, [negocioId]);

  const fetchDisponibilidades = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/availability/business/${negocioId}`
      );

      // Convertimos las horas a string "HH:mm" para mostrar y editar
      const dataFormateada = res.data.map((disp) => ({
        ...disp,
        horaInicioStr: formatHora(disp.horaInicio),
        horaFinStr: formatHora(disp.horaFin),
      }));

      setDisponibilidades(dataFormateada);
    } catch (error) {
      console.error("Error cargando disponibilidades", error);
    }
  };

  const clearForm = () => {
    setDia("");
    setHoraInicio("");
    setHoraFin("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dia || !horaInicio || !horaFin) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      if (editingId) {
        // Editar disponibilidad existente
        await axios.put(
          `http://localhost:8081/api/availability/${editingId}`,
          {
            dia,
            horaInicio, // enviar string "HH:mm"
            horaFin,    // enviar string "HH:mm"
          }
        );
      } else {
        // Crear nueva disponibilidad
        await axios.post(
          `http://localhost:8081/api/availability/create/${negocioId}`,
          null,
          {
            params: {
              dia,
              horaInicio, // enviar string "HH:mm"
              horaFin,    // enviar string "HH:mm"
            },
          }
        );
      }

      await fetchDisponibilidades(); // Refrescar lista
      clearForm();
      onSave?.();
    } catch (error) {
      console.error("Error guardando disponibilidad", error);
      alert("Error guardando disponibilidad");
    }
  };

  const handleEditarClick = (disp) => {
    setEditingId(disp.id);
    setDia(disp.dia);
    setHoraInicio(disp.horaInicioStr || "");
    setHoraFin(disp.horaFinStr || "");
  };

  const handleEliminarClick = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta disponibilidad?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/availability/${id}`);
      await fetchDisponibilidades();
      if (id === editingId) clearForm();
      onSave?.();
    } catch (error) {
      console.error("Error eliminando disponibilidad", error);
      alert("Error eliminando disponibilidad");
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

          <div className="modal-header">
            <h5 className="modal-title">
              {editingId ? "Editar Disponibilidad" : "Crear Disponibilidad"}
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body d-flex gap-4">

            {/* FORMULARIO IZQUIERDA */}
            <form onSubmit={handleSubmit} className="flex-fill">
              <div className="mb-3">
                <label className="form-label">Día</label>
                <input
                  type="text"
                  className="form-control"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  placeholder="Ejemplo: Lunes"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Hora Inicio</label>
                <input
                  type="time"
                  className="form-control"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Hora Fin</label>
                <input
                  type="time"
                  className="form-control"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    clearForm();
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>

            {/* LISTA DERECHA */}
            <div className="flex-fill border-start ps-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <h6>Disponibilidades Existentes</h6>
              {disponibilidades.length === 0 && <p>No hay disponibilidades</p>}

              <ul className="list-group">
                {disponibilidades.map((disp) => (
                  <li
                    key={disp.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      disp.id === editingId ? "active" : ""
                    }`}
                  >
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditarClick(disp)}
                    >
                      <strong>{disp.dia}</strong> - {disp.horaInicioStr || ""} a {disp.horaFinStr || ""}
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminarClick(disp.id)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
