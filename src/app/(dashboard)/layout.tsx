'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();

  // If still checking auth, show nothing or a spinner
  if (isLoading) return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: 'var(--gt-surface)', color: 'var(--gt-text-primary)' }}>
      Carregando...
    </div>
  );

  // Render the layout
  return (
    <div className="flex h-screen w-full overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--gt-surface)', color: 'var(--gt-text-primary)' }}>
      {/* Desktop Sidebar */}
      <div className={`hidden md:block h-full transition-all duration-300 relative z-[60] ${isCollapsed ? 'w-0' : 'w-[220px]'}`}>
        <div className={`h-full overflow-hidden w-[220px] transition-all duration-300 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
          <Sidebar />
        </div>
      </div>

      {/* Collapse Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden md:flex absolute top-6 z-[70] w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full items-center justify-center shadow-lg border border-blue-500/50 transition-all duration-300 ${isCollapsed ? 'left-4' : 'left-[204px]'}`}
        title={isCollapsed ? "Expandir menu" : "Esconder menu"}
      >
        <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Main Content Area */}
      <main className="flex-1 h-full w-full relative overflow-hidden flex" style={{ backgroundColor: 'var(--gt-surface)' }}>

        {/* Mobile Sidebar (Sheet) */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger className="w-10 h-10 bg-[#1E2230] border border-[#2A2D3E] rounded-lg flex items-center justify-center text-white shadow-lg">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[220px] border-r-[#2A2D3E] bg-[#13151C] text-white">
              <SheetTitle className="sr-only">Navegação</SheetTitle>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page Content */}
        <div className="flex-1 h-full w-full relative">
          {children}
        </div>
      </main>
    </div>
  );
}
