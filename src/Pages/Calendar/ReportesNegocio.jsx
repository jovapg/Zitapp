import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import fondoAzuli from '../../assets/img/fondo_azul_editado.png';

// --- ESTILOS COMPARTIDOS FUERA DEL COMPONENTE (Para evitar re-creación en cada render) ---
const darkContainerStyle = {
  backgroundColor: '#161b22', // Fondo del dashboard, un poco más claro que el body
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  padding: '30px',
  color: '#e6edf3' // Color de texto por defecto para el contenedor
};

// Función para obtener el color del medidor (gauge)
const getGaugeColor = (progress) => {
    if (progress >= 80) return '#28a745'; // High - Green
    if (progress >= 50) return '#ffa500'; // Medium - Orange
    return '#dc3545'; // Low - Red
};

// Función auxiliar para generar puntos para SVG Polyline (simula la gráfica)
const generateChartPoints = (data, svgHeight, paddingY_top, svgWidth, paddingX_left) => {
    // Escalar los datos para ajustarse a la altura del SVG, dejando espacio para padding
    const effectiveChartHeight = svgHeight - (paddingY_top * 2); // Altura disponible para la línea
    const effectiveChartWidth = svgWidth - (paddingX_left * 2); // Ancho disponible para la línea
    const maxDataValue = Math.max(...data, 1); // Evitar división por cero si todos son 0

    const points = data.map((value, index) => {
        const x = ((index) / (data.length - 1)) * effectiveChartWidth + paddingX_left;
        // Invertir Y para que valores altos estén arriba (SVG 0,0 es arriba-izquierda)
        const y = svgHeight - paddingY_top - (value / maxDataValue) * effectiveChartHeight;
        return `${x},${y}`;
    }).join(' ');
    return points;
};

