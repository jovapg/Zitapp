import { useState, useEffect } from "react";
import "../css/data.css";

const mockNegocios = [
  {
    id: 1,
    nombre: "Panadería La Delicia",
    correo: "contacto@delicia.com",
    telefono: "5551234",
    tipoCuenta: "Negocio",
    password: "abc12345",
    fechaCreacion: "2024-01-15T10:30:00Z",
    descripcion: "Especialistas en pan artesanal",
  },
  {
    id: 2,
    nombre: "Tienda El Buen Precio",
    correo: "info@elbuenprecio.com",
    telefono: "5555678",
    tipoCuenta: "Negocio",
    password: "precio2024",
    fechaCreacion: "2023-12-05T14:20:00Z",
    descripcion: "Productos a los mejores precios",
  },
  {
    id: 3,
    nombre: "Café Central",
    correo: "hola@cafecentral.com",
    telefono: "5559012",
    tipoCuenta: "Negocio",
    password: "cafecito",
    fechaCreacion: "2022-09-10T08:15:00Z",
    descripcion: "Café de especialidad y pastelería",
  },
  {
    id: 4,
    nombre: "Librería Mundo",
    correo: "contacto@libreriamundo.com",
    telefono: "5553456",
    tipoCuenta: "Negocio",
    password: "libros2025",
    fechaCreacion: "2024-03-01T12:00:00Z",
    descripcion: "Libros y material educativo",
  },
  {
    id: 5,
    nombre: "Restaurante La Palma",
    correo: "reservas@lapalma.com",
    telefono: "5557890",
    tipoCuenta: "Negocio",
    password: "palma2023",
    fechaCreacion: "2023-06-20T19:30:00Z",
    descripcion: "Comida típica y eventos especiales",
  },
  {
    id: 6,
    nombre: "Gimnasio FitLife",
    correo: "contacto@fitlife.com",
    telefono: "5552345",
    tipoCuenta: "Negocio",
    password: "fitlife2024",
    fechaCreacion: "2023-11-11T07:45:00Z",
    descripcion: "Entrenamiento personalizado y clases grupales",
  },
];


export default function Negocios() {
  const [negocios, setNegocios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({ columna: "nombre", asc: true });

  useEffect(() => {
    setNegocios(mockNegocios);
  }, []);

  const negociosFiltrados = negocios.filter((n) =>
    n.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const negociosOrdenados = negociosFiltrados.sort((a, b) => {
    const col = orden.columna;
    let compA = a[col].toString().toLowerCase();
    let compB = b[col].toString().toLowerCase();
    if (compA < compB) return orden.asc ? -1 : 1;
    if (compA > compB) return orden.asc ? 1 : -1;
    return 0;
  });

  const cambiarOrden = (columna) => {
    setOrden((prev) =>
      prev.columna === columna
        ? { columna, asc: !prev.asc }
        : { columna, asc: true }
    );
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Negocios</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
      />

      <table className="tabla">
        <thead>
          <tr>
            <th className="sortable" onClick={() => cambiarOrden("nombre")}>
              Nombre {orden.columna === "nombre" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="sortable" onClick={() => cambiarOrden("telefono")}>
              Teléfono {orden.columna === "telefono" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="sortable" onClick={() => cambiarOrden("correo")}>
              Correo {orden.columna === "correo" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="sortable" onClick={() => cambiarOrden("tipoCuenta")}>
              Tipo Cuenta {orden.columna === "tipoCuenta" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="sortable" onClick={() => cambiarOrden("password")}>
              Password {orden.columna === "password" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="sortable" onClick={() => cambiarOrden("fechaCreacion")}>
              Fecha de Creación {orden.columna === "fechaCreacion" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
            <th className="sortable" onClick={() => cambiarOrden("descripcion")}>
              Descripción {orden.columna === "descripcion" ? (orden.asc ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {negociosOrdenados.map((n) => (
            <tr key={n.id}>
              <td>{n.nombre}</td>
              <td>{n.telefono}</td>
              <td>{n.correo}</td>
              <td>{n.tipoCuenta}</td>
              <td className="password-cell">{n.password}</td>
              <td>{new Date(n.fechaCreacion).toLocaleDateString()}</td>
              <td>{n.descripcion}</td>
            </tr>
          ))}
          {negociosOrdenados.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 10 }}>
                No se encontraron negocios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
