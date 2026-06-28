import MapContainer from '@/components/map/MapContainer';
import { mockRoutes } from '@/data/routes.mock';
import { notFound } from 'next/navigation';
import { RouteSummary } from '@/components/history/RouteSummary';
import { RouteTimeline } from '@/components/history/RouteTimeline';
import { HistoryFilters } from '@/components/history/HistoryFilters';

export default function HistoryPage({ params }: { params: { vehicleId: string } }) {
  const route = mockRoutes.find(r => r.vehicleId === params.vehicleId);
  
  if (!route) {
    return notFound();
  }

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
         <MapContainer historyVehicleId={params.vehicleId} routeHistory={route} />
      </div>
    </main>
  );
}
