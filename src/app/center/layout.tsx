'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';

export default function CenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
