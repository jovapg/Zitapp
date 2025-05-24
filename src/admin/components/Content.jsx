import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import Grafica from "./Grafica";
import Info from "./Info";
import Negocios from "./views/Negocios";
import User from "./views/User";
import  Citas from "./views/Citas";
import fondoAzul from "../../assets/img/fondo_azul_editado.png";

export default function Content({ toggleSidebar, style, selectedView }) {
  const renderView = () => {
    switch (selectedView) {
      case "negocios":
        return <div> <Negocios /></div>;
      case "usuarios":
        return <div><User/></div>;
      case "citas":
        return <div><Citas/></div>; 
      case "reporte":
        return <div>Generar Reporte</div>;

      case "home":
      default:
        return (
          <>
            <div className="row">
           <Card
        title="Usuarios Negocios"
        icon="fa-store"
        apiEndpoint="http://localhost:8081/api/business"
      />
      <Card
        title="Usuarios Totales"
        icon="fa-users"
        apiEndpoint="http://localhost:8081/api/users"
      />
      <Card
        title="Citas Registradas"
        icon="fa-calendar-check"
        apiEndpoint="http://localhost:8081/api/Appointments/todas"
      />

            </div>
            <div className="row">
              <Grafica />
            </div>
            <div className="row">
              <Info />
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div
        id="content-wrapper"
        className="d-flex flex-column"
        style={{ flexGrow: 1, ...style }}
      >
        <div
          id="content"
          style={{
            backgroundImage: `url(${fondoAzul})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            minHeight: "100vh",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header toggleSidebar={toggleSidebar} />
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4"></div>
            {renderView()}
          </div>
          <Footer />
        </div>
      </div>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #content-wrapper {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .row {
          margin: 20px;
        }
      `}</style>
    </>
  );
}
