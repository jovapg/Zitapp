import Aside from '../components/Aside'
import Content from '../components/Content'
 import { useState } from 'react'
 
export default function Dashboard() {
  const [sidebarVisible, setsidebarVisible] = useState(true)
  //funcion para mostrar o ocultar el sidebar
  const toggleSidebar = () => {
    setsidebarVisible((prev)=> !prev)
  }
  return (
     <div id="page-top"  style={{ height: "100vh" }}>
      <div id="wrapper" style={{ display: 'flex', height: '100%' }}>

        {sidebarVisible && <Aside />}
        
      <Content toggleSidebar={toggleSidebar} />
  
      </div>
      
      <style>{`
#wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}


`
      }</style>
    </div>
  
  )
}
