import Header from "./header";
import Footer from "./footer";
import Card from "./card";
import Grafica from "./grafica";
import Info from "./Info";
import fondoAzul from "../../assets/img/fondo_azul_editado.png";

export default function Content({toggleSidebar}) {
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
          <Header toggleSidebar={toggleSidebar} />
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">


            </div>
          </div>
          <div className="row">

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
