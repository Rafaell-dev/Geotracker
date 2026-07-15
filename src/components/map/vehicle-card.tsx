'use client';

import React from 'react';
import Image from 'next/image';
import { X, Clock, Navigation, Car } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface VehicleCardProps {
  vehicleName: string;
  imageUrl?: string;
  speed?: number;
  lastUpdate?: string;
  isLoading?: boolean;
  onClose: () => void;
}

export function VehicleCard({
  vehicleName,
  imageUrl,
  speed = 0,
  lastUpdate,
  isLoading = false,
  onClose
}: VehicleCardProps) {
  if (isLoading) {
    return (
      <div className="w-[280px] bg-[#1E2230] rounded-2xl shadow-2xl overflow-hidden border border-[#2A2D3E]">
        <Skeleton className="h-[140px] w-full rounded-t-2xl" />
        <div className="p-5">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = lastUpdate 
    ? new Date(lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="w-[280px] bg-[#1E2230] rounded-2xl shadow-2xl overflow-hidden border border-[#2A2D3E] flex flex-col relative animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Top Image Area */}
      <div className="relative h-[140px] w-full bg-[#13151C] flex items-center justify-center border-b border-[#2A2D3E]">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={vehicleName}
            fill
            className="object-cover object-center"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <Car className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-semibold uppercase tracking-wider">Sem foto</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white tracking-wide mb-6 truncate">
          {vehicleName}
        </h3>

        {/* Metrics Row */}
        <div className="flex items-center gap-6">
          
          {/* Metric 1 */}
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shadow-inner">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Velocidade</span>
              <span className="text-sm font-bold text-white">{speed} km/h</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shadow-inner">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Última Trans.</span>
              <span className="text-sm font-bold text-white">{formattedDate}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
