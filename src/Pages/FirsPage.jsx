import ButtonsFirsPage from '../components/ButtonsFirsPage';
import fondologin from '../assets/img/LOGO Zitapp.png';
import Footer from '../components/Footer';
import '../../style/firsPage.css';
import Contactanos from '../components/Contactanos';
import { useNavigate } from 'react-router-dom';



export default function FirsPage() {
  const navigate = useNavigate(); // <-- inicializa navigate
  return (

    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={fondologin} alt="Zitapp Logo" className='logo' /> Zitapp
          </a>
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-controls="navMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <div className="navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">Nosotros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">Qué Hacemos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#benefits">Beneficios</a>
              </li>
              <li className="nav-item">
                <button className="nav-link" data-bs-toggle="modal" data-bs-target="#contactModal">
                  Contáctanos
                </button>
              </li>

              <li >
                <a className="neon-text" onClick={() => navigate('/LoginPage')} >LOGIN</a>
              </li>
              <li >
                <a className="neon-text" onClick={() => navigate('/Register')} >REGISTRATE</a>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}

      <header className="hero text-white">
        <h1 className="masked-text display-4">ZITAPP</h1>
        <p className="lead">Tu solución inteligente para agendar citas fácilmente.</p>
        <a href="#about" className="btn btn-primary mt-3">Conócenos</a>
      </header>


      {/* SOBRE NOSOTROS */}
      <section id="about" className="container fade-in visible">
        <h2 className="cursor typewriter-animation text-center mb-4">Sobre Nosotros</h2>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Imagen a la izquierda */}
          <div className="flex justify-center md:justify-start">
            <img
              src='https://i.pinimg.com/736x/9f/f8/25/9ff825f0b7221fcfa28da6965aecf65e.jpg '
              alt="Sobre Nosotros"
              className="rounded-full object-cover shadow-md"
            />
          </div>

          {/* Texto a la derecha */}
          <div className="w-full md:w-2/3">
            <p className="text-center md:text-left text-sm md:text-base leading-relaxed">
              En Zitapp, creemos que la organización y el tiempo son esenciales para el éxito de
              cualquier negocio y la comodidad de los clientes. Por eso, nos propusimos crear una plataforma que
              transforma la manera en que se gestionan los agendamientos.
              <br /><br />
              Como fundadores, nos apasiona simplificar procesos y hacer que la interacción entre negocios y clientes sea
              más fluida, eficiente y sin complicaciones. Zitapp no es solo una herramienta, es el resultado de nuestro
              compromiso con la innovación, el diseño intuitivo y la tecnología adaptable a las necesidades de cada
              usuario.
              <br /><br />
              Nuestra plataforma ha sido diseñada pensando en la accesibilidad y la facilidad de uso, permitiendo a
              negocios optimizar su tiempo y a los clientes disfrutar de una experiencia de reserva sencilla y rápida.
              <br /><br />
              Creemos en el poder de la digitalización para mejorar la productividad y la satisfacción de todos, y
              trabajamos constantemente para ofrecer soluciones prácticas y efectivas.
              <br /><br />
              Si estás buscando una manera más inteligente y moderna de gestionar tus citas, Zitapp está aquí para hacer
              que el proceso sea más ágil y sin estrés. ¡Únete a nosotros en esta revolución del agendamiento!
            </p>
          </div>
        </div>
      </section>



      {/* QUÉ HACEMOS */}
      <section id="services" className="bg-dark text-light fade-in visible">
        <div className="container">
          <h2 className="text-center mb-4">Qué Hacemos</h2>
          <p className="text-center">
            En Zitapp, transformamos la manera en que los negocios y clientes interactúan con la
            gestión de servicios y citas. Nuestra plataforma permite a los usuarios encontrar y reservar servicios
            de manera rápida y sencilla, eliminando las barreras del proceso tradicional y ofreciendo una
            experiencia fluida y eficiente.
            <br /><br />
            Para los negocios, Zitapp es una herramienta integral que automatiza la gestión de agendas, permitiendo
            optimizar el tiempo y mejorar la organización. Con funcionalidades avanzadas de análisis,
            personalización y control, ofrecemos soluciones estratégicas para mejorar la productividad y aumentar la
            satisfacción de los clientes.
            <br /><br />
            Desde pequeñas empresas hasta grandes corporaciones, Zitapp se adapta a cualquier tipo de negocio,
            brindando herramientas intuitivas que facilitan la administración de citas, la recopilación de datos
            clave y la toma de decisiones basada en métricas precisas. Creemos en la digitalización como motor de
            crecimiento y eficiencia, por lo que nuestra plataforma está diseñada para hacer que la gestión del
            tiempo sea más inteligente y efectiva.
            <br /><br />
            Ya sea que necesites reservar un servicio con facilidad o automatizar la administración de tu negocio,
            Zitapp está aquí para simplificar el proceso y mejorar la experiencia para todos.
          </p>
        </div>
      </section>

      {/* beneficios */}
      <section id="benefits" className="text-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Beneficios</h2>

          <div id="benefitsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">

              {/* Primer slide */}
              <div className="carousel-item active">
                <div className="d-flex justify-content-center gap-4">
                  <div className="benefit-card">
                    <div className="benefit-image bg-purple">
                      <img src="https://i.pinimg.com/736x/7b/c0/18/7bc0187463bbbd5a0cb16ed6cbfedb21.jpg" alt="Automatización" className="w-100" />
                    </div>
                    <h5>Automatización y eficiencia</h5>
                    <p>Organiza tus citas sin esfuerzo reduciendo el trabajo manual y mejorando la organización.</p>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-image bg-purple">
                      <img src="https://i.pinimg.com/736x/61/ec/f3/61ecf3aa95649ec8e6d7f9b59fc65766.jpg" alt="Analítica" className="w-100" />
                    </div>
                    <h5>Analítica</h5>
                    <p>Mide resultados al instante lo que aumenta la satisfacción y fidelización de los clientes.</p>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-image bg-purple">
                      <img src="https://i.pinimg.com/736x/44/9a/f2/449af2550aa244088b13603651cfdf61.jpg" alt="Adaptabilidad" className="w-100" />
                    </div>
                    <h5>Adaptabilidad y escalabilidad</h5>
                    <p>Se puede actualizar y ampliar con nuevas herramientas, servicios y funcionalidades según las necesidades del mercado.</p>
                  </div>
                </div>
              </div>

              {/* Segundo slide */}
              <div className="carousel-item">
                <div className="d-flex justify-content-center gap-4">
                  <div className="benefit-card">
                    <div className="benefit-image bg-purple">
                      <img src="https://i.pinimg.com/736x/e9/0c/5e/e90c5eb1955ad9316f10098a5d920499.jpg" alt="Visibilidad" className="w-100" />
                    </div>
                    <h5>Mayor Alcance y Visibilidad</h5>
                    <p>Disponible para clientes potenciales las 24 horas del día, permitiéndoles encontrar y reservar servicios desde cualquier lugar.</p>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-image bg-purple">
                      <img src="https://i.pinimg.com/736x/c6/a4/ad/c6a4ad156c6c278a8c9a2d4859a3ffd7.jpg" alt="Credibilidad" className="w-100" />
                    </div>
                    <h5>Credibilidad y confianza</h5>
                    <p>Los clientes verán tu negocio como una opción confiable y moderna.</p>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-image bg-purple">
                      <img src="https://i.pinimg.com/736x/78/40/99/784099f8e1c85499a71c14bdcaf392b0.jpg" alt="Notificaciones" className="w-100" />
                    </div>
                    <h5>Notificaciones y recordatorios automáticos</h5>
                    <p>Alertas sobre sus citas, reduciendo cancelaciones y olvidos, mientras que los negocios mantienen mejor control de su agenda.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Controles del carrusel */}
            <button className="carousel-control-prev" type="button" data-bs-target="#benefitsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#benefitsCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <Contactanos />


    </>

  );
}
