'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createVehicle } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function NewVehiclePage() {
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError('Você precisa estar logado para cadastrar um veículo.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await createVehicle({
        plate,
        model,
        brand,
        year: parseInt(year, 10),
        // userId não é mais necessário no body — o backend extrai do JWT
      }, token);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar veículo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-start justify-center">
      <div className="w-full max-w-lg mt-10">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o Mapa
        </Link>
        
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Novo Veículo</CardTitle>
            </div>
            <CardDescription>
              Cadastre um novo veículo para começar a rastreá-lo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="p-6 bg-emerald-50 text-emerald-700 rounded-lg text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-1">Veículo cadastrado!</h3>
                <p className="text-sm opacity-90">Redirecionando para o mapa...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input 
                    id="plate" 
                    placeholder="ABC1D23" 
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    required 
                    maxLength={7}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input 
                      id="brand" 
                      placeholder="Ex: Chevrolet" 
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input 
                      id="model" 
                      placeholder="Ex: Onix" 
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Ano de Fabricação</Label>
                  <Input 
                    id="year" 
                    type="number" 
                    placeholder="2024" 
                    min={1900}
                    max={2030}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required 
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Cadastrar Veículo'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
