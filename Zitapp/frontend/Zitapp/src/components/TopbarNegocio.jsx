

export default function TopbarNegocio({ onNavigate }) {
    return (
        <>
            <div className="topbar d-flex justify-content-between align-items-center p-3">
                <div>
                    <h2 className="mt-2 text-white">¡Haz las cosas sencillas!</h2>
                    <p className="text">
                        Administra y planea tu agenda de la mejor manera a un click
                    </p>

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

            {/* Estilos específicos del Topbar */}
            <style>{`
                .topbar {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(6px);
                    color: white;
                }

                .topbar-btn {
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }

                .topbar-btn:hover {
                    transform: scale(1.1);
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
