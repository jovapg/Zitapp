import Aside from "../components/Aside";
import Content from "../components/Content";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedView, setSelectedView] = useState("home"); // Vista por defecto

  // función para mostrar u ocultar el sidebar
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // función para cambiar la vista seleccionada
  const handleSelectView = (view) => {
    setSelectedView(view);
  };

  return (
    <div id="page-top" style={{ height: "100vh" }}>
      <div id="wrapper" style={{ display: "flex", height: "100%" }}>
        {/* Montamos siempre Aside y le pasamos prop para clase + callback */}
        <Aside isVisible={sidebarVisible} onSelectView={handleSelectView} />

        {/* Pasamos la vista seleccionada a Content */}
        <Content toggleSidebar={toggleSidebar} selectedView={selectedView} style={{ flexGrow: 1 }} />
      </div>

      <style>{`
        #wrapper {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
