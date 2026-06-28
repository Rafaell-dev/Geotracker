import { Polyline } from "react-leaflet";
import { RoutePoint } from "@/types/route";

interface RoutePolylineProps {
  points: RoutePoint[];
}

export function RoutePolyline({ points }: RoutePolylineProps) {
  if (!points || points.length === 0) return null;

  const positions: [number, number][] = points.map(p => [p.latitude, p.longitude]);

  return (
    <Polyline 
      positions={positions} 
      pathOptions={{ color: 'blue', weight: 4, opacity: 0.7 }} 
    />
  );
}
