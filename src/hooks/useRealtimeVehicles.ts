import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockVehicles } from '@/data/vehicles.mock';
import { Vehicle } from '@/types/vehicle';
import { startSimulation, stopSimulation } from '@/services/vehicle-simulator';

export function useRealtimeVehicles() {
  const query = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => mockVehicles,
    staleTime: Infinity,
    initialData: mockVehicles
  });

  useEffect(() => {
    startSimulation();

    return () => {
      stopSimulation();
    };
  }, []);

  return query;
}
