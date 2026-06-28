export type VehicleStatus = "ONLINE" | "OFFLINE";

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
