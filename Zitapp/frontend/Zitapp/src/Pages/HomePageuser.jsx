import fondologin from '../assets/img/logo.png';

export default function HomePageuser() {
    return (
        <>
            <div className="dashboard-layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="mb-4">
                        <img
                            src={fondologin}
                            alt="login icon"
                            className="img-fluid mt-2"
                            style={{ width: '90px' }}
                        />
                    </div>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item mb-3">
                            <a href="/negocios" className="nav-link dashboard-btn text-white">
                                <i className="bi bi-circle me-2"></i> Ver Negocios
                            </a>
                        </li>
                        <li className="nav-item mb-3">
                            <a href="/categorias" className="nav-link dashboard-btn text-white">
                                <i className="bi bi-circle me-2"></i> Categorías
                            </a>
                        </li>
                        <li className="nav-item mb-3">
                            <a href="/tuscitas" className="nav-link dashboard-btn text-white">
                                <i className="bi bi-circle me-2"></i> Tus Citas
                            </a>
                        </li>
                        <li className="nav-item mb-3">
                            <a href="/calendar" className="nav-link dashboard-btn text-white">
                                <i className="bi bi-circle me-2"></i> Calendar
                            </a>
                        </li>
                    </ul>
                    <div className="mt-auto">
                        <a href="/settings" className="nav-link dashboard-btn">
                            <i className="bi bi-gear me-2"></i>Settings
                        </a>
                        <a href="/logout" className="nav-link dashboard-btn mt-2">
                            <i className="bi bi-box-arrow-right me-2"></i>Logout
                        </a>
                    </div>
                </div>

                {/* Main content */}
                <div className="main-content">
                    {/* Topbar */}
                    <div className="topbar">
                        <div>
                            <h2 className="mt-2">¡Haz las cosas sencillas!</h2>
                            <p className="text-muted">
                                Administra y planea tus citas de la mejor manera a un click
                            </p>
<div className="d-flex gap-2 align-items-center flex-wrap">
    <span className="badge rounded-pill bg-primary px-3 py-2 topbar-btn">CATEGORIAS</span>
    <span className="badge rounded-pill bg-primary px-3 py-2 topbar-btn">CERCA DE TI</span>
    <span className="badge rounded-pill bg-primary px-3 py-2 topbar-btn">MAPA</span>
    
    {/* Input de búsqueda */}
    <div className="d-flex align-items-center search-bar px-2 py-1 rounded text-black">
        <input
            type="text"
            className="form-control form-control-sm text-white bg-transparent border-1 border-light me-2"
            placeholder="Buscar..."
            style={{ minWidth: "270px", borderRadius: "50px" }}
        />
        <button className="btn btn-sm btn-outline-light" style={{ borderRadius: "8px" }}>
            🔍
        </button>
    </div>
</div>

                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <h3 className="btn btn-sm btn-outline-light topbar-btn">Nombre del Usuario</h3>
                            <img
                                src="https://randomuser.me/api/portraits/men/75.jpg"
                                alt="User"
                                className="rounded-circle"
                                style={{ width: "50px" }}
                            />
                        </div>
                    </div>

                    {/* Middle Section */}
                    <div className="d-flex content-section">
                        {/* Left Section */}
                        <div className="flex-grow-1">
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(35, 35, 60, 0.8)" }}>
                                <h6 className="text-info">Today</h6>
                                <div>
                                    <p className="mb-1 fw-bold">ESTAS SON TUS CITAS PENDIENTES</p>
                                    <p className="mb-1">Description:</p>
                                    <small>08:00 AM - 10:00 AM</small>
                                </div>
                            </div>
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(40, 40, 90, 0.85)" }}>
                                <h6 className="text-info">RECORDATORIO</h6>
                                <p className="mb-1 fw-bold">LLEVA UN RECORDATORIO DE TUS CITAS</p>
                                <p className="mb-2">No tienes ningún recordatorio creado</p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="p-3 rounded" style={{ width: "360px", background: "rgba(45, 45, 70, 0.85)" }}>
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 90, 0.9)" }}>
                                <h6>Tarjetas de negocios con posibles citas</h6>
                                <p className="mb-1">Aca van algunas tarjetas de negocio que pueden interesarte</p>
                                <button className="btn btn-sm btn-primary d-block mt-2">Botón para abrir el negocio</button>
                            </div>
                            <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 100, 0.9)" }}>
                                <h6>Barbería</h6>
                                <p>Nuestra barbería es la mejor, agenda tu cita ya</p>
                                <p>Cel: 3012408555</p>
                                <button className="btn btn-sm btn-outline-light">Más info</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline CSS */}
            <style>{`
.dashboard-layout {
    position: relative;
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: Arial, sans-serif;
    color: white;
    z-index: 0; /* Asegura que el contenido esté sobre la capa oscura */
}

.dashboard-layout::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://images.unsplash.com/photo-1522199710521-72d69614c702?fit=crop&w=1950&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.4); /* 🔆 Controla el brillo aquí */
    z-index: -1; /* Pone la imagen detrás del contenido */
}



                .sidebar {
                    width: 250px;
                    background-color: rgba(18, 18, 28, 0.85);
                    padding: 1rem;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    
                }

                .sidebar .dashboard-btn {
                    font-size: 0.9rem;
                    transition: transform 0.2s ease;
                }

                .sidebar .dashboard-btn:hover {
                    transform: scale(1.1);
                }

                .topbar {
                    position: sticky;
                    top: 0;
                    
                    z-index: 10;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .topbar .topbar-btn {
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }

                .topbar .topbar-btn:hover {
                    transform: scale(1.1);
                }

                .main-content {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 1rem 2rem;
                }

                .content-section {
                    gap: 24px;
                }

                .search-bar input::placeholder {
    color: #ccc;
}

.search-bar input:focus {
    box-shadow: none;
    outline: none;
    border-color: #0d6efd;
    background-color: rgba(255, 255, 255, 0.05);
}


            `}</style>
        </>
    );
}
