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
        <Marker position={[4.61, -74.07]}>
          <Popup>
            Aquí hay un negocio.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
