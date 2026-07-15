import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createVehicle } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVehicleModal({ isOpen, onClose }: CreateVehicleModalProps) {
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

  const mutation = useMutation({
    mutationFn: (data: any) => createVehicle(data, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setFormData({ plate: '', model: '', brand: '', year: '', photo: '' });
      setPhotoPreview(null);
      setError('');
      setFieldErrors({});
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Erro ao cadastrar veículo');
    }
  });

  const handleValidate = () => {
    const errors: Record<string, string> = {};
    const plateUpper = formData.plate.trim().toUpperCase();
    
    // Placa: Validação básica (6 a 8 caracteres sem espaços)
    if (!plateUpper || plateUpper.length < 6 || plateUpper.length > 8 || /\s/.test(plateUpper)) {
      errors.plate = "Placa inválida (6 a 8 letras/números).";
    }
    if (!formData.brand) {
      errors.brand = "Selecione uma marca.";
    }
    if (!formData.model || formData.model.trim().length < 2) {
      errors.model = "Mínimo 2 letras.";
    }
    
    const yearNum = Number(formData.year);
    const currentYear = new Date().getFullYear();
    if (!formData.year || isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
      errors.year = `Inválido (1900-${currentYear + 1}).`;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md rounded-xl p-6 shadow-2xl border"
        style={{ backgroundColor: 'var(--gt-surface)', borderColor: 'var(--gt-border)' }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--gt-text-primary)' }}>
          Cadastrar Novo Veículo
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Placa</label>
            <input
              type="text"
              placeholder="Ex: ABC1234"
              value={formData.plate}
              onChange={(e) => {
                setFormData({ ...formData, plate: e.target.value.toUpperCase() });
                if (fieldErrors.plate) setFieldErrors({ ...fieldErrors, plate: '' });
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.plate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              style={{ backgroundColor: 'var(--gt-surface-raised)', borderColor: fieldErrors.plate ? 'rgb(239 68 68)' : 'var(--gt-border)', color: 'var(--gt-text-primary)' }}
            />
            {fieldErrors.plate && <span className="text-red-500 text-xs mt-1 block">{fieldErrors.plate}</span>}
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
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Modelo</label>
              <input
                type="text"
                placeholder="Ex: Corolla"
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
            <div className="w-1/3">
              <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Ano</label>
              <input
                type="number"
                placeholder="2024"
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
            <label className="block text-sm mb-1" style={{ color: 'var(--gt-text-secondary)' }}>Foto do Veículo (Opcional)</label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="w-16 h-16 object-cover rounded-md border" style={{ borderColor: 'var(--gt-border)' }} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
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
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
