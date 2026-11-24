'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest, Appointment, Technician, SparePart } from '@/types';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate, formatIndianDateTime } from '@/lib/utils/dates';
import {
  Wrench,
  Calendar,
  AlertTriangle,
  Users,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function CenterDashboardPage() {
  const { user } = useAuth();
  const centerId = user.centerId || 'center-blr-1';

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [spares, setSpares] = useState<SparePart[]>([]);

  useEffect(() => {
    setRequests(Repository.requests.getAll({ centerId }));
    setAppointments(Repository.appointments.getAll({ centerId }));
    setTechnicians(Repository.technicians.getAll(centerId));
    setSpares(Repository.spares.getAll(centerId));
  }, [centerId]);

  const urgentTickets = requests.filter(
    (r) => (r.severity === 'Critical' || r.severity === 'High') && !['Completed', 'Closed', 'Cancelled'].includes(r.status)
  );

  const awaitingAction = requests.filter((r) => r.status === 'Submitted' || r.status === 'Under Review');
  const inProgress = requests.filter((r) => r.status === 'In Progress' || r.status === 'Awaiting Parts');
  const awaitingApproval = requests.filter((r) => r.status === 'Awaiting Approval');

  const lowStockSpares = spares.filter((s) => s.quantityInStock <= s.minThreshold);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase">
            Bengaluru Central Service Hub (BLR-01)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Operations & Dispatch Control
          </h1>
          <p className="text-xs text-slate-500">Real-time queue triage, field technician workloads, and parts availability</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/center/requests"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" /> Manage Service Queue ({requests.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Triage Queue"
          value={awaitingAction.length}
          subtitle="New requests awaiting technician dispatch"
          icon={AlertCircle}
          variant="amber"
        />
        <KPICard
          title="Active Repairs"
          value={inProgress.length}
          subtitle="Under active diagnostic / parts assembly"
          icon={Wrench}
          variant="teal"
        />
        <KPICard
          title="Today's Appointments"
          value={appointments.filter((a) => a.scheduledDate === '2026-11-25').length}
          subtitle="Scheduled doorstep visits"
          icon={Calendar}
          variant="blue"
        />
        <KPICard
          title="Available Technicians"
          value={`${technicians.filter((t) => t.status === 'Available').length}/${technicians.length}`}
          subtitle="Active on-duty field specialists"
          icon={Users}
          variant="emerald"
        />
      </div>

      {/* Urgent Warning Alerts */}
      {lowStockSpares.length > 0 && (
        <div className="bg-red-50 border border-red-200/80 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs flex-1">
            <span className="font-bold text-red-900">Inventory Alert: </span>
            <span className="text-red-800">
              {lowStockSpares.length} spare part(s) have reached minimum stock threshold. Restock required immediately.
            </span>
          </div>
          <Link href="/center/spares" className="text-xs font-semibold text-red-900 hover:underline shrink-0">
            View Spares &rarr;
          </Link>
        </div>
      )}

      {/* 2-Column Grid: Urgent Triage Queue & Technician Workload */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Urgent & High-Priority Tickets */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">High-Priority & Urgent Tickets</h2>
              <p className="text-xs text-slate-500">Requires prompt assignment and diagnostic schedule</p>
            </div>
            <Link href="/center/requests" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {urgentTickets.slice(0, 5).map((req) => (
              <Link
                key={req.id}
                href={`/center/requests/${req.id}`}
                className="block p-3.5 rounded-lg border border-slate-200 hover:border-teal-500/50 hover:bg-slate-50 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{req.ticketNumber}</span>
                      <StatusBadge status={req.severity} type="severity" />
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="font-semibold text-slate-800 mt-1">{req.productName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Customer: {req.customerName} • {req.issueCategory}
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-500 shrink-0">
                    <div>{formatIndianDate(req.createdAt)}</div>
                    {req.technicianName ? (
                      <span className="text-teal-700 font-medium">{req.technicianName}</span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Unassigned</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Technician Workload & Roster */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Center Technician Workload</h2>
              <p className="text-xs text-slate-500">{technicians.length} field specialists assigned</p>
            </div>
            <Link href="/center/technicians" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              Manage Roster <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500">Skills: {t.skills.slice(0, 2).join(', ')}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-slate-800">{t.activeTasksCount} active tasks</div>
                  <div className="text-[11px] text-teal-600 font-medium">★ {t.rating} CSAT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
