import VehicleMap from '@/components/map/VehicleMap';
import { fetchTelemetry } from '@/services/api';
import { notFound } from 'next/navigation';
import { RouteSummary } from '@/components/history/RouteSummary';
import { RouteTimeline } from '@/components/history/RouteTimeline';
import { HistoryFilters } from '@/components/history/HistoryFilters';
import { RouteHistory } from '@/types/route';

export default async function HistoryPage({ params }: { params: { vehicleId: string } }) {
  const telemetry = await fetchTelemetry({ device_id: params.vehicleId, limit: 200 });
  
  if (!telemetry || telemetry.length === 0) {
    return notFound();
  }

  // The API likely returns data ordered by timestamp DESC (newest first).
  // Routes generally need to be chronologically ordered (oldest first).
  const route: RouteHistory = {
    vehicleId: params.vehicleId,
    points: telemetry.reverse().map(t => ({
      latitude: t.gps.lat,
      longitude: t.gps.lng,
      speed: Math.round(t.gps.speed * 3.6),
      heading: 0, // the API doesn't return heading, so we default to 0
      timestamp: t.timestamp
    }))
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden flex-row">
      <div className="w-80 h-screen bg-white z-10 flex flex-col shadow-[4px_0_15px_rgba(0,0,0,0.1)]">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Histórico</h2>
          <p className="text-sm text-gray-500">Veículo ID: {params.vehicleId}</p>
        </div>
        <HistoryFilters />
        <RouteSummary route={route} />
        <RouteTimeline route={route} />
      </div>
      <div className="flex-1 relative z-0">
         <VehicleMap historyVehicleId={params.vehicleId} routeHistory={route} />
      </div>
    </main>
  );
}
