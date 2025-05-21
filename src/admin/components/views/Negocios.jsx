import { useState, useEffect } from "react";
import axios from "axios";
import ModalNegocio from "./ModalNegocio";
import "../css/data.css";

const API_URL = "http://localhost:8081/api/business";

export default function Negocios() {
  const [negocios, setNegocios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNegocios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setNegocios(response.data);
    } catch (error) {
      setError("Error al obtener negocios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegocios();
  }, []);

  const handleCrear = () => {
    setNegocioSeleccionado(null);
    setMostrarModal(true);
  };

  const handleEditar = (negocio) => {
    setNegocioSeleccionado(negocio);
    setMostrarModal(true);
  };

  const handleGuardar = async (datos) => {
    try {
      if (negocioSeleccionado) {
        await axios.put(`${API_URL}/${negocioSeleccionado.id}`, datos);
      } else {
        await axios.post(API_URL, datos);
      }
      setMostrarModal(false);
      fetchNegocios();
    } catch (error) {
      alert("Error guardando negocio");
      console.error(error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este negocio?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNegocios();
    } catch (error) {
      alert("Error eliminando negocio");
      console.error(error);
    }
  };

  return (
    <>
      <div className="table-container p-3">
        <div className="encabezado-negocios mb-3">
          <h2 className="titulo-negocios">Negocios</h2>
          <button className="btn btn-primary" onClick={handleCrear}>
            Crear Negocio
          </button>
        </div>

        {loading && (
          <div className="alert alert-info">Cargando negocios...</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <table className="table table-custom">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {negocios.map((n) => (
              <tr key={n.id}>
                <td>{n.nombre}</td>
                <td>{n.categoria}</td>
                <td>{n.descripcion}</td>
                <td>{n.direccion}</td>
                <td>
                  {n.imagenUrl ? (
                    <img
                      src={n.imagenUrl}
                      alt={n.nombre}
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleEditar(n)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(n.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {negocios.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay negocios para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Renderizamos el modal fuera del container */}
      {mostrarModal && (
        <ModalNegocio
          negocio={negocioSeleccionado}
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardar}
        />
      )}
    </>
  );
}
