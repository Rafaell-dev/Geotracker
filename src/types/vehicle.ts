export type VehicleStatus = "ONLINE" | "OFFLINE" | "PARADO" | "ALERTA" | "MANUTENCAO";

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  photo?: string | null;
  devices: any[];
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: VehicleStatus;
  updatedAt: string;
};
