import { useState, useEffect } from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';

import FirsPage from './Pages/FirsPage'
import LoginPage from './Pages/LoginPage'
import HomePageuser from './Pages/HomePageuser'
import UserCalendar from './Pages/Calendar/UserCalendar'
import BusinessCalendar from './Pages/Calendar/BusinessCalendar'
import Nav from './components/Nav'
import Topbar from './components/Topbar'
import LoginAdmin from './Pages/LoginAdmin'
import Dashboard from './admin/page/Dashboard'
import Register from './Pages/Register'
import HomePagenegocio from './Pages/HomePagenegocio'
import Categories from './components/Categories'
import BusinessMap from './components/BusinessMap'
import Notfound from './components/notfound';
function App() {


  return (
    <>

      <Routes>
         
        <Route path="/" element={<FirsPage />} />
        <Route path="/FirsPage" element={<FirsPage />} />       
        <Route path="/Admin" element={<LoginAdmin />} />
         <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/HomePageuser" element={<HomePageuser />} />
        <Route path="/calendar/user" element={<UserCalendar />} />
        <Route path="/calendar/business" element={<BusinessCalendar />} />
        <Route path="/HomePagenegocio" element={<HomePagenegocio />} />
        <Route path="/Nav" element={<Nav />} />
        <Route path="/Topbar" element={<Topbar />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/BusinessMap" element={<BusinessMap />} />
         <Route path="*" element={<Notfound />} />

      </Routes>

    </>

  )
}

export default App
