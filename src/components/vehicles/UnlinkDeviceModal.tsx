'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unlinkDevice, VehicleFromApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface UnlinkDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleFromApi | null;
  onSuccess?: () => void;
}

export function UnlinkDeviceModal({ isOpen, onClose, vehicle, onSuccess }: UnlinkDeviceModalProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (deviceId: string) => unlinkDevice(deviceId, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setError('');
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Erro ao desvincular equipamento');
    }
  });

  if (!isOpen || !vehicle) return null;

  const deviceId = vehicle.devices?.[0]?.deviceId;

  const handleUnlink = () => {
    if (deviceId) {
      mutation.mutate(deviceId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border"
        style={{ backgroundColor: 'var(--gt-drawer-bg)', borderColor: 'var(--gt-border)' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--gt-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--gt-text-primary)' }}>Desvincular Equipamento</h2>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}

          {!deviceId ? (
            <p className="text-sm" style={{ color: 'var(--gt-text-secondary)' }}>
              Este veículo não possui nenhum equipamento vinculado no momento.
            </p>
          ) : (
            <>
              <p className="text-sm" style={{ color: 'var(--gt-text-secondary)' }}>
                Tem certeza que deseja desvincular o equipamento do veículo <strong>{vehicle.brand} {vehicle.model} ({vehicle.plate})</strong>?
              </p>
              
              <div className="p-4 rounded-lg bg-black/20 border border-blue-500/20">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Equipamento Vinculado</p>
                <p className="font-mono text-lg font-bold text-white">{deviceId}</p>
              </div>

              <p className="text-xs text-red-400">
                Atenção: O veículo deixará de reportar sua localização até que um novo equipamento seja vinculado.
              </p>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-80 transition-opacity"
              style={{ color: 'var(--gt-text-primary)', backgroundColor: 'var(--gt-surface)' }}
            >
              Cancelar
            </button>
            {deviceId && (
              <button
                onClick={handleUnlink}
                disabled={mutation.isPending}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {mutation.isPending ? 'Desvinculando...' : 'Sim, desvincular'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
