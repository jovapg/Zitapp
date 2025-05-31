import NotificationsDropdown  from './Notifacation/NotificationsDropdown';

export default function TopbarNegocio({ onNavigate }) {
    const user = JSON.parse(localStorage.getItem("user"));

    
    


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
            <NotificationsDropdown />
                    
                    <h3 className="btn btn-sm btn-outline-light topbar-btn">{user.nombre}</h3>
                    <img
                        src="https://randomuser.me/api/portraits/men/75.jpg"
                        alt="User"
                        className="rounded-circle"
                        style={{ width: "50px" }}
                    />
                </div>
            </div>
            {/* tus estilos... */}
        </>
    );
}