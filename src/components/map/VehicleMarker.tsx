import { useState, useMemo } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { Car, AlertTriangle, Wrench } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "../vehicle/VehicleCard";

interface VehicleMarkerProps {
  vehicle: Vehicle;
}

const createCustomIcon = (vehicle: Vehicle, isSelected: boolean) => {
  let color = '#64748B'; // offline
  let IconComponent = Car;
  let hasPulse = false;
  let opacityClass = 'opacity-100';

  switch (vehicle.status) {
    case 'ONLINE':
      color = '#22C55E';
      hasPulse = true;
      break;
    case 'PARADO':
      color = '#3B82F6';
      break;
    case 'ALERTA':
      color = '#EF4444';
      IconComponent = AlertTriangle;
      hasPulse = true;
      break;
    case 'MANUTENCAO':
      color = '#F59E0B';
      IconComponent = Wrench;
      break;
    case 'OFFLINE':
      color = '#64748B';
      opacityClass = 'opacity-60';
      break;
  }

  const iconHtml = renderToString(
    <div className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 z-[1000]' : 'scale-100 hover:scale-110'}`}>
      
      {/* Efeito de pulso para status que requerem animação */}
      {hasPulse && !isSelected && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-75" 
          style={{ backgroundColor: color, transform: 'scale(1.2)' }} 
        />
      )}

      {/* Efeito anel externo animado para o selecionado */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse" 
          style={{ border: `3px solid ${color}`, transform: 'scale(1.4)' }} 
        />
      )}

      {/* Pin principal com sombra */}
      <div 
        className={`relative flex items-center justify-center rounded-full border-2 border-white ${opacityClass} z-10 transition-shadow duration-300`}
        style={{ 
          backgroundColor: color, 
          width: '36px', 
          height: '36px', 
          boxShadow: isSelected ? `0 0 15px ${color}` : '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
        }}
      >
        {/* Ícone interno rotacionado com a direção do veículo */}
        <div style={{ transform: `rotate(${vehicle.heading}deg)`, transition: 'transform 0.5s ease' }}>
          <IconComponent size={20} color="white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "bg-transparent border-none outline-none", 
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
    tooltipAnchor: [18, 0]
  });
};

export function VehicleMarker({ vehicle }: VehicleMarkerProps) {
  const [isSelected, setIsSelected] = useState(false);

  // Memoriza o ícone para evitar recriação desnecessária se não mudar
  const icon = useMemo(() => createCustomIcon(vehicle, isSelected), [vehicle, isSelected]);

  return (
    <Marker 
      position={[vehicle.latitude, vehicle.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => setIsSelected(true),
        popupclose: () => setIsSelected(false)
      }}
    >
      <Tooltip direction="top" offset={[0, -20]} className="!p-2 !rounded-lg !shadow-md !border-none !bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-bold text-sm text-slate-800">{vehicle.name}</span>
          <span className="text-slate-500 font-medium">{vehicle.plate}</span>
          <span className="text-slate-700">Velocidade: <b>{vehicle.speed} km/h</b></span>
          <span className="text-slate-400 mt-1">{new Date(vehicle.updatedAt).toLocaleTimeString()}</span>
        </div>
      </Tooltip>
      
      <Popup className="min-w-[280px]">
        {/* Usamos !m-0 e !p-0 para sobrescrever os estilos padrões do Popup do Leaflet */}
        <div className="!m-0 !p-0">
          <VehicleCard vehicle={vehicle} />
        </div>
      </Popup>
    </Marker>
  );
}
