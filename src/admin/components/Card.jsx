import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Card({ title, icon, apiEndpoint }) {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamada a la API que se pasa por props
    axios.get(apiEndpoint)
      .then(res => {
        // Asumimos que la respuesta es un array
        setCount(res.data.length);
      })
      .catch(err => {
        setError("Error al cargar datos");
        console.error(err);
      });
  }, [apiEndpoint]);

  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className="card border-left-primary shadow h-100 py-2 bg-secondary text-white">

        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                {title}
              </div>
              <div className="h5 mb-0 font-weight-bold text-white-800">
                {error ? error : (count !== null ? count : "...")}
              </div>
            </div>
            <div className="col-auto">
              <i className={`fas ${icon} fa-2x text-gray-300`}></i>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
