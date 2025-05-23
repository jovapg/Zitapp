import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalCitas from "./ModalCitas";

const API_URL = "http://localhost:8081/api/Appointments";

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);

  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/todas`);
      setCitas(res.data);
    } catch (err) {
      setError("Error al cargar citas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleCreate = () => {
    setSelectedCita(null);
    setModalShow(true);
  };

  const handleEdit = (cita) => {
    setSelectedCita(cita);
    setModalShow(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedCita) {
        await axios.put(`${API_URL}/editar/${selectedCita.id}`, {
          nuevaFecha: data.fecha,
          nuevaHora: data.hora,
          client: data.client,
          business: data.business,
          estado: data.estado,
        });
      } else {
        await axios.post(API_URL, data);
      }
      setModalShow(false);
      fetchCitas();
    } catch (err) {
      alert("Error al guardar la cita");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta cita?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCitas();
    } catch (err) {
      alert("Error al eliminar la cita");
      console.error(err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/confirmar`);
      fetchCitas();
    } catch (err) {
      alert("Error al confirmar la cita");
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/cancelar`);
      fetchCitas();
    } catch (err) {
      alert("Error al cancelar la cita");
      console.error(err);
    }
  };

  const handleFinish = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/finalizar`);
      fetchCitas();
    } catch (err) {
      alert("Error al finalizar la cita");
      console.error(err);
    }
  };

  // Función para convertir fecha array a string
  const formatFecha = (fecha) => {
    if (!Array.isArray(fecha) || fecha.length !== 3) return "";
    const [anio, mes, dia] = fecha;
    return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  };

  // Función para convertir hora array a string
  const formatHora = (hora) => {
    if (!Array.isArray(hora) || hora.length < 2) return "";
    const [h, m] = hora;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className=" table-container mt-4">
          <div className="encabezado  mb-3">
                 <h2 className="titulo">Citas</h2>
      <button className="btn btn-primary mb-3" onClick={handleCreate}>
        <i class="bi bi-plus-circle"> Crear Cita</i>
      </button>
   </div>

      {loading && <div className="alert alert-info">Cargando citas...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-hover table-custom  table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Cliente ID</th>
            <th>Negocio ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 && !loading && (
            <tr>
              <td colSpan="7" className="text-center">
                No hay citas
              </td>
            </tr>
          )}
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.id}</td>
              <td>{formatFecha(cita.fecha)}</td>
              <td>{formatHora(cita.hora)}</td>
              <td>{cita.estado}</td>
              <td>{cita.client?.id || "N/A"}</td>
              <td>{cita.business?.id || "N/A"}</td>
              <td className=" d-flex">
            
                <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(cita.id)}>
              <i className="bi bi-trash"></i>
                </button>
                {cita.estado === "PENDIENTE" && (
                          <>
                                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cita)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleConfirm(cita.id)}>
                      <i className="bi bi-check-lg"></i>
                    </button>
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => handleCancel(cita.id)}>
                   <i className="bi bi-x-lg"></i>
                    </button>
                  </>
                )}
                {cita.estado === "CONFIRMADA" && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleFinish(cita.id)}>
             <i className="bi bi-flag"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalCitas show={modalShow} onClose={() => setModalShow(false)} onSave={handleSave} cita={selectedCita} />
    </div>
  );
}
