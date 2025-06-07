import React from "react";

export default function Info() {
  const proyectos = [
    { nombre: "Migración del servidor", progreso: 20 },
    { nombre: "Seguimiento de citas", progreso: 40 },
    { nombre: "Base de datos de usuarios", progreso: 60 },
    { nombre: "Interfaz de administración", progreso: 80 },
    { nombre: "Configuración inicial", progreso: 100 },
  ];

  const getColorBarra = (valor) => {
    if (valor === 100) return "bg-success";
    if (valor >= 80) return "bg-info";
    if (valor >= 60) return "bg-primary";
    if (valor >= 40) return "bg-warning";
    return "bg-danger";
  };

  return (
    <>
      <div className="col-lg-6 mb-4">
        {/* Proyectos */}
        <div className="card shadow mb-4 bg-secondary">
          <div className="card-header py-3 bg-primary">
            <h6 className="m-0 font-weight-bold text-dark">Progreso de ZitApp</h6>
          </div>
          <div className="card-body">
            {proyectos.map((p, i) => (
              <div key={i}>
                <h4 className="small font-weight-bold">
                  {p.nombre}
                  <span className="float-right">
                    {p.progreso === 100 ? "¡Completado!" : `${p.progreso}%`}
                  </span>
                </h4>
                <div className="progress mb-4">
                  <div
                    className={`progress-bar ${getColorBarra(p.progreso)}`}
                    role="progressbar"
                    style={{ width: `${p.progreso}%` }}
                    aria-valuenow={p.progreso}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistema de Colores */}
        <div className="row">
          {[
            { nombre: "Primario", color: "bg-primary", hex: "#4e73df" },
            { nombre: "Éxito", color: "bg-success", hex: "#1cc88a" },
            { nombre: "Información", color: "bg-info", hex: "#36b9cc" },
            { nombre: "Advertencia", color: "bg-warning", hex: "#f6c23e" },
            { nombre: "Error", color: "bg-danger", hex: "#e74a3b" }
          ].map((c, i) => (
            <div className="col-lg-6 mb-4" key={i}>
              <div className={`card ${c.color} text-white shadow`}>
                <div className="card-body">
                  {c.nombre}
                  <div className="text-white-50 small">{c.hex}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-lg-6 mb-4">
        {/* Ilustración */}
<div className="card shadow mb-4 bg-secondary">
  <div className="card-header py-3 bg-primary">
    <h6 className="m-0 font-weight-bold text-dark">Ilustraciones</h6>
  </div>
  <div className="card-body">
    <div className="text-center">
      <img
        className="img-fluid px-3 px-sm-4 mt-3 mb-4"
        style={{ width: "25rem" }}
        src="https://undraw.co/api/illustrations/posting_photo.svg"
        alt="Ilustración de ejemplo"
      />
    </div>
    <p>
      Puedes agregar ilustraciones SVG libres de uso desde{" "}
      <a target="_blank" rel="nofollow" href="https://undraw.co/">
        unDraw
      </a>
      , una colección actualizada constantemente.
    </p>
    <a target="_blank" rel="nofollow" href="https://undraw.co/">
      Explorar ilustraciones en unDraw →
    </a>
  </div>

  {/* Nueva tarjeta dentro de la misma sección */}
  <div className="card shadow mt-4 bg-secondary">
    <div className="card-header py-3 bg-primary">
      <h6 className="m-0 font-weight-bold text-dark">Recursos útiles para ZitApp</h6>
    </div>
    <div className="card-body">
      <ul>
        <li>
          <a href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="nofollow noopener noreferrer">
            Documentación oficial de React
          </a>
        </li>
        <li>
          <a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/" target="_blank" rel="nofollow noopener noreferrer">
            Guía oficial de Bootstrap 5
          </a>
        </li>
        <li>
          <a href="https://undraw.co/" target="_blank" rel="nofollow noopener noreferrer">
            Colección de ilustraciones SVG (unDraw)
          </a>
        </li>
        <li>
          <a href="https://reactrouter.com/en/main" target="_blank" rel="nofollow noopener noreferrer">
            React Router para navegación SPA
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>



        {/* Enfoque de desarrollo */}
        <div className="card shadow mb-4 bg-secondary">
          <div className="card-header py-3 bg-primary">
            <h6 className="m-0 font-weight-bold text-dark">
              Enfoque de Desarrollo
            </h6>
          </div>
          <div className="card-body">
            <p>
              ZitApp está construido con React y Bootstrap, siguiendo buenas
              prácticas de componentes reutilizables, diseño responsivo y carga
              rápida.
            </p>
            <p className="mb-0">
              Es recomendable conocer bien Bootstrap y React para poder modificar y
              escalar esta aplicación de forma eficiente.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
