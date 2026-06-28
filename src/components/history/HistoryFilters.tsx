import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HistoryFilters() {
  return (
    <div className="p-4 border-b flex justify-between items-center bg-slate-50">
      <div className="text-sm text-muted-foreground">Filtros de data (em breve)</div>
      <Link href="/">
        <Button variant="outline" size="sm">Voltar ao Mapa</Button>
      </Link>
    </div>
  );
}
