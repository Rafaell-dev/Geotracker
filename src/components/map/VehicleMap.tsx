'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar ícones padrão do Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function VehicleMap() {
  // Posição inicial solicitada
  const initialPosition: [number, number] = [-8.8921, -36.4972];
  const initialZoom = 13;

  useEffect(() => {
    // Forçar recálculo do tamanho do mapa em montagem para evitar tiles incompletos
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="h-screen w-screen z-0">
      <MapContainer 
        center={initialPosition} 
        zoom={initialZoom} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Futuramente os veículos serão renderizados aqui como Markers */}
      </MapContainer>
    </div>
  );
}
