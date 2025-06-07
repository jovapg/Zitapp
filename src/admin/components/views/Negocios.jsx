import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalLogin from "./ModalLogin";
import ModalNegocio from "./ModalNegocio";
import ModalServicio from "./ModalServicio";           // <-- Importa el modal servicio
import ModalDisponibilidad from "./ModalDisponibles"; // <-- Importa el modal disponibilidad

export default function Negocios() {
  const [negocios, setNegocios] = useState([]);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [mostrarModalNegocio, setMostrarModalNegocio] = useState(false);
  const [mostrarModalServicio, setMostrarModalServicio] = useState(false);         // nuevo estado
  const [mostrarModalDisponibilidad, setMostrarModalDisponibilidad] = useState(false); // nuevo estado

  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);

  // Para editar/crear servicios y disponibilidades, almacenamos negocio activo y datos seleccionados:
  const [negocioActivoId, setNegocioActivoId] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] = useState(null);

  // Obtener lista negocios
  const fetchNegocios = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/businesses");
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
          `http://localhost:8081/api/businesses/${negocioSeleccionado.id}`,
          datosConUsuario
        );
      } else {
        await axios.post("http://localhost:8081/api/businesses", datosConUsuario);
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
      await axios.delete(`http://localhost:8081/api/businesses/${id}`);
      fetchNegocios();
    } catch (error) {
      alert("Error eliminando negocio");
      console.error(error);
    }
  };

  // Abrir modal servicio
  const handleAbrirModalServicio = (negocioId, servicio = null) => {
    setNegocioActivoId(negocioId);
    setServicioSeleccionado(servicio);
    setMostrarModalServicio(true);
  };

  // Abrir modal disponibilidad
  const handleAbrirModalDisponibilidad = (negocioId, disponibilidad = null) => {
    setNegocioActivoId(negocioId);
    setDisponibilidadSeleccionada(disponibilidad);
    setMostrarModalDisponibilidad(true);
  };

  // Recargar negocios (para pasar como callback a modales)
  const recargarNegocios = () => {
    fetchNegocios();
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
              <th>telefono</th>
              <th>ID Usuario</th>
              <th>Acciones</th>
              <th>Servicios</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {negocios.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center">
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
                <td>{n.telefono ? (
                  null
                ):("N/A")}</td>
                <td>{n.idUsuario}</td>
                <td className="d-flex">
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => handleEditar(n)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(n.id)}
                      title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleAbrirModalServicio(n.id)}
                    title="Servicios"
                  >
                    <i className="bi bi-gear"></i> Servicios
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleAbrirModalDisponibilidad(n.id)}
                    title="Disponibilidad"
                  >
                    <i className="bi bi-calendar"></i> Disponibilidad
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

      {mostrarModalServicio && (
        <ModalServicio
          negocioId={negocioActivoId}
          servicio={servicioSeleccionado}
          onClose={() => setMostrarModalServicio(false)}
          onSave={recargarNegocios}
        />
      )}

      {mostrarModalDisponibilidad && (
        <ModalDisponibilidad
          negocioId={negocioActivoId}
          disponibilidad={disponibilidadSeleccionada}
          onClose={() => setMostrarModalDisponibilidad(false)}
          onSave={recargarNegocios}
        />
      )}
    </>
  );
}
