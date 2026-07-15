import { useQuery } from '@tanstack/react-query';
import { Vehicle, VehicleStatus } from '@/types/vehicle';
import { fetchMyTelemetry, fetchMyVehicles, TelemetryData, VehicleFromApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export function useRealtimeVehicles() {
  const { token } = useAuth();

  return useQuery<Vehicle[]>({
    queryKey: ['vehicles', token],
    queryFn: async () => {
      // Sem token não há como autenticar — retorna lista vazia
      if (!token) return [];

      try {
        // Busca os veículos do usuário e a telemetria mais recente de todos
        const [apiVehicles, telemetry] = await Promise.all([
          fetchMyVehicles(token),
          fetchMyTelemetry(token, { limit: 200 }),
        ]);

        // Mapeia os veículos do backend e tenta achar o último ponto de telemetria deles
        const vehicles: Vehicle[] = apiVehicles.map(v => {
          const deviceIds = v.devices.map(d => d.deviceId);
          
          // Encontra a telemetria mais recente para um dos dispositivos deste veículo
          let latestT: TelemetryData | null = null;
          for (const t of telemetry) {
            if (deviceIds.includes(t.device_id)) {
              if (!latestT || new Date(t.timestamp).getTime() > new Date(latestT.timestamp).getTime()) {
                latestT = t;
              }
            }
          }

          let status: VehicleStatus = 'OFFLINE';
          let speedKmh = 0;
          let lat = -8.8921; // Posição padrão fallback
          let lng = -36.4972; 
          let updatedAt = new Date().toISOString();

          if (latestT) {
            const now = Date.now();
            const tTime = new Date(latestT.timestamp).getTime();
            const diffMinutes = (now - tTime) / 60000;
            
            if (diffMinutes > 10) {
              status = 'OFFLINE';
            } else if (latestT.gps.speed < 1) {
              status = 'PARADO';
            } else {
              status = 'ONLINE';
            }

            speedKmh = Math.round(latestT.gps.speed * 3.6);
            lat = latestT.gps.lat;
            lng = latestT.gps.lng;
            updatedAt = latestT.timestamp;
          }

          return {
            id: v.id,
            name: `${v.brand} ${v.model}`,
            plate: v.plate,
            brand: v.brand,
            model: v.model,
            year: v.year,
            photo: v.photo,
            devices: v.devices,
            latitude: lat,
            longitude: lng,
            speed: speedKmh,
            heading: latestT && latestT.gps.speed > 1 ? Math.floor(Math.random() * 360) : 0,
            status,
            updatedAt,
            hasTelemetry: !!latestT // útil para filtrar no frontend se necessário
          };
        });

        return vehicles;
      } catch (error) {
        console.error('Failed to fetch realtime data:', error);
        return [];
      }
    },
    enabled: !!token, // só executa quando há token
    refetchInterval: 5000, // polling a cada 5s
    staleTime: 2000,
  });
}

