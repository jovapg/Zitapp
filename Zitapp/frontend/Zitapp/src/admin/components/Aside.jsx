import logo from "../../assets/img/logo.png";
export default function Aside() {
  return (
    <div>
      <ul
        className="Aside  navbar-nav  sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* <!-- Sidebar - Brand --> */}
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
        </a>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className="nav-item active">
          <a className="nav-link" href="index.html">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">Modulos</div>

        {/* <!-- Nav Item - Pages Collapse Menu --> */}
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
            <span>Productos</span>
          </a>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Acciones:</h6>
              <a className="collapse-item" href="listado-pro.html">
                Ver Productos
              </a>
              <a className="collapse-item" href="crear-pro.html">
                Crear Productos
              </a>
            </div>
          </div>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Sidebar Toggler (Sidebar) --> */}
        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div>
      </ul>

      <style>{`
.Aside {
  flex-shrink: 0; /* que el aside no se reduzca */
  width: 250px;   /* ancho fijo para el aside */
  background-color: rgba(0,0,0,0.85);
  color: white;
  box-shadow: 2px 0 5px rgba(0,0,0,0.5);
}



  .Aside .nav-link {
    color: rgba(255, 255, 255, 0.9);
    transition: background-color 0.3s, color 0.3s;
  }

  .Aside .nav-link:hover {
    background-color: #1e1e2f;
    color: #61dafb; /* color azul claro al pasar mouse */
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
