import { useState, useEffect } from "react";
import axios from "axios";
import ModalUser from "./ModalUser";
import "../css/data.css";
const API_URL = "http://localhost:8081/api/users";
export default function User() {
  let [users, setUsers] = useState([]);
  let [modal, setModal] = useState(false);
  let [userSeleccionado, setuserSeleccionado] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  let fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      let response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      setError("Errror al obtener Usuarios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  let handleCrear = () => {
    setuserSeleccionado(null);
    setModal(true);
  };
  let handleEditar = (users) => {
    setuserSeleccionado(users);
    setModal(true);
  };

let handleGUardar = async (data) => {
  try {
    if (userSeleccionado) {
      await axios.put(`${API_URL}/${userSeleccionado.id}`, data);
    } else {
      await axios.post(API_URL, data);
    }
    setModal(false);
    fetchUser();
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data.error || error.response.data); // ← muestra el mensaje del backend
    } else {
      alert("Error al guardar el Usuario");
    }
    console.error(error);
  }
};


  let handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este Ususario?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUser();
    } catch (error) {
      alert("Error al eliminar el Ususario");
      console.error(error);
    }
  };

  return (
    <>
      <div className="table-container p-3">
        <div className="encabezado mb-3">
          <h2 className="titulo">Usuarios</h2>
          <button className="btn btn-primary" onClick={handleCrear}>
            <i className="bi bi-plus-circle"></i> Crear Usuario
          </button>
        </div>

        {loading && (
          <div className="alert alert-info">Cargando Ususario...</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

       <table className="table table-custom">
  <thead>
    <tr>
      <th>id</th>
      <th>Imagen</th>  {/* Nueva columna */}
      <th>Nombre</th>
      <th>Email</th>
      <th>Password</th>
      <th>Telefono</th>
      <th>Tipo</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {users.map((ns) => (
      <tr key={ns.id}>
        <td>{ns.id}</td>
        <td>
          {ns.imagenPerfil ? (
            <img
              src={ns.imagenPerfil}
              alt={ns.nombre}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          ) : (
            <span>No imagen</span>
          )}
        </td>
        <td>{ns.nombre}</td>
        <td>{ns.email}</td>
        <td>{ns.contrasena}</td>
        <td>{ns.telefono}</td>
        <td>{ns.tipo}</td>
        <td>
          <button
            className="btn btn-sm btn-warning me-1"
            onClick={() => handleEditar(ns)}
            title="Editar"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleEliminar(ns.id)}
             title="Eliminar"
          >
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    ))}
    {users.length === 0 && !loading && (
      <tr>
        <td colSpan={8} className="text-center"> {/* colspan actualizado */}
          No hay usuarios
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
      {/* // modal */}
      {modal && (
        <ModalUser
          users={userSeleccionado}
          onClose={() => setModal(false)}
          onSave={handleGUardar}
        />
      )}
    </>
  );
}
