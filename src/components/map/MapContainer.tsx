'use client';

import dynamic from 'next/dynamic';

// Carrega o Leaflet dinamicamente, sem Server-Side Rendering
// Isso é necessário porque o Leaflet usa o objeto window, que não existe no SSR.
const VehicleMap = dynamic(() => import('./VehicleMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <p className="text-xl text-gray-500">Carregando mapa...</p>
    </div>
  ),
});

export default function MapContainer() {
  return <VehicleMap />;
}
