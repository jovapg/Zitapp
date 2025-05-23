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
          <button className="nav-link " onClick={handleClick("negocios")}>
            <i className="fas fa-fw fa-cog"></i>
            <span>Admin Negocios</span>
          </button>

          <button className="nav-link " onClick={handleClick("usuarios")}>
            <i className="fas fa-fw fa-cog"></i>
            <span>Admin User</span>
          </button>

          <button className="nav-link " onClick={handleClick("citas")}>
            <i className="fas fa-fw fa-cog"></i>
            <span>Admin Citas</span>
          </button>

          <a
            href="#"
            className="nav-link collapsed"
            onClick={handleClick("reporte")}
          >
            <i className="fas fa-download fa-sm text-white-50"></i> Generar
            Reporte
          </a>
        </li>

        <hr className="sidebar-divider my-4" />

        {/* BOTÓN SALIR al fondo */}
        <li className="nav-item mt-auto">
          <a
            href="/FirsPage"
            className="nav-link"
            onClick={() => alert("Salir de la sesión")}
          >
            <i className="fas fa-sign-out-alt fa-sm text-white-50"></i> Salir
          </a>
        </li>
      </ul>
    </div>
  );
}
