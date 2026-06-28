import { RouteHistory, RoutePoint } from "@/types/route";

const generateMockRoute = (
  startLat: number,
  startLon: number,
  pointsCount: number
): RoutePoint[] => {
  const points: RoutePoint[] = [];
  let currentLat = startLat;
  let currentLon = startLon;
  let currentTime = Date.now() - pointsCount * 60000; // Start in the past, 1 minute per point

  for (let i = 0; i < pointsCount; i++) {
    points.push({
      latitude: currentLat,
      longitude: currentLon,
      speed: Math.floor(Math.random() * 40) + 20,
      heading: Math.floor(Math.random() * 360),
      timestamp: new Date(currentTime).toISOString(),
    });

    // Move slightly
    currentLat += (Math.random() - 0.5) * 0.005;
    currentLon += (Math.random() - 0.5) * 0.005;
    currentTime += 60000;
  }

  return points;
};

export const mockRoutes: RouteHistory[] = [
  {
    vehicleId: "v-001",
    points: generateMockRoute(-8.891, -36.495, 15),
  },
  {
    vehicleId: "v-002",
    points: generateMockRoute(-8.895, -36.49, 10),
  },
  {
    vehicleId: "v-003",
    points: generateMockRoute(-8.888, -36.501, 20),
  },
];
