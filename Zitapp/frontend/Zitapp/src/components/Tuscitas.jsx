import React from 'react';

export default function TusCitas() {
  return (
    <>
      <div className="d-flex content-section">
        {/* Left Column */}
        <div className="flex-grow-1">
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(35, 35, 60, 0.8)" }}>
            <h6 className="text-info">Today</h6>
            <p className="mb-1 fw-bold">ESTAS SON TUS CITAS PENDIENTES</p>
            <p className="mb-1">Description:</p>
            <small>08:00 AM - 10:00 AM</small>
          </div>
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(40, 40, 90, 0.85)" }}>
            <h6 className="text-info">RECORDATORIO</h6>
            <p className="mb-1 fw-bold">LLEVA UN RECORDATORIO DE TUS CITAS</p>
            <p>No tienes ningún recordatorio creado</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="p-3 rounded" style={{ width: "360px", background: "rgba(45, 45, 70, 0.85)" }}>
          {/* Tarjeta 1 */}
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 90, 0.9)" }}>
            <div className="card border-0">
              <img
                src="https://unimedios.usc.edu.co/wp-content/uploads/2023/08/Publicidad-para-barberia.jpg"
                className="card-img-top rounded"
                alt="Delicias Gourmet"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <div className="card-body bg-dark text-white rounded-bottom">
                <h5 className="card-title mb-1">Barber shop</h5>
                <p className="card-text mb-2">La mejor barberia en la ciudad</p>
                <button className="btn btn-sm btn-primary">Agendar cita</button>
              </div>
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 100, 0.9)" }}>
            <div className="card border-0">
              <img
                src="https://www.shortcuts.es/wp-content/uploads/2015/11/beauty1-1030x686.jpg"
                className="card-img-top rounded"
                alt="Estética Belleza Total"
                style={{ height: "160px", objectFit: "cover" }}
              />
              <div className="card-body bg-dark text-white rounded-bottom">
                <h5 className="card-title mb-1">Belleza Total</h5>
                <p className="card-text mb-2">Peinados y manicure profesional</p>
                <button className="btn btn-sm btn-primary">Agendar cita</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .content-section {
          display: flex;
          gap: 24px;
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}
