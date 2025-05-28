import { Navigate, Outlet } from 'react-router-dom';

const RoleRouter = ({ role }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // No hay sesión iniciada
    return <Navigate to="/FirsPage" />;
  }

  if (user.tipo !== role) {
    // Rol no permitido para esta ruta
    return <Navigate to="/FirsPage" />;
  }

  // Usuario válido y con el rol correcto
  return <Outlet />;
};

export default RoleRouter;
