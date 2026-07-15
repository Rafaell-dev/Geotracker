'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser, registerUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Compass, BarChart3, Car } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        login(response);
      } else {
        await registerUser({ name, email, password, role: 'user' });
        const response = await loginUser({ email, password });
        login(response);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0F1117] text-[#F8FAFC]">
      {/* Left Column (55%) - Hidden on mobile */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0F1117]">
        {/* Abstract Background Map/Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1117] via-[#0F1117]/80 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 h-full w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">GeoTracker</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-8 text-white">
            Rastreie sua frota em tempo real
          </h1>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E2230] border border-[#2A2D3E] flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Localização Precisa</h3>
                <p className="text-[#94A3B8]">Monitore cada veículo com atualizações em tempo real no mapa integrado.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E2230] border border-[#2A2D3E] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Histórico de Rotas</h3>
                <p className="text-[#94A3B8]">Acesse o trajeto completo e analise o desempenho diário da sua frota.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E2230] border border-[#2A2D3E] flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Gestão Inteligente</h3>
                <p className="text-[#94A3B8]">Otimize custos e reduza emissões com dados de telemetria avançada.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (45%) */}
      <div className="w-full lg:w-[45%] bg-[#13151C] flex flex-col justify-center items-center p-8 sm:p-12 border-l border-[#2A2D3E]">
        <div className="w-full max-w-md space-y-8">
          
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 lg:hidden">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {isLogin ? 'Bem-vindo de volta' : 'Criar Nova Conta'}
            </h2>
            <p className="text-[#94A3B8]">
              {isLogin ? 'Insira suas credenciais para acessar a plataforma' : 'Preencha os dados abaixo para começar a rastrear'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#F8FAFC]">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Seu nome" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#1E2230] border-[#2A2D3E] text-white focus-visible:ring-blue-500 h-12"
                  required 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F8FAFC]">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1E2230] border-[#2A2D3E] text-white focus-visible:ring-blue-500 h-12"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#F8FAFC]">Senha</Label>
                {isLogin && (
                  <Link href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1E2230] border-[#2A2D3E] text-white focus-visible:ring-blue-500 h-12"
                required 
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-[#EF4444] bg-[#EF4444]/10 rounded-md border border-[#EF4444]/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base mt-4" disabled={isLoading}>
              {isLoading ? 'Aguarde...' : isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2A2D3E] text-center">
            <p className="text-[#94A3B8]">
              {isLogin ? 'Não tem conta? ' : 'Já possui uma conta? '}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {isLogin ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
