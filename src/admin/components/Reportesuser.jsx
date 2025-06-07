import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportesUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8081/api/users")
      .then((res) => {
        setUsuarios(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar usuarios:", err);
        setCargando(false);
      });
  }, []);

  // Exportar CSV
  const exportarCSV = () => {
    if (usuarios.length === 0) return alert("No hay datos para exportar");

    const encabezados = Object.keys(usuarios[0]).join(",");
    const filas = usuarios.map((user) => Object.values(user).join(","));
    const contenido = [encabezados, ...filas].join("\n");

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "usuarios.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar PDF con mejor diseño

const exportarPDF = () => {
  if (usuarios.length === 0) return alert("No hay datos para exportar");

  try {
    const doc = new jsPDF('landscape');
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const horaActual = new Date().toLocaleTimeString('es-ES');

    const colorPrimario = [41, 128, 185];
    const colorTexto = [44, 62, 80];

    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE USUARIOS', 20, 22);

    doc.setTextColor(...colorTexto);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el: ${fechaActual} a las ${horaActual}`, 20, 45);
    doc.text(`Total de usuarios: ${usuarios.length} registros`, 20, 52);

    // Resumen por tipo de usuario
    const tiposUsuario = usuarios.reduce((acc, user) => {
      acc[user.tipo] = (acc[user.tipo] || 0) + 1;
      return acc;
    }, {});

    let yPos = 58;
    doc.setFont('helvetica', 'bold');
    doc.text('Distribución por tipo:', 20, yPos);
    doc.setFont('helvetica', 'normal');

    Object.entries(tiposUsuario).forEach(([tipo, cantidad]) => {
      yPos += 6;
      doc.text(`• ${tipo}: ${cantidad} usuarios`, 25, yPos);
    });

    const camposMap = {
      'id': 'ID',
      'nombre': 'Nombre Completo',
      'email': 'Correo Electrónico',
      'telefono': 'Teléfono',
      'tipo': 'Tipo Usuario',
      'edad': 'Edad',
      'businessId': 'ID Negocio'
    };

    const camposExcluidos = ['contrasena', 'imagenPerfil'];
    const keys = Object.keys(usuarios[0]).filter(key => !camposExcluidos.includes(key));
    const headers = keys.map(key => camposMap[key] || key.toUpperCase());

    const rows = usuarios.map(user =>
      keys.map(key => {
        const valor = user[key];

        switch (key) {
          case 'tipo':
            // Mostrar los tipos de usuario exactamente como son
            if (valor === 'CLIENTE') return 'CLIENTE';
            if (valor === 'NEGOCIO') return 'NEGOCIO';
            if (valor === 'ADMIN') return 'ADMIN';
            return valor;
          case 'edad':
            return valor ? `${valor} años` : 'N/A';
          case 'telefono':
            return valor || 'No registrado';
          case 'businessId':
            return valor ? `#${valor}` : 'N/A';
          default:
            return valor !== null && valor !== undefined ? String(valor) : 'N/A';
        }
      })
    );

    autoTable(doc, {
      startY: yPos + 15,
      head: [headers],
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle',
        halign: 'left',
        overflow: 'linebreak',
        textColor: colorTexto,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
        minCellHeight: 10,
      },
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' }, // ID
        1: { cellWidth: 55, fontStyle: 'bold' }, // Nombre
        2: { cellWidth: 80, overflow: 'linebreak' }, // Email con salto de línea si es largo
        3: { cellWidth: 40, halign: 'center' }, // Teléfono
        4: { cellWidth: 30, halign: 'center' }, // Tipo
        5: { cellWidth: 20, halign: 'center' }, // Edad
        6: { cellWidth: 30, halign: 'center' } // Business ID
      },
      margin: { left: 20, right: 20 },
      theme: 'striped',
      tableLineColor: [220, 220, 220],
      tableLineWidth: 0.1,
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setDrawColor(220, 220, 220);
        doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');

        doc.text('Sistema de Gestión de Usuarios', 20, pageHeight - 15);
        doc.text('Documento generado automáticamente', 20, pageHeight - 10);

        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          pageWidth - 60,
          pageHeight - 15
        );

        doc.text(
          `${fechaActual}`,
          pageWidth - 60,
          pageHeight - 10
        );
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const nombreArchivo = `Reporte_Usuarios_${timestamp}.pdf`;
    doc.save(nombreArchivo);
    console.log(`PDF generado exitosamente: ${nombreArchivo}`);

  } catch (error) {
    console.error('Error al exportar PDF:', error);
    alert('Error al generar el archivo PDF. Por favor, inténtelo nuevamente.');
  }
};


  return (
    <div className="card mt-4 shadow-sm p-4 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">
      <h4>Exportar Reporte de Usuarios</h4>
      <p className="text-muted">Descarga los datos de los usuarios en formato PDF o CSV.</p>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="d-flex gap-3">
          <button className="btn btn-success" onClick={exportarCSV}>
            Exportar CSV
          </button>
          <button className="btn btn-danger" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>
      )}
    </div>
  );
}
