import React, { useState, useEffect } from 'react';
import ConfigUser from '../../components/ConfigUser';  // ruta relativa correcta



export default function Header({toggleSidebar}) {
  const [adminName, setAdminName] = useState("Nombre del admin");
const [imagenPerfil, setImagenPerfil] = useState(null);

  useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const userObj = JSON.parse(userData);
      if (userObj.nombre) setAdminName(userObj.nombre);
      if (userObj.imagenPerfil) setImagenPerfil(userObj.imagenPerfil);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }
  }, []);
    const [modalVisible, setModalVisible] = useState(false); 


  return (
    <div>
      {/* //    <!-- Topbar --> */}
      <nav className=" nav navbar navbar-expand navbar-light  topbar mb-4 static-top shadow">

        {/* <!-- Sidebar Toggle (Topbar) --> */}
        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={toggleSidebar} >
          <i className="fa fa-bars"></i> 
        </button>

        {/* <!-- Topbar Search --> */}
        <form
          className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group">
            <input type="text" className="form-control  border-0 small" placeholder="Search for..."
              aria-label="Search" aria-describedby="basic-addon2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7' }} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm"></i>
              </button>
            </div>
          </div>
        </form>

        {/* <!-- Topbar Navbar --> */}
        <ul className="navbar-nav ml-auto">

          <div className="topbar-divider d-none d-sm-block"></div>

          {/* <!-- Nav Item - User Information --> */}
          <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">{adminName}</span>
              <img
                src={imagenPerfil}
                alt="User"
                className="rounded-circle"
                style={{ width: "50px" }}
              />
            </a>
            {/* <!-- Dropdown - User Information --> */}
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown">
           
              <a className="dropdown-item"   onClick={() => setModalVisible(true)}>
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Settings
              </a>  
            </div>
          </li>

        </ul>

      </nav>
         {/* Modal de configuración de usuario */}
                  <ConfigUser show={modalVisible} handleClose={() => setModalVisible(false)} />
      
      <style>
        {`
        .nav{
          background-color: rgba(0, 0, 0, 0.7);
        }
        `}
      </style>
      
    </div>
    
  )
}
