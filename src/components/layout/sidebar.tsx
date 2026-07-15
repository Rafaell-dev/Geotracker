'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCircle, LogOut, MapPin, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  hasBadge?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, hasBadge }: SidebarItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
      isActive
        ? "bg-blue-600/15 text-blue-500"
        : "text-[var(--gt-text-secondary)] hover:text-[var(--gt-text-primary)] hover:bg-[var(--gt-surface-raised)]"
    )}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
    )}
    <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-[var(--gt-text-secondary)] group-hover:text-[var(--gt-text-primary)]")} />
    <span className="font-medium text-sm">{label}</span>
    {hasBadge && (
      <span className="ml-auto flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
    )}
  </Link>
);

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: UserCircle, label: 'Usuário', href: '/profile' },
  ];

  const userName = user?.name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div
      className="flex flex-col h-full w-[220px] flex-shrink-0 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--gt-sidebar-bg)',
        borderRight: '1px solid var(--gt-sidebar-border)',
      }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center px-6"
        style={{ borderBottom: '1px solid var(--gt-sidebar-border)' }}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold tracking-wide text-[var(--gt-text-primary)]">GeoTracker</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-8">
        {/* Navigation */}
        <div>
          <h4
            className="px-3 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--gt-text-secondary)' }}
          >
            Navegação
          </h4>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                hasBadge={(item as any).hasBadge}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-4 flex flex-col gap-2"
        style={{ borderTop: '1px solid var(--gt-sidebar-border)' }}
      >
        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 cursor-pointer group"
          style={{
            color: 'var(--gt-text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gt-surface-raised)';
            (e.currentTarget as HTMLElement).style.color = 'var(--gt-text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '';
            (e.currentTarget as HTMLElement).style.color = 'var(--gt-text-secondary)';
          }}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Sun
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
              }`}
            />
            <Moon
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}
            />
          </div>
          <span className="font-medium text-sm">
            {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full cursor-pointer"
          style={{ color: 'var(--gt-text-secondary)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#EF4444';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '';
            (e.currentTarget as HTMLElement).style.color = 'var(--gt-text-secondary)';
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}
