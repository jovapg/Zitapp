import logo from "../../assets/img/LOGO Zitapp.png";
import "./css/Aside.css";

export default function Aside({ isVisible, onSelectView }) {
  if (!isVisible) return null;

  const handleClick = (view) => (e) => {
    e.preventDefault();
    onSelectView(view);
  };

  return (
    <div className="d-flex flex-column Aside" style={{ height: "100vh" }}>
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
          <h2 className="text-white fw-bold">ZITAPP</h2>
        </a>

        <hr className="sidebar-divider" />

        {/* Heading */}
        <div className="sidebar-heading">Módulos</div>

        {/* Nav Items */}
        <li className="nav-item">
          <button className="nav-link" onClick={handleClick("negocios")}>
            <i className="fas fa-fw fa-cog"></i>
            <span>Admin Negocios</span>
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" onClick={handleClick("usuarios")}>
            <i className="fas fa-fw fa-cog"></i>
            <span>Admin User</span>
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" onClick={handleClick("citas")}>
            <i className="fas fa-fw fa-cog"></i>
            <span>Admin Citas</span>
          </button>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link collapsed" onClick={handleClick("reporte")}>
            <i className="fas fa-download fa-sm text-white-50"></i> Generar Reporte
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
