import React, { useState } from 'react';

export default function Topbar({ onSearch }) {
    const [busqueda, setBusqueda] = useState('');

    const manejarBusqueda = () => {
        onSearch(busqueda.toLowerCase());
    };

    return (
        <div className="topbar d-flex justify-content-between align-items-center p-3"  style={{
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: 'rgba(0,0,0,0.6)' // para que no sea transparente si tienes fondo
}}>
            <div>
                <h2 className="mt-2 text-white">¡Haz las cosas sencillas!</h2>
                <p className="text">
                    Administra y planea tus citas de la mejor manera a un click
                </p>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                    <span className="badge rounded-pill bg-primary px-3 py-2 topbar-btn">CATEGORIAS</span>
                    <span className="badge rounded-pill bg-primary px-3 py-2 topbar-btn">CERCA DE TI</span>
                    <span className="badge rounded-pill bg-primary px-3 py-2 topbar-btn">MAPA</span>

                    <div className="d-flex align-items-center search-bar px-2 py-1 rounded text-black">
                        <input
                            type="text"
                            className="form-control form-control-sm text-white bg-transparent border-1 border-light me-2"
                            placeholder="Buscar..."
                            style={{ minWidth: "270px", borderRadius: "50px" }}
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && manejarBusqueda()}
                        />
                        <button className="btn btn-sm btn-outline-light" style={{ borderRadius: "8px" }} onClick={manejarBusqueda}>
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
    );
}
