'use client';

import { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { deleteVehicle } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSuccess?: () => void;
}

export function DeleteVehicleModal({ isOpen, onClose, vehicle, onSuccess }: DeleteVehicleModalProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const handleDelete = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await deleteVehicle(token, vehicle.id);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-6 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <Trash2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-[var(--gt-text-primary)]">Excluir Veículo</h2>
          <p className="mt-2 text-sm text-[var(--gt-text-secondary)]">
            Tem certeza que deseja excluir o veículo <strong>{vehicle.plate} - {vehicle.name}</strong>?
            Esta ação é irreversível e removerá todos os dados associados a ele.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sim, Excluir'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
