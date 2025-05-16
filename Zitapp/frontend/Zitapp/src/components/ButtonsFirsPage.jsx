import fondoAzul from '../assets/img/fondo_azul_editado.png';
import logo from '../assets/img/logo.png';
import { useNavigate } from 'react-router-dom'; // <-- usa useNavigate en lugar de Navigate

export default function ButtonsFirsPage() {
  const navigate = useNavigate(); // <-- inicializa navigate

  return (
    <div
      className="vh-100 vw-100 d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        backgroundImage: `url(${fondoAzul})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white',
      }}
    >
      {/* Botón Admin */}
      <div className="position-absolute top-0 end-0 m-3">
        <button
          className=" btadmin  btn btn-outline-light rounded-pill px-4 border-2"
       onClick={() => navigate('/Admin')}
        >
          Admin
        </button>
      </div>

      {/* Imagen del logo (sin botón) */}
      <div className="mb-4">
        <img
          src={logo}
          alt="Logo"
          style={{ height: '230px' }}
        />
      </div>

      {/* Título */}
      <h1 className="fw-bold text-white">Bienvenido a ZITAPP</h1>
      <p className="fs-5 mb-5 text-white">
        Tu cita perfecta con los negocios del día a día
      </p>

      {/* Botones estilo power con texto */}
      <div className="d-flex gap-4 flex-wrap justify-content-center">
        <div
          className="power-button"
          onClick={() => navigate('/LoginPage')}
        >
          <span>Login Usuario</span>
        </div>
        <div
          className="power-button"
          onClick={() => navigate('/LoginBusiness')}
        >
          <span>Login Negocio</span>
        </div>
        <div
          className="power-button"
          onClick={() => navigate('/Register')}
        >
          <span>Regístrate</span>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        .power-button {
          width: 160px;
          height: 160px;
          border-radius: 35%;
          background: #121212;
          border: 3px solid #ff69b4;
          box-shadow:
            0 0 10px #ff69b4,
            inset 0 0 5px #ff69b4,
            0 0 20px rgba(255, 105, 180, 0.5);
          color: #ff69b4;
          font-weight: bold;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .power-button:hover {
          transform: scale(1.05);
          background: #1a1a1a;
          box-shadow:
            0 0 15px #ff85c1,
            inset 0 0 10px #ff85c1,
            0 0 25px rgba(255, 133, 193, 0.7);
        }

        .power-button span {
          color: #ffd4ea;
          padding: 5px;
          font-size: 1.1rem;
        }
        .btadmin {
             borderColor: '#6f42c1',
            color: 'white',
            fontWeight: 'bold',
           }

      `
      }</style>
    </div>
  );
}
