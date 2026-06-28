import { RouteHistory } from "@/types/route";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RouteTimelineProps {
  route: RouteHistory;
}

export function RouteTimeline({ route }: RouteTimelineProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <h3 className="font-semibold p-4 pb-2">Linha do Tempo</h3>
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0">
          {route.points.map((point, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  {new Date(point.timestamp).toLocaleTimeString()}
                </span>
                <Badge variant={point.speed > 0 ? "default" : "secondary"}>
                  {point.speed} km/h
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex gap-2">
                <span>Lat: {point.latitude.toFixed(4)}</span>
                <span>Lon: {point.longitude.toFixed(4)}</span>
                <span>Dir: {Math.round(point.heading)}°</span>
              </div>
              {index < route.points.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
