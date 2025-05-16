import { useState } from "react";

const data = {
  todas: [
    {
      categoria: "Belleza",
      nombre: "Estética Glam",
      descripcion: "Expertos en tratamientos faciales y cuidado de la piel.",
      servicios: ["Faciales", "Depilación", "Manicure"],
      imagen:
        "https://www.shortcuts.es/wp-content/uploads/2015/11/beauty1-1030x686.jpg",
    },
    {
      categoria: "Barberías",
      nombre: "Barbería El Corte",
      descripcion: "Cortes modernos y clásicos para caballeros.",
      servicios: ["Fade", "Barba", "Diseño de cejas"],
      imagen:
        "https://thebarbeer.co/wp-content/uploads/2018/05/barberia_06.jpg",
    },
    {
      categoria: "Talleres",
      nombre: "AutoFix Express",
      descripcion: "Tu taller de confianza para mantenimiento y reparaciones.",
      servicios: ["Cambio de aceite", "Revisión general", "Frenos"],
      imagen:
        "https://i.pinimg.com/736x/9d/6a/6e/9d6a6e7293719015efeb0e53e631b8f5.jpg",
    },
  ],
};

const Categories = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");

  const negociosFiltrados = data.todas.filter(
    (negocio) =>
      categoriaSeleccionada === "todas" ||
      negocio.categoria.toLowerCase() === categoriaSeleccionada
  );

  const negocioDestacado = negociosFiltrados[0];

  return (
    <div
      style={{
        background: "rgba(45, 45, 70, 0.85)",
        color: "white",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      {/* Categorías */}
      <div className="d-flex justify-content-around mb-4">
        {["todas", "belleza", "barberías", "talleres"].map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${
              categoriaSeleccionada === cat ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Tarjeta destacada */}
      {negocioDestacado && (
        <div
          className="mb-4 position-relative rounded overflow-hidden"
          style={{
            height: "320px",
            borderRadius: "16px",
          }}
        >
          {/* Imagen */}
          <img
            src={negocioDestacado.imagen}
            alt={negocioDestacado.nombre}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
          {/* Capa oscura */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 1,
            }}
          ></div>
          {/* Contenido */}
          <div
            className="position-relative p-4"
            style={{ zIndex: 2, maxWidth: "60%" }}
          >
            <h4>{negocioDestacado.nombre}</h4>
            <p>{negocioDestacado.descripcion}</p>
            <ul style={{ paddingLeft: "18px" }}>
              {negocioDestacado.servicios.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <button className="btn btn-primary mt-2">Agendar cita</button>
          </div>
        </div>
      )}

      {/* Tarjetas pequeñas */}
      <div className="d-flex flex-wrap gap-3">
        {negociosFiltrados.slice(1).map((negocio, index) => (
          <div
            key={index}
            className="card text-white"
            style={{
              background: "rgba(70, 70, 100, 0.8)",
              width: "220px",
              border: "none",
              borderRadius: "16px",
            }}
          >
            <img
              src={negocio.imagen}
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
                {negocio.servicios.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <button className="btn btn-sm btn-outline-light mt-2 w-100">
                Agendar cita
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
