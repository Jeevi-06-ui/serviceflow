'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Repository } from '@/lib/api/repository';
import {
  Bell,
  RefreshCw,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Wrench,
  Building2,
  User as UserIcon,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const { user, role, switchRole, resetAllDemoData } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Notifications for current role
  const notifications = Repository.notifications.getAll(role, user.customerId || user.centerId || user.technicianId);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleLabelMap: Record<UserRole, { label: string; icon: any; color: string }> = {
    customer: { label: 'Customer', icon: UserIcon, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    center: { label: 'Service Center Manager', icon: Building2, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    technician: { label: 'Field Technician', icon: Wrench, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    admin: { label: 'System Admin', icon: ShieldAlert, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  const currentRoleMeta = roleLabelMap[role];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur">
      {/* Left: Breadcrumbs & Title */}
      <div className="flex flex-col">
        {breadcrumbs && (
          <nav className="flex items-center space-x-1.5 text-xs text-slate-500">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-teal-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-700 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {title && <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>}
      </div>

      {/* Right: Actions, Role Switcher, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          title="Reset database to clean deterministic seed data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>

        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentRoleMeta.color}`}
          >
            <currentRoleMeta.icon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{currentRoleMeta.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Demo Perspective
              </div>
              {(['customer', 'center', 'technician', 'admin'] as UserRole[]).map((r) => {
                const meta = roleLabelMap[r];
                const isActive = r === role;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <meta.icon className="w-4 h-4 text-slate-500" />
                      <span>{meta.label}</span>
                    </div>
                    {isActive && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifDrawer && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications ({unreadCount} unread)</span>
                <span className="text-[11px] text-teal-600 font-medium">Role: {role}</span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No notifications.</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => Repository.notifications.markAsRead(notif.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        notif.isRead
                          ? 'bg-slate-50/50 border-slate-100 text-slate-500'
                          : 'bg-teal-50/40 border-teal-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-700">{notif.title}</span>
                      </div>
                      <p className="leading-snug text-slate-600">{notif.message}</p>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-teal-600 hover:underline"
                        >
                          View detail <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden lg:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-slate-900">{user.name}</span>
            <span className="text-[10px] text-slate-500 capitalize">{role}</span>
          </div>
        </div>
      </div>

      {/* Confirm Reset Demo Data Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              This will reset the entire local database back to Kishore R&apos;s clean deterministic seed data (20 customers,
              30 products, 4 centers, 10 technicians, 42 tickets). All mutations made during this session will be reverted.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
