'use client';

import React, { useState } from 'react';
import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";
import { VehicleCard } from '@/components/map/vehicle-card';
import { useRealtimeVehicles } from '@/hooks/useRealtimeVehicles';
import { useTheme } from '@/contexts/ThemeContext';
import { LinkDeviceModal } from '@/components/vehicles/LinkDeviceModal';
import { CreateVehicleModal } from '@/components/vehicles/CreateVehicleModal';
import { EditVehicleModal } from '@/components/vehicles/EditVehicleModal';
import { UnlinkDeviceModal } from '@/components/vehicles/UnlinkDeviceModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, MapPin, Link2Off, Link2, MoreHorizontal } from 'lucide-react';

export default function DashboardPage() {
  const { data: vehicles = [], isLoading } = useRealtimeVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateVehicleOpen, setIsCreateVehicleOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [actionVehicle, setActionVehicle] = useState<any | null>(null);
  const { theme } = useTheme();

  // MapLibre espera coordenadas no formato [longitude, latitude]
  const defaultCenter: [number, number] = [-36.4972, -8.8921]; // Garanhuns, PE

  // Só exibe o card se o usuário clicar num marcador no mapa
  const activeVehicle = selectedVehicle
    ? vehicles.find(v => v.id === selectedVehicle) ?? null
    : null;

  const hasValidCoords = (v: any) => 
    v && 
    v.devices?.length > 0 && 
    v.latitude != null && 
    v.longitude != null && 
    !(v.latitude === 0 && v.longitude === 0);

  const activeVehicleCoords = activeVehicle && hasValidCoords(activeVehicle)
    ? [activeVehicle.longitude, activeVehicle.latitude] as [number, number]
    : defaultCenter;

  return (
    <div className="absolute inset-0 overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--gt-surface)' }}>
      {/* Map View — segue o tema global */}
      <Map
        center={activeVehicleCoords}
        zoom={activeVehicle && hasValidCoords(activeVehicle) ? 14 : 11}
        theme={theme}
      >
        <MapControls />

        {/* Markers */}
        {vehicles.filter(hasValidCoords).map((vehicle) => (
          <MapMarker
            key={vehicle.id}
            latitude={vehicle.latitude}
            longitude={vehicle.longitude}
            onClick={() => setSelectedVehicle(vehicle.id)}
          >
            <MarkerContent>
              <div
                className="relative flex h-6 w-6 items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                title={vehicle.name}
              >
                {vehicle.id === activeVehicle?.id && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg" />
              </div>
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>

      {/* Card do veículo ativo */}
      {activeVehicle && (
        <div className="absolute top-4 right-4 z-50">
          <VehicleCard
            vehicleName={activeVehicle.name || activeVehicle.plate || 'Veículo'}
            imageUrl={(activeVehicle as any).photo}
            speed={activeVehicle.speed}
            lastUpdate={activeVehicle.updatedAt}
            isLoading={isLoading}
            onClose={() => setSelectedVehicle(null)}
          />
        </div>
      )}

      {/* Floating Panel — Frota de Veículos */}
      <div 
        className="fixed bottom-0 left-0 right-0 md:left-[220px] h-[35vh] md:h-[30vh] border-t transition-colors duration-300 z-[50] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        style={{
          backgroundColor: 'var(--gt-drawer-bg)',
          borderColor: 'var(--gt-border)',
          color: 'var(--gt-text-primary)',
        }}
      >
        <div className="w-full h-full flex flex-col p-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg" style={{ color: 'var(--gt-text-primary)' }}>
              Frota de Veículos
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreateVehicleOpen(true)}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
              >
                + Cadastrar Veículo
              </button>
            </div>
          </div>
            <div className="flex-1 overflow-auto rounded-md border" style={{ borderColor: 'var(--gt-border)' }}>
              <Table>
                <TableHeader
                  className="sticky top-0 z-10 transition-colors duration-300"
                  style={{ backgroundColor: 'var(--gt-surface-raised)' }}
                >
                  <TableRow style={{ borderColor: 'var(--gt-border)' }}>
                    <TableHead style={{ color: 'var(--gt-text-secondary)' }}>Veículo</TableHead>
                    <TableHead style={{ color: 'var(--gt-text-secondary)' }}>Placa</TableHead>
                    <TableHead style={{ color: 'var(--gt-text-secondary)' }}>Equipamento</TableHead>
                    <TableHead className="w-[100px]" style={{ color: 'var(--gt-text-secondary)' }}>Velocidade</TableHead>
                    <TableHead className="text-right w-[140px]" style={{ color: 'var(--gt-text-secondary)' }}>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.length === 0 && !isLoading && (
                    <TableRow style={{ borderColor: 'var(--gt-border)' }}>
                      <TableCell colSpan={5} className="text-center py-4" style={{ color: 'var(--gt-text-secondary)' }}>
                        Nenhum veículo encontrado
                      </TableCell>
                    </TableRow>
                  )}
                  {vehicles.map((v) => (
                    <TableRow
                      key={v.id}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderColor: 'var(--gt-border)',
                        backgroundColor: selectedVehicle === v.id ? 'var(--gt-surface-raised)' : undefined,
                      }}
                      onClick={() => setSelectedVehicle(v.id)}
                      onMouseEnter={e => {
                        if (selectedVehicle !== v.id)
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gt-surface-raised)';
                      }}
                      onMouseLeave={e => {
                        if (selectedVehicle !== v.id)
                          (e.currentTarget as HTMLElement).style.backgroundColor = '';
                      }}
                    >
                      <TableCell className="font-medium" style={{ color: 'var(--gt-text-primary)' }}>{v.name}</TableCell>
                      <TableCell style={{ color: 'var(--gt-text-secondary)' }}>{v.plate}</TableCell>
                      <TableCell>
                        {v.devices && v.devices.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm uppercase">
                            Vinculado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20 shadow-sm uppercase">
                            Nenhum
                          </span>
                        )}
                      </TableCell>
                      <TableCell style={{ color: 'var(--gt-text-secondary)' }}>{v.speed} km/h</TableCell>
                      <TableCell className="text-right">
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-white/10 text-slate-400 transition-colors inline-flex items-center justify-center">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-[#1E2230] border-[#2A2D3E] text-slate-300 shadow-xl">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#2A2D3E]" />
                                <DropdownMenuItem 
                                  className="cursor-pointer py-3 focus:bg-[#2A2D3E] focus:text-white"
                                  onClick={() => setSelectedVehicle(v.id)}
                                >
                                  <MapPin className="mr-2 h-4 w-4 text-green-400" />
                                  <span>Localizar no mapa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer py-3 focus:bg-[#2A2D3E] focus:text-white"
                                  onClick={() => { setActionVehicle(v); setIsEditModalOpen(true); }}
                                >
                                  <Edit2 className="mr-2 h-4 w-4 text-blue-400" />
                                  <span>Editar veículo</span>
                                </DropdownMenuItem>
                                {v.devices && v.devices.length > 0 ? (
                                  <DropdownMenuItem 
                                    className="cursor-pointer py-3 focus:bg-[#2A2D3E] focus:text-red-400 text-red-400"
                                    onClick={() => { setActionVehicle(v); setIsUnlinkModalOpen(true); }}
                                  >
                                    <Link2Off className="mr-2 h-4 w-4" />
                                    <span>Desvincular equipamento</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    className="cursor-pointer py-3 focus:bg-[#2A2D3E] focus:text-blue-400 text-blue-400"
                                    onClick={() => { setActionVehicle(v); setIsModalOpen(true); }}
                                  >
                                    <Link2 className="mr-2 h-4 w-4" />
                                    <span>Vincular equipamento</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      <LinkDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicles={vehicles}
        selectedVehicleId={actionVehicle?.id}
        onSuccess={(vehicleId) => setSelectedVehicle(vehicleId)}
      />

      <CreateVehicleModal
        isOpen={isCreateVehicleOpen}
        onClose={() => setIsCreateVehicleOpen(false)}
      />

      <EditVehicleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vehicle={actionVehicle}
      />

      <UnlinkDeviceModal
        isOpen={isUnlinkModalOpen}
        onClose={() => setIsUnlinkModalOpen(false)}
        vehicle={actionVehicle}
      />
    </div>
  );
}
