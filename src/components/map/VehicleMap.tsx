'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRealtimeVehicles } from '@/hooks/useRealtimeVehicles';
import { VehicleMarker } from './VehicleMarker';
import { RouteHistory } from '@/types/route';
import { RoutePolyline } from './RoutePolyline';
import { RoutePointMarker } from './RoutePoint';

interface VehicleMapProps {
  historyVehicleId?: string;
  routeHistory?: RouteHistory;
}

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

export default function VehicleMap({ historyVehicleId, routeHistory }: VehicleMapProps) {
  const { data: realtimeVehicles = [] } = useRealtimeVehicles();
  
  const vehicles = historyVehicleId 
    ? realtimeVehicles.filter(v => v.id === historyVehicleId) 
    : realtimeVehicles;

  // Posição inicial baseada na rota ou posição padrão
  const initialPosition: [number, number] = routeHistory && routeHistory.points.length > 0 
    ? [routeHistory.points[0].latitude, routeHistory.points[0].longitude]
    : [-8.8921, -36.4972];
    
  const initialZoom = 13;

  useEffect(() => {
    // Forçar recálculo do tamanho do mapa em montagem para evitar tiles incompletos
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="relative h-screen w-screen z-0">
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
        {vehicles.map(vehicle => (
          <VehicleMarker key={vehicle.id} vehicle={vehicle} />
        ))}
        {routeHistory && <RoutePolyline points={routeHistory.points} />}
        {routeHistory && routeHistory.points.map((p, idx) => (
          <RoutePointMarker key={idx} point={p} />
        ))}
      </MapContainer>
    </div>
  );
}
