import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportesNegocios() {
  const [negocios, setNegocios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resNegocios = await fetch('http://localhost:8081/api/businesses');
        if (!resNegocios.ok) throw new Error('Error al obtener negocios');
        const dataNegocios = await resNegocios.json();

        const negociosConDatos = await Promise.all(
          dataNegocios.map(async (negocio) => {
            const [resServicios, resDisponibilidad] = await Promise.all([
              fetch(`http://localhost:8081/api/services/businesses/${negocio.id}/services`),
              fetch(`http://localhost:8081/api/availability/business/${negocio.id}`)
            ]);

            if (!resServicios.ok || !resDisponibilidad.ok)
              throw new Error('Error al obtener servicios o disponibilidad');

            const servicios = await resServicios.json();
            const disponibilidad = await resDisponibilidad.json();

            return {
              ...negocio,
              servicios,
              disponibilidad
            };
          })
        );

        setNegocios(negociosConDatos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  // Exportar PDF con autoTable para mejor formato
  const exportarPDF = () => {
    if (negocios.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Negocios', 14, 20);

    negocios.forEach((n, index) => {
      const serviciosText = n.servicios.map(s => s.name).join(', ') || 'Sin servicios';
      const disponibilidadText = n.disponibilidad
        .map(d => `${d.day} ${d.startTime} - ${d.endTime}`)
        .join(', ') || 'Sin disponibilidad';

      // Cabecera de negocio
      doc.setFontSize(14);
      doc.text(`Nombre: ${n.name}`, 14, 30);
      doc.setFontSize(12);
      doc.text(`Email: ${n.email}`, 14, 36);

      // Tabla con servicios y disponibilidad
      autoTable(doc, {
        startY: 42,
        head: [['Servicios', 'Disponibilidad']],
        body: [[serviciosText, disponibilidadText]],
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        theme: 'grid'
      });

      // Agregar página si no es el último
      if (index < negocios.length - 1) doc.addPage();
    });

    doc.save('reporte_negocios.pdf');
  };

  // Preparar CSV con chequeo
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Nombre', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Servicios', key: 'serviciosString' },
    { label: 'Disponibilidad', key: 'disponibilidadString' }
  ];

  const datosCSV = negocios.map((n) => ({
    id: n.id,
    name: n.name,
    email: n.email,
    serviciosString: n.servicios.length > 0 ? n.servicios.map((s) => s.name).join(', ') : 'Sin servicios',
    disponibilidadString:
      n.disponibilidad.length > 0
        ? n.disponibilidad.map((d) => `${d.day} ${d.startTime}-${d.endTime}`).join(' | ')
        : 'Sin disponibilidad'
  }));

  return (
    <div className="card mt-4 shadow-sm p-4 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">
      <h4>Exportar Reporte de Negocios</h4>
      <p className="text-muted">Descarga los datos de los negocios en formato PDF o CSV.</p>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : negocios.length === 0 ? (
        <p>No se encontraron negocios para mostrar.</p>
      ) : (
        <div className="d-flex gap-3">
          <button onClick={exportarPDF} className="btn btn-danger">
            Exportar PDF
          </button>

          <CSVLink data={datosCSV} headers={headers} filename="reporte_negocios.csv" className="btn btn-success">
            Exportar CSV
          </CSVLink>
        </div>
      )}
    </div>
  );
}