export default function ReportesNegocio() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [appointments, setAppointments] = useState([]); // Todas las citas del negocio
  const [services, setServices] = useState([]); // Todos los servicios del negocio
  const [metaSemanal, setMetaSemanal] = useState(50); // Meta de citas confirmadas por semana (ejemplo)
  const [incomeFilter, setIncomeFilter] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // --- Efecto para el fondo del body ---
  useEffect(() => {
    const originalBodyStyle = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundRepeat: document.body.style.backgroundRepeat,
      backgroundColor: document.body.style.backgroundColor,
      margin: document.body.style.margin
    };
    document.body.style.backgroundImage = `url(${fondoAzuli})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = '#000';
    document.body.style.margin = '0';
    return () => {
      document.body.style.backgroundImage = originalBodyStyle.backgroundImage;
      document.body.style.backgroundSize = originalBodyStyle.backgroundSize;
      document.body.style.backgroundPosition = originalBodyStyle.backgroundPosition;
      document.body.style.backgroundRepeat = originalBodyStyle.backgroundRepeat;
      document.body.backgroundColor = originalBodyStyle.backgroundColor;
      document.body.style.margin = originalBodyStyle.margin;
    };
  }, []);

  // --- Cargar businessId desde localStorage ---
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.tipo === 'NEGOCIO' && user.businessId) {
          setBusinessId(user.businessId);
        } else {
          setError('No eres un usuario de negocio o no se encontró el ID del negocio asociado.');
          setLoading(false);
        }
      } else {
        setError('No hay sesión iniciada. Por favor, inicia sesión.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error al parsear datos de usuario de localStorage:', err);
      setError('Error al leer la información de sesión.');
      setLoading(false);
    }
  }, []);

  // --- Función para transformar datos de citas de la API ---
  const transformAppointmentData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(appointment => {
      const fechaArray = appointment.fecha || [];
      const horaArray = appointment.hora || [];
      const [year, month, day] = fechaArray;
      const fechaString = (year && month && day) ? `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
      const [hour, minute] = horaArray;
      const horaString = (hour && minute) ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00` : '';
      
      const client = appointment.client || {};
      const business = appointment.business || {};
      const service = appointment.service || {};

      const estadoMapping = {
        'PENDIENTE': 'pendiente',
        'CONFIRMADA': 'confirmado',
        'CANCELADA': 'cancelado',
        'FINALIZADA': 'finalizado'
      };
      const estado = appointment.estado ? estadoMapping[appointment.estado.toUpperCase()] || appointment.estado.toLowerCase() : 'desconocido';

      return {
        id: appointment.id,
        fecha: fechaString,
        hora: horaString,
        estado: estado,
        client_name: client.nombre || 'N/A',
        service_id: service.id || null,
        service_name: service.nombre || 'N/A',
        service_price: service.precio || 0,
        service_duration: service.duracion || 0,
        business_name: business.nombre || 'N/A',
        service: service
      };
    });
  };

  // --- Cargar todas las citas y servicios del negocio ---
  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) return;
      setLoading(true);
      setError(null);
      try {
        const [appointmentsRes, servicesRes] = await Promise.all([
          axios.get(`http://localhost:8081/api/appointments/business/${businessId}`),
          // ¡CORRECCIÓN DE LA URL AQUÍ!
          axios.get(`http://localhost:8081/api/services/businesses/${businessId}/services`)
        ]);

        const transformedAppointments = transformAppointmentData(appointmentsRes.data);
        setAppointments(transformedAppointments);
        setServices(servicesRes.data);
        
      } catch (err) {
        console.error('Error fetching data for reports:', err);
        setError('Error al cargar los datos para los reportes. Por favor, verifica la conexión o intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId]);

  // --- Cálculo de métricas (memorizadas para eficiencia) ---
  const metrics = useMemo(() => {
    if (appointments.length === 0) {
      return {
        totalCitasMes: 0,
        citasPorConfirmar: 0,
        citasConfirmadas: 0,
        citasCanceladas: 0,
        progresoMetaSemanal: 0,
        totalCitasConfirmadasSemana: 0,
        citasConfirmadasPorMes: Array(12).fill(0),
        ingresosConfirmadosAgrupados: {}, // Se agruparán por día, semana o mes
        totalIngresosConfirmados: 0
      };
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    let totalCitasMes = 0;
    let citasPorConfirmar = 0;
    let citasConfirmadas = 0;
    let citasCanceladas = 0;
    let totalCitasConfirmadasSemana = 0;
    const citasConfirmadasPorMes = Array(12).fill(0);
    
    const ingresosConfirmadosAgrupados = {};
    let totalIngresosConfirmados = 0;

    // Calcular la fecha de inicio y fin de la semana actual (Lunes a Domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // Lunes
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo
    endOfWeek.setHours(23, 59, 59, 999);

    appointments.forEach(app => {
      const appDate = new Date(app.fecha);
      const appMonth = appDate.getMonth() + 1;
      const appYear = appDate.getFullYear();

      // Citas del mes actual (para indicadores superiores)
      if (appMonth === currentMonth && appYear === currentYear) {
        totalCitasMes++;
        if (app.estado === 'pendiente') citasPorConfirmar++;
        if (app.estado === 'confirmado') citasConfirmadas++;
        if (app.estado === 'cancelado') citasCanceladas++;
      }

      // Citas confirmadas por mes (para la gráfica anual)
      if (app.estado === 'confirmado' && appYear === currentYear) {
        citasConfirmadasPorMes[appDate.getMonth()]++;
      }

      // Citas confirmadas de la semana actual (para la meta semanal)
      if (app.estado === 'confirmado' && appDate >= startOfWeek && appDate <= endOfWeek) {
          totalCitasConfirmadasSemana++;
      }

      // Datos para la tabla de ingresos (solo citas confirmadas)
      if (app.estado === 'confirmado' && app.service_price > 0) {
        totalIngresosConfirmados += app.service_price; // Suma al total general

        let groupKey;
        // Agrupar por el filtro seleccionado
        if (incomeFilter === 'daily') {
            groupKey = app.fecha; // YYYY-MM-DD
        } else if (incomeFilter === 'weekly') {
            const startOfWeekForApp = new Date(appDate);
            startOfWeekForApp.setDate(appDate.getDate() - (appDate.getDay() === 0 ? 6 : appDate.getDay() - 1));
            const endOfWeekForApp = new Date(startOfWeekForApp);
            endOfWeekForApp.setDate(startOfWeekForApp.getDate() + 6);
            groupKey = `${startOfWeekForApp.toISOString().slice(0, 10)} to ${endOfWeekForApp.toISOString().slice(0, 10)}`;
        } else if (incomeFilter === 'monthly') {
            groupKey = `${appYear}-${appMonth.toString().padStart(2, '0')}`; // YYYY-MM
        }

        if (!ingresosConfirmadosAgrupados[groupKey]) {
            ingresosConfirmadosAgrupados[groupKey] = { total: 0, appointments: [] };
        }
        ingresosConfirmadosAgrupados[groupKey].total += app.service_price;
        ingresosConfirmadosAgrupados[groupKey].appointments.push(app);
      }
    });

    const progresoMetaSemanal = metaSemanal > 0 ? (totalCitasConfirmadasSemana / metaSemanal) * 100 : 0;

    return {
      totalCitasMes,
      citasPorConfirmar,
      citasConfirmadas,
      citasCanceladas,
      progresoMetaSemanal: Math.min(100, Math.round(progresoMetaSemanal)), // Limitar a 100%
      totalCitasConfirmadasSemana,
      citasConfirmadasPorMes,
      ingresosConfirmadosAgrupados,
      totalIngresosConfirmados
    };
  }, [appointments, metaSemanal, incomeFilter]); // Recalcular cuando cambian citas, meta o el filtro de ingresos

  // --- Renderizado de componentes ---
  if (loading) {
    return (
      <div className="container p-4" style={darkContainerStyle}>
        <div className="text-center text-white">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-4" style={darkContainerStyle}>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={darkContainerStyle}>
      <h1 className="text-white mb-4">Reportes del Negocio</h1>

      {/* Current Risk / Indicadores de Citas */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card-custom">
            <div className="card-body">
              <h5 className="card-title text-secondary-light">Total Citas Mes</h5>
              <p className="card-text text-white display-5">{metrics.totalCitasMes}</p>
              <div className="icon-bg bg-purple">📅</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card-custom">
            <div className="card-body">
              <h5 className="card-title text-secondary-light">Citas Pendientes</h5>
              <p className="card-text text-white display-5">{metrics.citasPorConfirmar}</p>
              <div className="icon-bg bg-orange">⏱️</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card-custom">
            <div className="card-body">
              <h5 className="card-title text-secondary-light">Citas Confirmadas</h5>
              <p className="card-text text-white display-5">{metrics.citasConfirmadas}</p>
              <div className="icon-bg bg-green">✅</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card-custom">
            <div className="card-body">
              <h5 className="card-title text-secondary-light">Citas Canceladas</h5>
              <p className="card-text text-white display-5">{metrics.citasCanceladas}</p>
              <div className="icon-bg bg-red">❌</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score / Meta Semanal */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card-custom h-100 d-flex flex-column align-items-center justify-content-center">
            <h5 className="card-title text-secondary-light mb-3">Meta Semanal</h5>
            <div className="gauge-container mb-3">
              <div className="gauge-outer" style={{ borderColor: getGaugeColor(metrics.progresoMetaSemanal) }}>
                <div className="gauge-progress" style={{ transform: `rotate(${metrics.progresoMetaSemanal * 1.8}deg)` }}></div>
                <div className="gauge-inner">
                  <span className="gauge-score text-white">{metrics.totalCitasConfirmadasSemana}</span>
                  <span className="gauge-subtext text-secondary-light">/{metaSemanal}</span>
                </div>
              </div>
              <span className="gauge-percentage text-white mt-2">{metrics.progresoMetaSemanal}%</span>
            </div>
            <p className="text-white text-center">
                Citas confirmadas esta semana
            </p>
            <div className="input-group mt-3 w-75">
                <span className="input-group-text bg-dark-secondary border-0 text-white">Meta:</span>
                <input 
                    type="number" 
                    className="form-control bg-dark-secondary border-0 text-white" 
                    value={metaSemanal} 
                    onChange={(e) => setMetaSemanal(parseInt(e.target.value) || 0)} 
                    min="0"
                />
            </div>
          </div>
        </div>

        {/* Threat Summary / Gráfica de Citas Confirmadas Mensuales */}
        <div className="col-lg-8">
          <div className="card-custom h-100">
            <h5 className="card-title text-secondary-light mb-3">Citas Confirmadas por Mes ({new Date().getFullYear()})</h5>
            <div className="chart-area" style={{ height: '250px', width: '100%' }}>
              <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Eje X (meses) */}
                {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map((month, index) => (
                    <text key={month} x={(index / 11) * 360 + 20} y="245" fill="#8b949e" fontSize="12" textAnchor="middle">{month}</text>
                ))}
                {/* Eje Y (líneas horizontales de guía) */}
                {[0, 20, 40, 60, 80, 100].map(val => (
                    <line key={`y-${val}`} x1="10" y1={230 - (val / 100 * 200)} x2="390" y2={230 - (val / 100 * 200)} stroke="#30363d" strokeDasharray="2" />
                ))}
                {/* Puntos y línea de la gráfica */}
                <polyline
                  fill="none"
                  stroke="#8a2be2"
                  strokeWidth="3"
                  points={generateChartPoints(metrics.citasConfirmadasPorMes, 220, 10, 380, 20)}
                />
                 {metrics.citasConfirmadasPorMes.map((value, index) => {
                    const x = ((index) / 11) * 360 + 20;
                    const y = 230 - (value / Math.max(...metrics.citasConfirmadasPorMes, 1)) * 200;
                    return (
                        <circle key={index} cx={x} cy={y} r="5" fill="#8a2be2" stroke="#0d1117" strokeWidth="2" />
                    );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Threats By Virus / Lista de Servicios del Negocio */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card-custom h-100">
            <h5 className="card-title text-secondary-light mb-3">Servicios del Negocio</h5>
            <ul className="list-unstyled scrollable-list">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id} className="d-flex align-items-center mb-2">
                    <span className="badge bg-primary me-2" style={{minWidth: '25px', textAlign: 'center'}}>{service.id}</span>
                    <span className="text-white me-auto">{service.nombre}</span>
                    <span className="text-success">${service.precio ? service.precio.toFixed(2) : '0.00'}</span>
                  </li>
                ))
              ) : (
                <p className="text-white-50">No hay servicios registrados para este negocio.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Nueva Sección: Citas Confirmadas e Ingresos */}
        <div className="col-lg-8">
          <div className="card-custom h-100">
            <h5 className="card-title text-secondary-light mb-3">Ingresos por Citas Confirmadas</h5>
            {/* Filtro de ingresos */}
            <div className="mb-3 d-flex justify-content-end">
                <select 
                    className="form-select w-auto bg-dark-secondary border-0 text-white"
                    value={incomeFilter}
                    onChange={(e) => setIncomeFilter(e.target.value)}
                >
                    <option value="daily">Por Día</option>
                    <option value="weekly">Por Semana</option>
                    <option value="monthly">Por Mes</option>
                </select>
            </div>

            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #30363d', borderRadius: '6px' }}>
                <table className="table table-dark table-striped table-hover text-white mb-0">
                    <thead>
                        <tr>
                            <th>Periodo</th>
                            <th>Total Ganado</th>
                            <th>Detalle Citas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(metrics.ingresosConfirmadosAgrupados).length > 0 ? (
                            Object.keys(metrics.ingresosConfirmadosAgrupados).sort().map(groupKey => {
                                const groupData = metrics.ingresosConfirmadosAgrupados[groupKey];
                                return (
                                    <React.Fragment key={groupKey}>
                                        <tr className="table-active">
                                            <td className="fw-bold">{groupKey}</td>
                                            <td className="fw-bold text-success">${groupData.total.toFixed(2)}</td>
                                            <td></td> {/* Columna vacía para alinear */}
                                        </tr>
                                        {groupData.appointments.map(app => (
                                            <tr key={app.id}>
                                                <td></td> {/* Vacío para el detalle */}
                                                <td>{app.hora.substring(0, 5)}</td>
                                                <td>{app.client_name} - {app.service_name} (${app.service_price.toFixed(2)})</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-white-50">No hay citas confirmadas para el periodo seleccionado.</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="text-end fw-bold">Total General Confirmado:</td>
                            <td className="fw-bold text-success">
                                ${metrics.totalIngresosConfirmados.toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- ESTILOS CSS INLINE --- */}
      <style>{`
        body {
            background-color: #0d1117;
        }
        .container-fluid {
            /* Los estilos de darkContainerStyle ya se aplican directamente */
            /* Aquí podrías añadir estilos adicionales si no son parte de darkContainerStyle */
        }
        .text-white {
            color: #e6edf3 !important;
        }
        .text-secondary-light {
            color: #8b949e !important;
        }

        /* Estilo general de las tarjetas */
        .card-custom {
            background-color: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        .card-custom .card-title {
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }
        .card-custom .card-text {
            font-size: 2.5rem;
            font-weight: bold;
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        /* Iconos de fondo en las tarjetas */
        .icon-bg {
            position: absolute;
            bottom: -15px;
            right: -15px;
            font-size: 5rem;
            opacity: 0.2;
            pointer-events: none;
            transform: rotate(-10deg);
            z-index: 0;
        }
        .icon-bg.bg-purple { color: #8a2be2; }
        .icon-bg.bg-orange { color: #ffa500; }
        .icon-bg.bg-green { color: #28a745; }
        .icon-bg.bg-red { color: #dc3545; }

        /* Estilo del medidor (gauge) - Meta Semanal */
        .gauge-container {
            width: 150px;
            height: 150px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gauge-outer {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 10px solid #30363d;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gauge-progress {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 10px solid transparent;
            border-top-color: var(--gauge-color, #8a2be2); /* Color dinámico */
            border-right-color: var(--gauge-color, #8a2be2); /* Color dinámico */
            transform-origin: center;
            transition: transform 0.5s ease-out;
            transform: rotate(45deg);
            clip-path: inset(0% 50% 0% 0%);
        }
        .gauge-inner {
            width: 80%;
            height: 80%;
            background-color: #0d1117;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }
        .gauge-score {
            font-size: 1.8rem;
            font-weight: bold;
            color: #e6edf3;
            line-height: 1;
        }
        .gauge-subtext {
            font-size: 0.9rem;
            color: #8b949e;
        }
        .gauge-percentage {
            font-size: 1.2rem;
            font-weight: bold;
            color: #e6edf3;
            margin-top: 5px;
        }

        /* Estilo de la gráfica */
        .chart-area {
            position: relative;
        }
        .chart-area svg {
            display: block;
            max-width: 100%;
            height: auto;
        }

        /* Estilo para la lista de servicios y la tabla de ingresos */
        .table-dark {
            --bs-table-bg: #0d1117;
            --bs-table-striped-bg: #161b22;
            --bs-table-hover-bg: #1f252d;
            --bs-table-border-color: #30363d;
            color: #e6edf3;
        }
        .table-dark th, .table-dark td {
            border-color: #30363d;
        }
        .table-responsive table {
            margin-bottom: 0;
        }
        .table-responsive thead tr {
            background-color: #1f252d;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .table-responsive tfoot tr {
            background-color: #1f252d;
            position: sticky;
            bottom: 0;
            z-index: 1;
        }
        .list-unstyled.scrollable-list {
            max-height: 250px;
            overflow-y: auto;
            padding-right: 10px;
        }
        .list-unstyled li {
            padding: 8px 0;
            border-bottom: 1px solid #30363d;
        }
        .list-unstyled li:last-child {
            border-bottom: none;
        }
        .bg-primary { background-color: #007bff !important; }
        .bg-success { background-color: #28a745 !important; }
        .bg-orange { background-color: #ffa500 !important; }
        .bg-red { background-color: #dc3545 !important; }
        .bg-purple { background-color: #8a2be2 !important; }

        /* Input group personalizado */
        .input-group-text.bg-dark-secondary {
            background-color: #161b22 !important;
            border-color: #30363d !important;
            color: #e6edf3 !important;
        }
        .form-control.bg-dark-secondary {
            background-color: #161b22 !important;
            border-color: #30363d !important;
            color: #e6edf3 !important;
        }
        .form-control.bg-dark-secondary:focus {
            background-color: #1f252d !important;
            border-color: #007bff !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
        }
      `}</style>
    </div>
  );
}