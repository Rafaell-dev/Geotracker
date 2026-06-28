import { Vehicle } from "@/types/vehicle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VehicleCard } from "../vehicle/VehicleCard";
import { Menu } from "lucide-react";

interface MapControlsProps {
  vehicles: Vehicle[];
}

export function MapControls({ vehicles }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Sheet>
        <SheetTrigger render={
          <Button variant="default" size="icon" className="shadow-lg">
            <Menu className="h-5 w-5" />
          </Button>
        } />
        <SheetContent side="right" className="w-[340px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Veículos ({vehicles.length})</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
            <div className="flex flex-col gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
