import React from 'react'
import { Navigate ,Outlet} from 'react-router-dom'
export default function PublicRouter() {
  let user = JSON.parse(localStorage.getItem('user'))// o usa tu contexto o lógica de autenticación
   // Si el usuario ya está autenticado, redirige a su inicio (puedes ajustar esto según el tipo de usuario)
  if (user) { 
    if (user.tipo === 'CLIENTE') return <Navigate to="/HomePageuser" />
    if (user.tipo === 'NEGOCIO') return <Navigate to="/HomePagenegocio" />
    if (user.tipo === 'ADMIN') return <Navigate to="/Dashboard" />

      
  
  }
   // Si no está autenticado, permite el acceso a la ruta pública
  return <Outlet/>

  
}
