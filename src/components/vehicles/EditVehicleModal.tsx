'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVehicle, VehicleFromApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Camera } from 'lucide-react';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleFromApi | null;
  onSuccess?: () => void;
}

export function EditVehicleModal({ isOpen, onClose, vehicle, onSuccess }: EditVehicleModalProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ plate: '', model: '', brand: '', year: '', photo: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const CAR_BRANDS = [
    'Chevrolet', 'Volkswagen', 'Fiat', 'Ford', 'Toyota', 'Hyundai', 
    'Renault', 'Honda', 'Nissan', 'Jeep', 'Peugeot', 'Citroën', 
    'BMW', 'Mercedes-Benz', 'Audi', 'Kia', 'Volvo', 'Outra'
  ];

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plate: vehicle.plate || '',
        model: vehicle.model || '',
        brand: vehicle.brand || '',
        year: vehicle.year ? vehicle.year.toString() : '',
        photo: vehicle.photo || ''
      });
      setPhotoPreview(vehicle.photo || null);
      setError('');
      setFieldErrors({});
    }
  }, [vehicle]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateVehicle(vehicle!.id, data, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setError('');
      setFieldErrors({});
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Erro ao editar veículo');
    }
  });

  const handleValidate = () => {
    const errors: Record<string, string> = {};
    const plateUpper = formData.plate.trim().toUpperCase();

    if (!plateUpper || plateUpper.length < 6 || plateUpper.length > 8 || /\s/.test(plateUpper)) {
      errors.plate = "Placa inválida (6 a 8 letras/números).";
    }
    if (!formData.brand) {
      errors.brand = "Selecione uma marca.";
    }
    if (!formData.model || formData.model.trim().length < 2) {
      errors.model = "Mínimo 2 letras.";
    }
    const y = Number(formData.year);
    if (!y || isNaN(y) || y < 1900 || y > 2030) {
      errors.year = "Ano inválido.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, photo: base64String }));
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (handleValidate()) {
      mutation.mutate({ ...formData, year: Number(formData.year), plate: formData.plate.trim().toUpperCase() });
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border flex flex-col"
        style={{ backgroundColor: 'var(--gt-drawer-bg)', borderColor: 'var(--gt-border)', maxHeight: '90vh' }}
      >
        {/* Cover Image Area */}
        <div className="relative h-[160px] shrink-0 w-full bg-black/40 flex items-center justify-center border-b" style={{ borderColor: 'var(--gt-border)' }}>
          {photoPreview ? (
            <img 
              src={photoPreview} 
              alt="Preview" 
              className="object-cover object-center w-full h-full" 
            />
          ) : (
            <div className="text-slate-500 flex flex-col items-center">
              <Camera className="w-10 h-10 mb-2 opacity-30" />
              <span className="text-sm font-medium opacity-50">Sem foto</span>
            </div>
          )}
          
          <label className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors group" title="Alterar foto">
            <Camera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        <div className="p-6 border-b shrink-0" style={{ borderColor: 'var(--gt-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--gt-text-primary)' }}>Editar Veículo</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--gt-text-secondary)' }}>Altere os dados do veículo abaixo.</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Placa</label>
              <input
                type="text"
                placeholder="Ex: ABC1D23"
                value={formData.plate}
                onChange={(e) => {
                  setFormData({ ...formData, plate: e.target.value });
                  if (fieldErrors.plate) setFieldErrors({ ...fieldErrors, plate: '' });
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 ${fieldErrors.plate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: fieldErrors.plate ? 'rgb(239 68 68)' : 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
              />
              {fieldErrors.plate && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.plate}</span>}
            </div>
            <div className="w-[120px]">
              <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Ano</label>
              <input
                type="number"
                placeholder="Ex: 2024"
                value={formData.year}
                onChange={(e) => {
                  setFormData({ ...formData, year: e.target.value });
                  if (fieldErrors.year) setFieldErrors({ ...fieldErrors, year: '' });
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.year ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: fieldErrors.year ? 'rgb(239 68 68)' : 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
              />
              {fieldErrors.year && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.year}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Marca</label>
            <select
              value={formData.brand}
              onChange={(e) => {
                setFormData({ ...formData, brand: e.target.value });
                if (fieldErrors.brand) setFieldErrors({ ...fieldErrors, brand: '' });
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.brand ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: fieldErrors.brand ? 'rgb(239 68 68)' : 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
            >
              <option value="" disabled>Selecione a marca</option>
              {CAR_BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            {fieldErrors.brand && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.brand}</span>}
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Modelo</label>
            <input
              type="text"
              placeholder="Ex: Onix 1.0"
              value={formData.model}
              onChange={(e) => {
                setFormData({ ...formData, model: e.target.value });
                if (fieldErrors.model) setFieldErrors({ ...fieldErrors, model: '' });
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.model ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: fieldErrors.model ? 'rgb(239 68 68)' : 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
            />
            {fieldErrors.model && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.model}</span>}
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded-md hover:opacity-80 transition-opacity"
              style={{ color: 'var(--gt-text-primary)', backgroundColor: 'var(--gt-surface)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
