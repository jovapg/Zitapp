import { Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import PublicRouter from "./components/auth/PublicRouter";
import RoleRouter from "./components/auth/RoleRouter";
// Páginas principales
import FirsPage from "./Pages/FirsPage";
import LoginPage from "./Pages/LoginPage";
import Register from "./Pages/Register";
import Notfound from "./components/Notfound";

// Usuario
import HomePageuser from "./Pages/HomePageuser";
import UserCalendar from "./Pages/Calendar/UserCalendar";
import AgendaDeCitas from "./Pages/Calendar/AgendaDeCitas";

// Negocio
import HomePagenegocio from "./Pages/HomePagenegocio";
import BusinessCalendar from "./Pages/Calendar/BusinessCalendar";
import AgendadeCitasNegocio from "./Pages/Calendar/AgendadeCitasNegocio";
import ConfigNegocio from "./components/ConfigNegocio";
import ConfigUser from "./components/ConfigUser";
import Botonagendarcita from "./components/Botonagendarcita";

// Admin
import LoginAdmin from "./Pages/LoginAdmin";
import Dashboard from "./admin/page/Dashboard";

// Componentes generales
import BusinessMap from "./components/BusinessMap";
import Categories from "./components/Categories";
import Nav from "./components/Nav";
import Topbar from "./components/Topbar";
import TopbarNegocio from "./components/TopbarNegocio";

function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route element={<PublicRouter />}>
        <Route path="/" element={<FirsPage />} />
        <Route path="/FirsPage" element={<FirsPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Admin" element={<LoginAdmin />} />
      </Route>

      {/* Usuario */}
      <Route element={<RoleRouter role="CLIENTE" />}>
        <Route path="/HomePageuser" element={<HomePageuser/>} />
        <Route path="/calendar/user" element={<UserCalendar />} />
        <Route path="/calendar/AgendadeCitas" element={<AgendaDeCitas />} />
        <Route path="/ConfigUser" element={<ConfigUser />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/Botonagendarcita" element={<Botonagendarcita />} />
      </Route>

      {/* Negocio */}
      <Route element={<RoleRouter role="NEGOCIO" />}>
        <Route path="/HomePagenegocio" element={<HomePagenegocio />} />
        <Route path="/calendar/business" element={<BusinessCalendar />} />
        <Route
          path="/calendar/AgendadeCitasNegocio"
          element={<AgendadeCitasNegocio />}
        />
        <Route path="/ConfigNegocio" element={<ConfigNegocio />} />
        <Route path="/BusinessMap" element={<BusinessMap />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/TopbarNegocio" element={<TopbarNegocio />} />
      </Route>

      {/* Admin */}

      <Route element={<RoleRouter role="ADMIN" />}>
        <Route path="/Dashboard" element={<Dashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
