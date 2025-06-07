import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Grafica() {
  const [appointmentData, setAppointmentData] = useState(null);
  const [userData, setUserData] = useState(null);

  const barOptions = {
    plugins: {
      legend: {
        labels: { color: '#fff' }, // color del texto de la leyenda
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff' }, // color de etiquetas eje x
        grid: { color: '#444' },
      },
      y: {
        ticks: { color: '#fff' }, // color de etiquetas eje y
        grid: { color: '#444' },
      },
    },
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: { color: '#fff' }, // color del texto de la leyenda
      },
    },
  };

  useEffect(() => {
    // Citas por estado
    fetch('http://localhost:8081/api/appointments/all')
      .then(res => res.json())
      .then(data => {
        const counts = {};
        data.forEach(cita => {
          const estado = cita.estado || 'Desconocido';
          counts[estado] = (counts[estado] || 0) + 1;
        });

        const estados = Object.keys(counts);
        const colores = estados.map(estado => {
          switch (estado) {
            case 'PENDIENTE': return '#f6c23e';
            case 'CONFIRMADA': return '#1cc88a';
            case 'CANCELADA': return '#e74a3b';
            case 'FINALIZADA': return '#4e73df';
            default: return '#858796';
          }
        });

        setAppointmentData({
          labels: estados,
          datasets: [
            {
              label: 'Citas por estado',
              backgroundColor: colores,
              borderColor: '#ddd',
              borderWidth: 1,
              data: Object.values(counts),
            },
          ],
        });
      });

    // Usuarios por tipo
    fetch('http://localhost:8081/api/users')
      .then(res => res.json())
      .then(data => {
        const counts = {};
        data.forEach(user => {
          const tipo = user.tipo || 'Desconocido';
          counts[tipo] = (counts[tipo] || 0) + 1;
        });
        setUserData({
          labels: Object.keys(counts),
          datasets: [
            {
              data: Object.values(counts),
              backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
              hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
              hoverBorderColor: 'rgba(234, 236, 244, 1)',
            },
          ],
        });
      });
  }, []);

  return (
    <>
      <div className="col-xl-8 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
            <h6 className="m-0 font-weight-bold text-emerald-400">Resumen de Citas</h6>
          </div>
          <div className="card-body bg-dark">
            <div className="chart-area">
              {appointmentData ? (
                <Bar data={appointmentData} options={barOptions} />
              ) : (
                <p className="text-white">Cargando datos de citas...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-5">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-primary text-white">
            <h6 className="m-0 font-weight-bold text-white">Tipos de Usuarios</h6>
          </div>
          <div className="card-body bg-dark">
            <div className="chart-pie pt-4 pb-2">
              {userData ? (
                <Pie data={userData} options={pieOptions} />
              ) : (
                <p className="text-white">Cargando datos de usuarios...</p>
              )}
            </div>
            <div className="mt-4 text-center small text-white">
              <span className="mr-2">
                <i className="fas fa-circle mr-1" style={{ color: '#4e73df' }}></i> Cliente
              </span>
              <span className="mr-2">
                <i className="fas fa-circle mr-1" style={{ color: '#1cc88a' }}></i> Negocio
              </span>
              <span className="mr-2">
                <i className="fas fa-circle mr-1" style={{ color: '#36b9cc' }}></i> Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
