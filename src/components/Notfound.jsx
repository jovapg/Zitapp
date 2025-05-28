import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/FluidBackground.css";

const Notfound = () => {
  let [colorScheme, setColorScheme] = useState(0);
  let containerRef = useRef(null);
let navigate = useNavigate();
  let colorSchemes = [
    // Esquema original (azul-púrpura)
    {
      shape1: "linear-gradient(135deg, #4a00e0 0%, #8e2de2 50%, #ff006e 100%)",
      shape2: "linear-gradient(45deg, #0066ff 0%, #4d79ff 50%, #8c52ff 100%)",
      shape3: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    },
    // Esquema verde-cyan
    {
      shape1: "linear-gradient(135deg, #00c851 0%, #00ffcc 50%, #00e676 100%)",
      shape2: "linear-gradient(45deg, #00bcd4 0%, #26c6da 50%, #4dd0e1 100%)",
      shape3: "linear-gradient(90deg, #1de9b6 0%, #00acc1 100%)",
    },
    // Esquema naranja-rosa
    {
      shape1: "linear-gradient(135deg, #ff9800 0%, #ff5722 50%, #e91e63 100%)",
      shape2: "linear-gradient(45deg, #ff6b35 0%, #f7931e 50%, #ffb74d 100%)",
      shape3: "linear-gradient(90deg, #ff8a65 0%, #ff7043 100%)",
    },
  ];

  let changeColors = () => {
    let newColorScheme = (colorScheme + 1) % colorSchemes.length;
    let scheme = colorSchemes[newColorScheme];

    let shape1 = document.querySelector(".shape-1");
    let shape2 = document.querySelector(".shape-2");
    let shape3 = document.querySelector(".shape-3");

    if (shape1) shape1.style.background = scheme.shape1;
    if (shape2) shape2.style.background = scheme.shape2;
    if (shape3) shape3.style.background = scheme.shape3;

    setColorScheme(newColorScheme);
  };

  let handleMouseMove = (e) => {
    let shapes = document.querySelectorAll(".fluid-shape");
    let mouseX = e.clientX / window.innerWidth;
    let mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
      let intensity = (index + 1) * 10;
      let translateX = (mouseX - 0.5) * intensity;
      let translateY = (mouseY - 0.5) * intensity;

      shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  };

  let handleClick = (e) => {
    let ripple = document.createElement("div");
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.3)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.left = e.clientX - 50 + "px";
    ripple.style.top = e.clientY - 50 + "px";
    ripple.style.width = "100px";
    ripple.style.height = "100px";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "1000";

    document.body.appendChild(ripple);

    setTimeout(() => {
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple);
      }
    }, 600);
  };

  return (
    <div
      className="fluid-background-wrapper"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="background-container" ref={containerRef}>
        {/* Formas fluidas principales */}
        <div className="fluid-shape shape-1"></div>
        <div className="fluid-shape shape-2"></div>
        <div className="fluid-shape shape-3"></div>

        {/* Líneas flotantes */}
        <div className="flowing-lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        {/* Contenido */}
        <div className="content">
          <h1 className="title">404</h1>
          <p className="subtitle">Página no encontrada</p>
          <p className="subtitle">La página que estás buscando no existe o fue movida.</p>
         <button className="btn btn-primary mt-3"  onClick={() => navigate('/Firspage')}>Volver al inicio</button>
        </div>

        {/* Controles */}
        <div className="controls">
          <button className="control-btn" onClick={changeColors}>
            Cambiar Colores
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
