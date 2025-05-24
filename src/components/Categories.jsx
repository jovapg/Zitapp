import { useEffect, useState } from "react";
import axios from "axios";
import Botonagendarcita from "./Botonagendarcita";

const Categories = ({ filtroBusqueda }) => {
  const [negocios, setNegocios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");

  useEffect(() => {
    const obtenerNegocios = async () => {
      try {
        const respuesta = await axios.get("http://localhost:8081/api/business");
        setNegocios(respuesta.data);
      } catch (error) {
        console.error("Error al obtener negocios", error);
      }
    };
    obtenerNegocios();
  }, []);

  const categoriasUnicas = [...new Set(negocios.map(n => n.categoria.toLowerCase()))];

  // Nuevo filtro combinado por búsqueda y categoría seleccionada
  const negociosFiltrados = negocios.filter((negocio) => {
    const nombre = negocio.nombre?.toLowerCase() || '';
    const categoria = negocio.categoria?.toLowerCase() || '';
    const filtro = filtroBusqueda.toLowerCase();

    const coincideConBusqueda =
      nombre.includes(filtro) || categoria.includes(filtro);

    const coincideConCategoria =
      categoriaSeleccionada === "todas" || categoria === categoriaSeleccionada;

    return coincideConBusqueda && coincideConCategoria;
  });

  const negocioDestacado = negociosFiltrados[0];

  return (
    <div style={{
      background: "rgba(45, 45, 70, 0.85)",
      color: "white",
      padding: "20px",
      borderRadius: "16px",
      margin: "30px"
    }}>
      {/* Botones de categoría */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm ${categoriaSeleccionada === "todas" ? "btn-primary" : "btn-outline-light"}`}
          onClick={() => setCategoriaSeleccionada("todas")}
        >
          Todas
        </button>
        {categoriasUnicas.map((cat, idx) => (
          <button
            key={idx}
            className={`btn btn-sm ${categoriaSeleccionada === cat ? "btn-primary" : "btn-outline-light"}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Tarjeta destacada */}
      {negocioDestacado && (
        <div className="mb-4 position-relative rounded overflow-hidden" style={{ height: "320px" }}>
          <img
            src={negocioDestacado.imagenUrl || "https://via.placeholder.com/600x400"}
            alt={negocioDestacado.nombre}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0
            }}
          />
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", zIndex: 1
          }} />
          <div className="position-relative p-4" style={{ zIndex: 2, maxWidth: "60%" }}>
            <h4>{negocioDestacado.nombre}</h4>
            <p>{negocioDestacado.descripcion}</p>
            <ul style={{ paddingLeft: "18px" }}>
              {negocioDestacado.servicios?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <button className="btn btn-primary mt-2" onClick={() => setShowModal(true)}>
              Agendar cita
            </button>
          </div>
        </div>
      )}

      {/* Tarjetas pequeñas */}
      <div className="d-flex flex-wrap gap-3">
        {negociosFiltrados.slice(1).map((negocio, index) => (
          <div key={index} className="card text-white"
            style={{
              background: "rgba(70, 70, 100, 0.8)",
              width: "220px",
              border: "none",
              borderRadius: "16px"
            }}>
            <img
              src={negocio.imagenUrl || "https://via.placeholder.com/300x200"}
              alt={negocio.nombre}
              className="card-img-top rounded-top"
              style={{ height: "140px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h6 className="card-title">{negocio.nombre}</h6>
              <p className="card-text" style={{ fontSize: "0.85rem" }}>
                {negocio.descripcion}
              </p>
              <ul className="pl-3" style={{ fontSize: "0.8rem" }}>
                {negocio.servicios?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <button
                className="btn btn-sm btn-outline-light mt-2 w-100"
                onClick={() => setShowModal(true)}
              >
                Agendar cita
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de agendamiento */}
      {showModal && <Botonagendarcita show={showModal} setShow={setShowModal} />}
    </div>
  );
};

export default Categories;
