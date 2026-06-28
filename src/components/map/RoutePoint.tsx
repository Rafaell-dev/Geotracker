import { CircleMarker, Popup } from "react-leaflet";
import { RoutePoint } from "@/types/route";
import { Card, CardContent } from "@/components/ui/card";

interface RoutePointProps {
  point: RoutePoint;
}

export function RoutePointMarker({ point }: RoutePointProps) {
  return (
    <CircleMarker 
      center={[point.latitude, point.longitude]} 
      radius={5}
      pathOptions={{ color: 'blue', fillColor: 'white', fillOpacity: 1 }}
    >
      <Popup className="min-w-[200px]">
        <div className="!m-0 !p-0">
          <Card className="w-full shadow-sm border-none">
            <CardContent className="p-3 text-sm flex flex-col gap-1">
              <div><strong>Hora:</strong> {new Date(point.timestamp).toLocaleTimeString()}</div>
              <div><strong>Velocidade:</strong> {point.speed} km/h</div>
              <div><strong>Direção:</strong> {point.heading}°</div>
            </CardContent>
          </Card>
        </div>
      </Popup>
    </CircleMarker>
  );
}
