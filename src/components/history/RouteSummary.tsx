import { RouteHistory } from "@/types/route";

interface RouteSummaryProps {
  route: RouteHistory;
}

export function RouteSummary({ route }: RouteSummaryProps) {
  if (!route.points.length) return null;

  const pointsCount = route.points.length;
  const avgSpeed = Math.round(route.points.reduce((acc, p) => acc + p.speed, 0) / pointsCount);
  const startTime = new Date(route.points[0].timestamp).toLocaleTimeString();
  const endTime = new Date(route.points[pointsCount - 1].timestamp).toLocaleTimeString();

  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold mb-2">Resumo da Viagem</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground block">Início</span>
          <span>{startTime}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Fim</span>
          <span>{endTime}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Pontos</span>
          <span>{pointsCount}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Vel. Média</span>
          <span>{avgSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}
