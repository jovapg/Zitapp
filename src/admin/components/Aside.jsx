import logo from "../../assets/img/LOGO Zitapp.png";
export default function Aside() {
  return (

<div className="d-flex flex-column" style={{ height: '100vh' }}>
  <ul
    className="Aside navbar-nav sidebar sidebar-dark accordion d-flex flex-column"
    id="accordionSidebar"
  >
    {/* Brand */}
    <a
      className="sidebar-brand d-flex align-items-center justify-content-center"
      href="/LoginPage"
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
      <a
        className="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseTwo"
        aria-expanded="true"
        aria-controls="collapseTwo"
      >
        <i className="fas fa-fw fa-cog"></i>
        <span>Admin Negocios</span>
      </a>

      <a
        className="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseTwo"
        aria-expanded="true"
        aria-controls="collapseTwo"
      >
        <i className="fas fa-fw fa-cog"></i>
        <span>Admin Usuarios</span>
      </a>

      <a href="#" className="nav-link collapsed">
        <i className="fas fa-download fa-sm text-white-50"></i> Generar Reporte
      </a>
    </li>

    <hr className="sidebar-divider my-4" />

    {/* BOTÓN SALIR al fondo */}
    <li className="nav-item mt-auto">
      <a href="#" className="nav-link">
        <i className="fas fa-sign-out-alt fa-sm text-white-50"></i> Salir
      </a>
    </li>
  </ul>

  {/* Estilos */}
  <style>{`
    .Aside {
      flex-shrink: 0;
      width: 250px;
      background-color: rgba(0, 0, 0, 0.85);
      color: white;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    }

    .Aside .nav-link {
      color: rgba(255, 255, 255, 0.9);
      transition: background-color 0.3s, color 0.3s;
    }

    .Aside .nav-link:hover {
      background-color: #1e1e2f;
      color: #61dafb;
    }

    .sidebar-brand-icon img {
      border-radius: 50%;
      transition: transform 0.3s ease;
    }

    .sidebar-brand-icon img:hover {
      transform: rotate(15deg) scale(1.1);
    }

    .sidebar-divider {
      border-color: rgba(255, 255, 255, 0.1);
    }

    .sidebar-heading {
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      font-weight: 700;
      font-size: 0.85rem;
    }
  `}</style>
</div>




  );
}
