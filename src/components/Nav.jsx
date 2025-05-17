import fondologin from '../assets/img/logo.png';

export default function Nav({ onNavigate }) {
    return (
        <div className="sidebar">
            <div className="mb-4 text-center">
                <img
                    src={fondologin}
                    alt="login icon"
                    className="img-fluid mt-2"
                    style={{ width: '90px' }}
                />
            </div>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-3">
                    <button
                        onClick={() => onNavigate('categorias')}
                        className="nav-link dashboard-btn text-white btn btn-link text-start"
                    >
                        <i className="bi bi-circle me-2"></i> Categorías
                    </button>
                </li>
                <li className="nav-item mb-3">
                    <button
                        onClick={() => onNavigate('tuscitas')}
                        className="nav-link dashboard-btn text-white btn btn-link text-start"
                    >
                        <i className="bi bi-circle me-2"></i> Tus Citas
                    </button>
                </li>
                <li className="nav-item mb-3">
                    <a href="" className="nav-link dashboard-btn text-white">
                        <i className="bi bi-circle me-2"></i> Ver Negocios
                    </a>
                </li>
                <li className="nav-item mb-3">
                    <button
                        onClick={() => onNavigate('calendar')}
                        className="nav-link dashboard-btn text-white btn btn-link text-start"
                    >
                        <i className="bi bi-circle me-2"></i> Calendar
                    </button>
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

            {/* Estilos */}
            <style>{`
                .sidebar {
                    width: 250px;
                    background-color: rgba(18, 18, 28, 0.85);
                    padding: 1rem;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    color: white;
                }

                .dashboard-btn {
                    font-size: 0.9rem;
                    transition: transform 0.2s ease;
                }

                .dashboard-btn:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}
