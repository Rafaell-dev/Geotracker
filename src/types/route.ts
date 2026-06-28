export type RoutePoint = {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
};

export type RouteHistory = {
  vehicleId: string;
  points: RoutePoint[];
};
