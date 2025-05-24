import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalLogin from "./ModalLogin";
import ModalNegocio from "./ModalNegocio";

export default function Negocios() {
  const [negocios, setNegocios] = useState([]);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [mostrarModalNegocio, setMostrarModalNegocio] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);

  // Obtener lista negocios
  const fetchNegocios = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/business");
      setNegocios(res.data);
    } catch (error) {
      console.error("Error al cargar negocios", error);
    }
  };

  useEffect(() => {
    fetchNegocios();
  }, []);

  // Abrir modal login para crear negocio
  const handleCrearClick = () => {
    setUsuarioLogueado(null);
    setMostrarModalLogin(true);
  };

  // Login exitoso, abrir modal negocio
  const handleLoginSuccess = (user) => {
    setUsuarioLogueado(user);
    setMostrarModalLogin(false);
    setMostrarModalNegocio(true);
    setNegocioSeleccionado(null);
  };

  // Guardar negocio con idUsuario del usuario logueado
  const handleGuardarNegocio = async (datos) => {
    try {
      const datosConUsuario = { ...datos, idUsuario: usuarioLogueado.id };

      if (negocioSeleccionado) {
        await axios.put(
          `http://localhost:8081/api/business/${negocioSeleccionado.id}`,
          datosConUsuario
        );
      } else {
        await axios.post("http://localhost:8081/api/business", datosConUsuario);
      }
      setMostrarModalNegocio(false);
      fetchNegocios();
    } catch (error) {
      alert("Error guardando negocio");
      console.error(error);
    }
  };

  // Editar negocio (sin login)
  const handleEditar = (negocio) => {
    setUsuarioLogueado({ id: negocio.idUsuario, tipo: "negocio" });
    setNegocioSeleccionado(negocio);
    setMostrarModalNegocio(true);
  };

  // Eliminar negocio
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este negocio?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/business/${id}`);
      fetchNegocios();
    } catch (error) {
      alert("Error eliminando negocio");
      console.error(error);
    }
  };

  return (
    <>
      <div className="table-container p-3">
        <div className="encabezado mb-3 d-flex justify-content-between align-items-center">
          <h2 className="titulo">Negocios</h2>
          <button className="btn btn-primary" onClick={handleCrearClick}>
            <i className="bi bi-plus-circle"></i> Crear Negocio
          </button>
        </div>

        <table className="table table-custom">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Imagen</th>
              <th>ID Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {negocios.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No hay negocios para mostrar
                </td>
              </tr>
            )}
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
                      style={{ width: "80px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>{n.idUsuario}</td>
                <td className="d-flex">
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleEditar(n)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(n.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModalLogin && (
        <ModalLogin
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setMostrarModalLogin(false)}
        />
      )}

      {mostrarModalNegocio && (
        <ModalNegocio
          negocio={negocioSeleccionado}
          onClose={() => setMostrarModalNegocio(false)}
          onSave={handleGuardarNegocio}
        />
      )}
    </>
  );
}
