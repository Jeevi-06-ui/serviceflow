'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Tv,
  FileCheck2,
  Wrench,
  CalendarDays,
  Star,
  Users,
  Building2,
  Layers,
  BarChart3,
  AlertTriangle,
  Menu,
  X,
  ShieldCheck,
  PackagePlus,
  HelpCircle,
  FileSpreadsheet,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scoped navigation links per role
  const getNavLinks = () => {
    switch (role) {
      case 'customer':
        return [
          { label: 'My Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
          { label: 'Registered Products', href: '/customer/products', icon: Tv },
          { label: 'Digital Warranties', href: '/customer/warranties', icon: FileCheck2 },
          { label: 'Service Requests', href: '/customer/requests', icon: Wrench },
          { label: 'Appointments', href: '/customer/appointments', icon: CalendarDays },
          { label: 'Service Feedback', href: '/customer/feedback', icon: Star },
        ];
      case 'center':
        return [
          { label: 'Center Dashboard', href: '/center/dashboard', icon: LayoutDashboard },
          { label: 'Service Requests', href: '/center/requests', icon: Wrench },
          { label: 'Appointments & Dispatch', href: '/center/appointments', icon: CalendarDays },
          { label: 'Technician Roster', href: '/center/technicians', icon: Users },
          { label: 'Customer Directory', href: '/center/customers', icon: Users },
          { label: 'Repair Estimates', href: '/center/estimates', icon: FileSpreadsheet },
          { label: 'Spare Parts Inventory', href: '/center/spares', icon: Layers },
        ];
      case 'technician':
        return [
          { label: 'Daily Run Sheet', href: '/technician/dashboard', icon: LayoutDashboard },
          { label: 'Assigned Tasks', href: '/technician/tasks', icon: Wrench },
          { label: 'Schedule Calendar', href: '/technician/schedule', icon: CalendarDays },
          { label: 'Completed Jobs', href: '/technician/history', icon: FileCheck2 },
          { label: 'Performance & CSAT', href: '/technician/performance', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { label: 'Executive Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Service Centers', href: '/admin/centers', icon: Building2 },
          { label: 'Technician Management', href: '/admin/technicians', icon: Users },
          { label: 'Customer Records', href: '/admin/customers', icon: Users },
          { label: 'Product Catalog', href: '/admin/products', icon: Tv },
          { label: 'Warranty Master', href: '/admin/warranties', icon: FileCheck2 },
          { label: 'Complaints & SLA', href: '/admin/complaints', icon: AlertTriangle },
          { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-5 left-5 z-50 p-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black text-sm tracking-tight shadow-md">
            SF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">ServiceFlow</span>
            <span className="text-[10px] text-teal-400 font-medium">Jeevix Technologies</span>
          </div>
        </div>

        {/* Current Active Role Capsule */}
        <div className="px-4 py-3 mx-4 my-3 bg-slate-800/70 border border-slate-700/60 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Operational Portal</div>
          <div className="text-xs font-semibold text-white mt-0.5 capitalize flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {role} Portal
          </div>
          {role === 'customer' && (
            <Link
              href="/customer/requests/new"
              onClick={() => setMobileOpen(false)}
              className="mt-2.5 w-full py-1.5 px-2.5 bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <PackagePlus className="w-3.5 h-3.5" /> Book Repair
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Action Button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              setMobileOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Footer Info & Developer Attributions */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 bg-slate-950/40">
          <div className="flex items-center justify-between text-slate-400 font-medium mb-1">
            <span>v1.0 • APAC (IST)</span>
            <span className="text-teal-400">Mock REST</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            Dev Intern: <span className="text-slate-300">Kishore R</span>
          </p>
        </div>
      </aside>
    </>
  );
}
