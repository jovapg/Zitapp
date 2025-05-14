import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import FirsPage from './Pages/firsPage'
import LoginPage from './Pages/LoginPage'
import HomePageuser from './Pages/HomePageuser'
import Nav from './components/Nav'
import Topbar from './components/Topbar'
import Categories from './components/Categories'


function App() {


  return (
    <>

      <Routes>
        <Route path="/" element={<FirsPage />} />
        <Route path="/FirsPage" element={<FirsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/HomePageuser" element={<HomePageuser />} />
        <Route path="/Nav" element={<Nav />} />
        <Route path="/Topbar" element={<Topbar />} />
        <Route path="/Categories" element={<Categories />} />
 

        


      </Routes>

    </>
      
  )
}

export default App
