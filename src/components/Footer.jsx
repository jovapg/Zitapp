import React from 'react'

export default function footer() {
  return (
    <>
     <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Redes Sociales */}
          <div className="col-md-3 mb-4">
            <h6>Síguenos</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-2">
              <i className="bi bi-twitter-x fs-4 text-purple"></i>
              <i className="bi bi-facebook fs-4 text-purple"></i>
              <i className="bi bi-linkedin fs-4 text-purple"></i>
              <i className="bi bi-instagram fs-4 text-purple"></i>
              <i className="bi bi-youtube fs-4 text-purple"></i>
            </div>
          </div>

          {/* Enlaces */}
          <div className="col-md-3 mb-4">
            <h6>Conoce Zitapp</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Insights</a></li>
              <li><a href="#" className="footer-link">Carrera</a></li>
            </ul>
          </div>

          {/* Países */}
          <div className="col-md-3 mb-4">
            <h6><i className="bi bi-geo-alt-fill text-purple me-1"></i> Nuestras ubicaciones</h6>
            <ul className="list-unstyled">
              <li>Colombia</li>
              <li>Estados Unidos</li>
              <li>México</li>
              <li>Perú</li>
              <li>Panamá</li>
              <li>Guatemala</li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-3 mb-4">
            <h6>¡Ponte en contacto!</h6>
            <p>info@zitapp.com</p>
            <p>+57 123 456 789</p>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Parte inferior */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
          <div>
            <button className="btn btn-outline-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
              Español - Colombia <i className="bi bi-geo-alt-fill ms-1"></i>
            </button>
          </div>
          <div className="text-center small">
            <a href="#" className="footer-link me-3">Términos y condiciones</a>
            <a href="#" className="footer-link me-3">Política de privacidad</a>
            <a href="#" className="footer-link me-3">Política de cookies</a>
            <a href="#" className="footer-link">SafeBox</a>
          </div>
          <div className="text-center small">
            © 2025 Zitapp
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
