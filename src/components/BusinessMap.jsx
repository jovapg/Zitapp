import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import Botonagendarcita from './Botonagendarcita';

export default function BusinessMap() {
  const [showModal, setShowModal] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('TODAS');
  const [userLocation, setUserLocation] = useState(null);

  // Obtener negocios del backend
  useEffect(() => {
    axios.get('http://localhost:8081/api/business')
      .then(response => setBusinesses(response.data))
      .catch(error => console.error('Error al obtener negocios:', error));
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          console.warn('Permiso denegado o error al obtener ubicación:', error);
        }
      );
    } else {
      alert('Geolocalización no es compatible con este navegador');
    }
  }, []);

  const categories = [...new Set(businesses.map(b => b.categoria))];

  const filteredBusinesses = filteredCategory === 'TODAS'
    ? businesses
    : businesses.filter(b => b.categoria === filteredCategory);

  const createIcon = () => {
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

  return (
    <div className="container-fluid">
      <br />
      <h3 className="mt-3">Negocios en el mapa</h3>

      <div className="mb-3">
        <button className="btn btn-dark me-2" onClick={() => setFilteredCategory('TODAS')}>Todas</button>
        {categories.map((cat, index) => (
          <button key={index} className="btn btn-outline-primary me-2" onClick={() => setFilteredCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [6.2528, -75.509]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '450px', width: '100%' }}>

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador de la ubicación del usuario */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <strong>Estás aquí</strong>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de negocios */}
        {filteredBusinesses.map((negocio, index) => {
          const [lat, lng] = negocio.direccion.split(',').map(coord => parseFloat(coord.trim()));
          return (
            <Marker key={index} position={[lat, lng]} icon={createIcon()}>
              <Popup>
                <div style={{ width: '220px' }}>
                  <img
                    src={negocio.imagenUrl || "https://via.placeholder.com/200x100?text=Sin+imagen"}
                    alt={negocio.nombre}
                    className="img-fluid mb-2"
                    style={{ height: "100px", width: "100%", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x100?text=Sin+imagen";
                    }}
                  />
                  <h6>{negocio.nombre}</h6>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>{negocio.categoria}</p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-sm"
                      onClick={() => setShowModal(true)}>
                      Agendar cita
                    </button>
                    <a
                      href={`https://www.google.com/maps?q=${negocio.direccion}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm"
                    >
                      📍 Cómo llegar
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Modal de agendamiento */}
      {showModal && <Botonagendarcita show={showModal} setShow={setShowModal} />}
    </div>
  );
}
