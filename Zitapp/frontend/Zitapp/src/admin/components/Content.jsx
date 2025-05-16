import Header from "./header";
import Footer from "./footer";
import Card from "./card";
import Grafica from "./grafica";
import Info from "./Info";
import fondoAzul from "../../assets/img/fondo_azul_editado.png";

export default function Content() {
  return (
    <>
      <div id="content-wrapper" className="d-flex flex-column">
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
          <Header />
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
              <a
                href="#"
                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              >
                <i className="fas fa-download fa-sm text-white-50"></i> Generate Report
              </a>
            </div>
          </div>
          <div className="row">
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
          <div className="row">
            <Grafica />
          </div>
          <div className="row">
            <Info />
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
  margin: 20px; /* Espacio alrededor de las Cards */
}

      `}</style>
    </>
  );
}
