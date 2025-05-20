import Header from "./header";
import Footer from "./footer";
import Card from "./card";
import Grafica from "./grafica";
import Info from "./Info";
import Negocios from "./views/Negocios";
import fondoAzul from "../../assets/img/fondo_azul_editado.png";

export default function Content({ toggleSidebar, style, selectedView }) {
  const renderView = () => {
    switch (selectedView) {
      case "negocios":
        return <div> <Negocios /></div>;
      case "crearNegocio":
        return <div>Formulario Crear Negocio</div>;
      case "actualizarNegocio":
        return <div>Actualizar Negocio</div>;
      case "eliminarNegocio":
        return <div>Eliminar Negocio</div>;

      case "usuarios":
        return <div>Vista Usuarios</div>;
      case "crearUsuarios":
        return <div>Crear Usuarios</div>;
      case "actualizarUsuario":
        return <div>Actualizar Usuario</div>;
      case "eliminarUsuario":
        return <div>Eliminar Usuario</div>;

      case "citas":
        return <div>Vista Citas</div>;
      case "crearCitas":
        return <div>Crear Citas</div>;
      case "actualizarCitas":
        return <div>Actualizar Citas</div>;
      case "eliminarCitas":
        return <div>Eliminar Citas</div>;

      case "reporte":
        return <div>Generar Reporte</div>;

      case "home":
      default:
        return (
          <>
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
