import { Marker, Popup } from "react-leaflet";
import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "../vehicle/VehicleCard";

interface VehicleMarkerProps {
  vehicle: Vehicle;
}

export function VehicleMarker({ vehicle }: VehicleMarkerProps) {
  return (
    <Marker position={[vehicle.latitude, vehicle.longitude]}>
      <Popup className="min-w-[280px]">
        {/* Usamos !m-0 e !p-0 para sobrescrever os estilos padrões do Popup do Leaflet */}
        <div className="!m-0 !p-0">
          <VehicleCard vehicle={vehicle} />
        </div>
      </Popup>
    </Marker>
  );
}
