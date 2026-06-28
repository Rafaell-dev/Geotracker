export type VehicleStatus = "ONLINE" | "OFFLINE" | "PARADO" | "ALERTA" | "MANUTENCAO";

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: VehicleStatus;
  updatedAt: string;
};
