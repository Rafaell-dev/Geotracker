import { Badge } from "@/components/ui/badge";
import { VehicleStatus as StatusType } from "@/types/vehicle";

interface VehicleStatusProps {
  status: StatusType;
}

export function VehicleStatus({ status }: VehicleStatusProps) {
  const isOnline = status === "ONLINE";
  
  return (
    <Badge variant={isOnline ? "default" : "destructive"} className={isOnline ? "bg-green-600 hover:bg-green-700" : ""}>
      {isOnline ? "Online" : "Offline"}
    </Badge>
  );
}
