import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import axios from 'axios';

export default function ReportesCitas() {
  const [citas, setCitas] = useState([]);

  // Cargar todas las citas desde el backend al montar el componente
  useEffect(() => {
    axios.get('http://localhost:8081/api/appointments/all')
      .then(response => {
        setCitas(response.data);
      })
      .catch(error => {
        console.error('Error al cargar las citas:', error);
      });
  }, []);

  // Función para convertir el arreglo dateTime a formato legible
  const formatearFechaHora = (dateTime) => {
    const fecha = new Date(...dateTime);
    return fecha.toLocaleString();
  };

  // Exportar a PDF con jsPDF y autoTable
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Citas', 14, 10);

    const rows = citas.map(cita => [
      cita.id,
      cita.client?.nombre,
      cita.business?.nombre,
      cita.service?.nombre,
      formatearFechaHora(cita.dateTime),
      cita.estado
    ]);

    doc.autoTable({
      head: [['ID', 'Cliente', 'Negocio', 'Servicio', 'Fecha y Hora', 'Estado']],
      body: rows,
      startY: 20
    });

    doc.save('reporte_citas.pdf');
  };

  // Configuración para exportar a CSV
  const headers = [
    { label: "ID", key: "id" },
    { label: "Cliente", key: "cliente" },
    { label: "Negocio", key: "negocio" },
    { label: "Servicio", key: "servicio" },
    { label: "Fecha y Hora", key: "fechaHora" },
    { label: "Estado", key: "estado" },
  ];

  const datosCSV = citas.map(cita => ({
    id: cita.id,
    cliente: cita.client?.nombre,
    negocio: cita.business?.nombre,
    servicio: cita.service?.nombre,
    fechaHora: formatearFechaHora(cita.dateTime),
    estado: cita.estado
  }));

  return (
    <div className="card mt-4  shadow-sm p-4 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">
      <h4>Exportar Reporte de Citas</h4>
      <p className="text-muted">Descarga los datos en formato PDF o CSV.</p>

      <div className="d-flex gap-3">
        <button onClick={exportarPDF} className="btn btn-danger">
          Exportar PDF
        </button>

        <CSVLink
          data={datosCSV}
          headers={headers}
          filename="reporte_citas.csv"
          className="btn btn-success"
        >
          Exportar CSV
        </CSVLink>
      </div>
    </div>
  );
}
