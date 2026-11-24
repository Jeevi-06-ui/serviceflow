'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest, Appointment } from '@/types';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate } from '@/lib/utils/dates';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Phone,
  AlertCircle,
  Star,
} from 'lucide-react';

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  const technicianId = user.technicianId || 'tech-1';

  const [tasks, setTasks] = useState<ServiceRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setTasks(Repository.requests.getAll({ technicianId }));
    setAppointments(Repository.appointments.getAll({ technicianId }));
  }, [technicianId]);

  const activeJobs = tasks.filter((t) => !['Completed', 'Closed', 'Cancelled'].includes(t.status));
  const completedJobs = tasks.filter((t) => t.status === 'Completed' || t.status === 'Closed');
  const todayApts = appointments.filter((a) => a.scheduledDate === '2026-11-25');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Field Specialist Daily Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
            Good day, {user.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Display & Electronics Specialist • 4.8 Rating • Bengaluru Indiranagar Hub
          </p>
        </div>

        <Link
          href="/technician/tasks"
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Wrench className="w-3.5 h-3.5" /> View Active Task Queue ({activeJobs.length})
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Assigned Active Tasks"
          value={activeJobs.length}
          subtitle="Diagnostics & active repairs"
          icon={Wrench}
          variant="amber"
        />
        <KPICard
          title="Today's Appointments"
          value={todayApts.length}
          subtitle="Confirmed doorstep visits"
          icon={Calendar}
          variant="blue"
        />
        <KPICard
          title="Completed Jobs"
          value={completedJobs.length}
          subtitle="Verified & quality tested"
          icon={CheckCircle2}
          variant="emerald"
        />
        <KPICard
          title="CSAT Rating"
          value="4.8 ★"
          subtitle="Customer satisfaction average"
          icon={Star}
          variant="teal"
        />
      </div>

      {/* 2-Column Grid: Today's Run Sheet & Active Assignments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule Run Sheet */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today&apos;s Run Sheet & Appointments</h2>
              <p className="text-xs text-slate-500">25 Nov 2026 visits</p>
            </div>
            <Link href="/technician/schedule" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              Full schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayApts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No appointments scheduled for today.</div>
            ) : (
              todayApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-lg border border-slate-200 text-xs space-y-2 hover:border-amber-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-mono">#{apt.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                      {apt.timeSlot}
                    </span>
                  </div>

                  <div className="text-slate-700 font-medium">Customer: {apt.customerName}</div>
                  <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{apt.customerAddress}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{apt.customerPhone}</span>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <Link
                      href={`/technician/tasks/${apt.serviceRequestId}`}
                      className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1"
                    >
                      Open Task Sheet <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Tasks Queue */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Assigned Jobs & Diagnosis</h2>
              <p className="text-xs text-slate-500">Requires diagnostics findings and QA submission</p>
            </div>
            <Link href="/technician/tasks" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeJobs.map((task) => (
              <Link
                key={task.id}
                href={`/technician/tasks/${task.id}`}
                className="block p-3.5 rounded-lg border border-slate-200 hover:border-teal-500/50 hover:bg-slate-50 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{task.ticketNumber}</span>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="font-semibold text-slate-800 mt-1">{task.productName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{task.description}</div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <StatusBadge status={task.severity} type="severity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
