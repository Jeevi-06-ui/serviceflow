'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import {
  ShieldCheck,
  Wrench,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Tv,
  FileCheck2,
  Clock,
  Sparkles,
  Database,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const { switchRole } = useAuth();

  const demoRoles: {
    role: UserRole;
    title: string;
    persona: string;
    description: string;
    icon: any;
    color: string;
    path: string;
  }[] = [
    {
      role: 'customer',
      title: 'Customer Portal',
      persona: 'Priya Sharma (Bengaluru)',
      description:
        'Register appliances, verify warranty coverage, book doorstep repairs, approve itemized estimates, and rate technicians.',
      icon: Users,
      color: 'bg-emerald-500',
      path: '/customer/dashboard',
    },
    {
      role: 'center',
      title: 'Service Center Portal',
      persona: 'Rajesh Nair (Indiranagar Hub)',
      description:
        'Triage repair requests, assign certified technicians, manage appointment slots, track spares, and issue GST estimates.',
      icon: Building2,
      color: 'bg-blue-600',
      path: '/center/dashboard',
    },
    {
      role: 'technician',
      title: 'Field Technician Portal',
      persona: 'Vikram Verma (Senior Specialist)',
      description:
        'Review daily assigned run sheets, record diagnostics notes, request spare parts, and submit jobs for Quality Check.',
      icon: Wrench,
      color: 'bg-amber-500',
      path: '/technician/dashboard',
    },
    {
      role: 'admin',
      title: 'Executive Admin Portal',
      persona: 'Arun Kumar (Operations VP)',
      description:
        'Monitor pan-India KPIs, customer CSAT, center turnaround SLAs, warranty analytics, and download executive reports.',
      icon: ShieldCheck,
      color: 'bg-purple-600',
      path: '/admin/dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
            SF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide">ServiceFlow</span>
            <span className="text-[10px] text-teal-400 font-medium">Jeevix Technologies</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Demo Sign-In
          </Link>
          <a
            href="#demo-launchpad"
            className="px-4 py-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg shadow-sm transition-all"
          >
            Launch Interactive Demo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-teal-400">
          <Sparkles className="w-3.5 h-3.5" /> Frontend Engineering Internship Project • Kishore R
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Smart Warranty & After-Sales <br className="hidden sm:inline" />
          <span className="text-teal-400">Service Management System</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
          A centralized, enterprise-grade after-sales platform for electronics retailers, appliance dealers,
          manufacturers, and service centers. Experience the complete warranty and repair lifecycle across 4 operational roles.
        </p>

        {/* Quick Launchpad Grid */}
        <div id="demo-launchpad" className="pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {demoRoles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onClick={() => switchRole(item.role)}
                className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl ${item.color} text-white flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-[11px] font-semibold text-teal-400/90 mt-0.5">{item.persona}</p>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-400">
                  <span>Enter as {item.role}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature & Architecture Highlights */}
      <section className="bg-slate-950/70 py-12 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <Database className="w-4 h-4" /> Versioned LocalStorage Store
            </div>
            <p className="leading-relaxed">
              Pre-seeded with 20 Indian customers, 30 consumer appliances, 4 service hubs, 10 technicians, and 42 tickets covering all 11 workflow states.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <Clock className="w-4 h-4" /> Conflict-Free Scheduling
            </div>
            <p className="leading-relaxed">
              Strict business validation prevents overlapping technician appointments and blocks repair progression until required estimates are approved.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <FileCheck2 className="w-4 h-4" /> Digital Warranty Cards
            </div>
            <p className="leading-relaxed">
              Printable certificates with barcode verification, dynamic date validity calculations (Active, Expiring, Expired, Void), and 1-5 star CSAT feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        ServiceFlow • Jeevix Technologies Portfolio Internship • Assigned Developer: Kishore R
      </footer>
    </div>
  );
}
