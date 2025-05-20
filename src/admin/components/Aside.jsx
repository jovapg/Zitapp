import logo from "../../assets/img/LOGO Zitapp.png";
import "./css/Aside.css";

export default function Aside({ isVisible, onSelectView }) {
  if (!isVisible) return null;

  // Función para manejar el click y avisar al Dashboard qué vista mostrar
  const handleClick = (view) => (e) => {
    e.preventDefault(); // prevenir que el enlace recargue la página
    onSelectView(view);
  };

  return (
    <div className={`Aside ${isVisible ? "show" : "collapsed"}`}>
      <ul
        className="navbar-nav sidebar sidebar-dark accordion d-flex flex-column"
        id="accordionSidebar"
      >
        {/* Brand */}
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="/Admin"
          onClick={handleClick("home")}
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <img
              src={logo}
              alt="Icono"
              style={{ width: "70px", height: "70px" }}
            />
          </div>
        </a>

        <hr className="sidebar-divider" />

        {/* Heading */}
        <div className="sidebar-heading">Módulos</div>

        {/* Nav Items */}
        <li className="nav-item">
          <button className="nav-link dropdown">
            <i className="fas fa-fw fa-cog"></i>
            <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Admin Negocios
            </span>
            <ul className="dropdown-menu">
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("negocios")}>Negocios</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("crearNegocio")}>Crear Negocio</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("actualizarNegocio")}>Actualizar</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("eliminarNegocio")}>Eliminar</a>
              </li>
            </ul>
          </button>

          <button className="nav-link dropdown">
            <i className="fas fa-fw fa-cog"></i>
            <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Admin Usuarios
            </span>
            <ul className="dropdown-menu">
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("usuarios")}>Usuarios</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("crearUsuarios")}>Crear Usuarios</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("actualizarUsuario")}>Actualizar</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("eliminarUsuario")}>Eliminar</a>
              </li>
            </ul>
          </button>

          <button className="nav-link dropdown">
            <i className="fas fa-fw fa-cog"></i>
            <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Admin Citas
            </span>
            <ul className="dropdown-menu">
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("citas")}>Citas</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("crearCitas")}>Crear Citas</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("actualizarCitas")}>Actualizar</a>
              </li>
              <li>
                <a href="#" className="dropdown-item" onClick={handleClick("eliminarCitas")}>Eliminar</a>
              </li>
            </ul>
          </button>

          <a href="#" className="nav-link collapsed" onClick={handleClick("reporte")}>
            <i className="fas fa-download fa-sm text-white-50"></i> Generar Reporte
          </a>
        </li>

        <hr className="sidebar-divider my-4" />

        {/* BOTÓN SALIR al fondo */}
        <li className="nav-item mt-auto">
          <a href="#" className="nav-link" onClick={() => alert("Salir de la sesión")}>
            <i className="fas fa-sign-out-alt fa-sm text-white-50"></i> Salir
          </a>
        </li>
      </ul>
    </div>
  );
}
