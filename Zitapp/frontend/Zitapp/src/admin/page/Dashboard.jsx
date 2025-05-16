import Aside from '../components/Aside'
 import Content from '../components/Content'
export default function Dashboard() {
  return (
     <div id="page-top"  style={{ height: "100vh" }}>
      <div id="wrapper" style={{ display: 'flex', height: '100%' }}>

      <Aside />
      <Content />
  
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
