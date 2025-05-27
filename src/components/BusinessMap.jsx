import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function BusinessMap() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <br />
      <br />
      <MapContainer 
      center={[6.252849446073776, -75.50892585194177]} 
      zoom={13} 
      scrollWheelZoom={false}
       style={{ height: '600px', width: '100%' }}>

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[6.3206591498377644, -75.55768349481691]} placeholder="Negocio">
            
          <Popup  
         

          
          >
           negocio prueba
          </Popup>
        </Marker>
                <Marker position={[6.290501425882606, -75.55577671707081]} placeholder="Negocio">
                  
                  <Marker position={[6.313015854985283, -75.56184153096683]} placeholder="Negocio"></Marker>
            
          <Popup>
           negocio prueba
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
