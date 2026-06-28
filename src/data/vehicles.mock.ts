import { Vehicle } from "@/types/vehicle";

export const mockVehicles: Vehicle[] = [
  {
    id: "v-001",
    name: "Caminhão 01",
    plate: "ABC-1234",
    latitude: -8.8910,
    longitude: -36.4950,
    speed: 45,
    heading: 90,
    status: "ONLINE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "v-002",
    name: "Van Entrega",
    plate: "XYZ-9876",
    latitude: -8.8950,
    longitude: -36.4900,
    speed: 0,
    heading: 180,
    status: "OFFLINE",
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "v-003",
    name: "Carro Forte",
    plate: "DEF-5678",
    latitude: -8.8880,
    longitude: -36.5010,
    speed: 60,
    heading: 270,
    status: "ONLINE",
    updatedAt: new Date().toISOString(),
  },
];
