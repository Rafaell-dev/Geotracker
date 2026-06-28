import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleStatus } from "./VehicleStatus";
import { VehicleDetails } from "./VehicleDetails";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-bold">{vehicle.name}</CardTitle>
        <VehicleStatus status={vehicle.status} />
      </CardHeader>
      <CardContent>
        <VehicleDetails vehicle={vehicle} />
      </CardContent>
    </Card>
  );
}
