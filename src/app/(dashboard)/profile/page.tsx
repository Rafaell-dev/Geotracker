'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, deleteProfile } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Lock, Trash2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { token, logout, updateUser } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // Forms states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status states
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [infoMessage, setInfoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    getProfile(token)
      .then(data => {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsUpdatingInfo(true);
    setInfoMessage(null);
    try {
      await updateProfile(token, { name, email });
      updateUser({ name, email });
      setInfoMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
    } catch (err: any) {
      setInfoMessage({ type: 'error', text: err.message || 'Erro ao atualizar informações' });
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }
    if (password.length < 6) {
      setPassMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' });
      return;
    }

    setIsUpdatingPassword(true);
    setPassMessage(null);
    try {
      await updateProfile(token, { password });
      setPassMessage({ type: 'success', text: 'Senha alterada com sucesso! Você será deslogado...' });
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.message || 'Erro ao atualizar senha' });
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    setIsDeleting(true);
    try {
      await deleteProfile(token);
      logout();
      router.push('/login');
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir conta');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gt-text-primary)]">Meu Perfil</h1>
        <p className="text-[var(--gt-text-secondary)] mt-1">Gerencie suas configurações de conta, senha e informações pessoais.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Informações Pessoais */}
        <div className="rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--gt-text-primary)]">Informações Pessoais</h2>
          </div>
          
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--gt-text-secondary)]">Nome Completo</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="bg-[#151822] border-[#2A2D3E] text-white focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--gt-text-secondary)]">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="bg-[#151822] border-[#2A2D3E] text-white focus:border-indigo-500"
              />
            </div>

            {infoMessage && (
              <div className={`p-3 rounded-lg text-sm ${infoMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {infoMessage.text}
              </div>
            )}

            <Button type="submit" disabled={isUpdatingInfo} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-2">
              {isUpdatingInfo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Informações
            </Button>
          </form>
        </div>

        {/* Segurança e Senha */}
        <div className="rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--gt-text-primary)]">Segurança e Senha</h2>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-[var(--gt-text-secondary)]">Nova Senha</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="Mínimo 6 caracteres"
                className="bg-[#151822] border-[#2A2D3E] text-white focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-[var(--gt-text-secondary)]">Confirmar Nova Senha</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                className="bg-[#151822] border-[#2A2D3E] text-white focus:border-orange-500"
              />
            </div>

            {passMessage && (
              <div className={`p-3 rounded-lg text-sm ${passMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {passMessage.text}
              </div>
            )}

            <Button type="submit" disabled={isUpdatingPassword} className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none mt-2">
              {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Atualizar Senha
            </Button>
          </form>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-xl mt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-red-500">Zona de Perigo</h2>
        </div>
        <p className="text-[var(--gt-text-secondary)] mb-6 ml-13">
          A exclusão da sua conta é irreversível. Todos os seus dados, veículos e históricos de telemetria serão apagados permanentemente de nossos servidores.
        </p>

        <Button 
          variant="outline" 
          onClick={() => setShowDeleteConfirm(true)}
          className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Minha Conta
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#1A1D2D] p-6 shadow-2xl">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Você tem absoluta certeza?</h2>
              <p className="mt-2 text-sm text-slate-400">
                Esta ação não pode ser desfeita. Todos os seus veículos e históricos serão deletados para sempre.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Excluir Definitivamente'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
