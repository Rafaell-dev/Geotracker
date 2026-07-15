import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { linkDevice } from '@/services/api';
import { Vehicle } from '@/types/vehicle';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LinkDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onSuccess?: (vehicleId: string) => void;
}

export function LinkDeviceModal({ isOpen, onClose, vehicles, selectedVehicleId, onSuccess }: LinkDeviceModalProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [deviceId, setDeviceId] = useState('');
  const [vehicleId, setVehicleId] = useState(selectedVehicleId || '');
  const [error, setError] = useState('');

  // Atualizar vehicleId se a prop selectedVehicleId mudar
  React.useEffect(() => {
    if (isOpen && selectedVehicleId) {
      setVehicleId(selectedVehicleId);
    } else if (isOpen && !selectedVehicleId) {
      setVehicleId('');
    }
  }, [isOpen, selectedVehicleId]);

  const mutation = useMutation({
    mutationFn: (data: { deviceId: string; vehicleId: string }) => linkDevice(data, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      if (onSuccess) onSuccess(vehicleId);
      setDeviceId('');
      setVehicleId('');
      setError('');
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Erro ao vincular');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md rounded-xl p-6 shadow-2xl border"
        style={{ backgroundColor: 'var(--gt-surface)', borderColor: 'var(--gt-border)' }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--gt-text-primary)' }}>
          Vincular Equipamento
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>
              Selecione o Veículo
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
            >
              <option value="">Selecione...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>
              ID do Equipamento (Device ID)
            </label>
            <input
              type="text"
              placeholder="Ex: TRK0001"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-md text-sm font-medium border hover:opacity-80 transition-opacity"
              style={{ borderColor: 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
            >
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate({ deviceId, vehicleId })}
              disabled={!deviceId || !vehicleId || mutation.isPending}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? 'Vinculando...' : 'Vincular'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
