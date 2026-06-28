import { Badge } from "@/components/ui/badge";
import { VehicleStatus as StatusType } from "@/types/vehicle";

interface VehicleStatusProps {
  status: StatusType;
}

const statusConfig: Record<StatusType, { label: string, className: string }> = {
  ONLINE: { label: "Online", className: "bg-green-500 hover:bg-green-600 text-white border-transparent" },
  PARADO: { label: "Parado", className: "bg-blue-500 hover:bg-blue-600 text-white border-transparent" },
  OFFLINE: { label: "Offline", className: "bg-slate-500 hover:bg-slate-600 text-white border-transparent" },
  ALERTA: { label: "Alerta", className: "bg-red-500 hover:bg-red-600 text-white border-transparent" },
  MANUTENCAO: { label: "Manutenção", className: "bg-amber-500 hover:bg-amber-600 text-white border-transparent" }
};

export function VehicleStatus({ status }: VehicleStatusProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={`border-none ${config.className}`}>
      {config.label}
    </Badge>
  );
}
