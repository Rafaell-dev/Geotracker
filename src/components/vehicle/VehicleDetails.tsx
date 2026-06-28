import { Vehicle } from "@/types/vehicle";
import { Separator } from "@/components/ui/separator";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const formattedDate = new Date(vehicle.updatedAt).toLocaleString("pt-BR");

  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
      <div className="flex justify-between">
        <span className="font-semibold">Placa:</span>
        <span>{vehicle.plate}</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="font-semibold">Velocidade:</span>
        <span>{vehicle.speed} km/h</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="font-semibold">Direção:</span>
        <span>{vehicle.heading}°</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="font-semibold">Atualizado:</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
