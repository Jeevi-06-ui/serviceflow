'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('demo1234');

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole('customer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-10 h-10 rounded-xl bg-teal-600 text-white items-center justify-center font-black text-base shadow-md mb-3">
          SF
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to ServiceFlow</h2>
        <p className="mt-1 text-xs text-slate-500">
          Smart Warranty & After-Sales Service Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {/* One-Click Demo Role Launcher */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              One-Click Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchRole('customer')}
                className="p-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-left flex flex-col"
              >
                <span>Customer</span>
                <span className="text-[10px] text-emerald-600 font-normal">Priya Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('center')}
                className="p-2.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left flex flex-col"
              >
                <span>Service Center</span>
                <span className="text-[10px] text-blue-600 font-normal">Bengaluru Hub</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('technician')}
                className="p-2.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-left flex flex-col"
              >
                <span>Technician</span>
                <span className="text-[10px] text-amber-600 font-normal">Vikram Verma</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className="p-2.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left flex flex-col"
              >
                <span>System Admin</span>
                <span className="text-[10px] text-purple-600 font-normal">Arun Kumar</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400">or simulated login</span>
            </div>
          </div>

          {/* Simulated Login Form */}
          <form onSubmit={handleSimulatedSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-teal-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              Sign In (Demo Auth) <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-teal-600 font-semibold hover:underline">
              Create demo account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
