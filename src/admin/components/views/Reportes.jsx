import ReportesUser from "../Reportesuser"
import ReportesNegocio from "../ReportesNegocio";
import ReportesCitas from '../ReportesCitas';
export default function Reportes() {
  return (
    <div>
        <h2>Panel de Administración</h2>
      <ReportesUser />
      {/* <ReportesNegocio />
       <ReportesCitas /> */}
    </div>
  )
}
