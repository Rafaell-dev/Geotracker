import { queryClient } from "@/lib/queryClient";
import { mockVehicles } from "@/data/vehicles.mock";
import { Vehicle } from "@/types/vehicle";
import { Telemetry } from "@/types/telemetry";

let intervalId: ReturnType<typeof setInterval> | null = null;

function generateTelemetry(vehicle: Vehicle): Telemetry {
  const speed = vehicle.status === "ONLINE" 
    ? Math.max(10, vehicle.speed + (Math.random() * 10 - 5)) 
    : 0;
  
  // 1 degree is approx 111km. Small delta for simulation purposes.
  const distance = speed * 0.00002; 
  const headingRad = vehicle.heading * (Math.PI / 180);
  
  const dLat = distance * Math.cos(headingRad);
  const dLon = distance * Math.sin(headingRad);
  
  const newHeading = vehicle.heading + (Math.random() * 20 - 10);

  return {
    vehicleId: vehicle.id,
    latitude: vehicle.latitude + dLat,
    longitude: vehicle.longitude + dLon,
    speed: speed,
    heading: newHeading >= 360 ? newHeading - 360 : newHeading < 0 ? newHeading + 360 : newHeading,
    timestamp: new Date().toISOString()
  };
}

export function startSimulation() {
  if (intervalId) return;

  // Initialize if empty
  if (!queryClient.getQueryData(['vehicles'])) {
    queryClient.setQueryData(['vehicles'], mockVehicles);
  }

  intervalId = setInterval(() => {
    queryClient.setQueryData<Vehicle[]>(['vehicles'], (oldVehicles) => {
      if (!oldVehicles) return [];
      
      return oldVehicles.map(v => {
        if (v.status === 'OFFLINE') return v;
        const telemetry = generateTelemetry(v);
        return {
          ...v,
          latitude: telemetry.latitude,
          longitude: telemetry.longitude,
          speed: telemetry.speed,
          heading: telemetry.heading,
          updatedAt: telemetry.timestamp
        };
      });
    });
  }, 2000); // 2 seconds update tick
}

export function stopSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
