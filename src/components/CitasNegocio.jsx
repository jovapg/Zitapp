import React from 'react';
import AgendadeCitasNegocio from '../Pages/Calendar/AgendadeCitasNegocio';

export default function CitasNegocio() {
  return (
    <>
      <div className="d-flex content-section">
        {/* Left Column */}
        <div className="flex-grow-1">
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(35, 35, 60, 0.8)" }}>

            <AgendadeCitasNegocio />
          </div>
          <div className="p-3 mb-4 rounded" style={{ background: "rgba(40, 40, 90, 0.85)" }}>

          </div>
        </div>

        {/* Right Column */}
        <div className="p-3 rounded" style={{ width: "360px", background: "rgba(45, 45, 70, 0.85)" }}>


            <h6 className="text-info">AGENDA PARA MAÑANA</h6>
            <p className="mb-1 fw-bold"> TUS CITAS</p>
            <p>No tienes ninguna cita agendada paraa mañana</p>

          <div className="p-3 mb-4 rounded" style={{ background: "rgba(55, 55, 100, 0.9)" }}>

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
