'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest, ServiceEvent, TicketStatus } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ServiceTimeline } from '@/components/shared/ServiceTimeline';
import { formatIndianDate, formatIndianDateTime } from '@/lib/utils/dates';
import {
  ArrowLeft,
  Wrench,
  CheckCircle2,
  Layers,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function TechnicianTaskDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { user } = useAuth();
  const toast = useToast();

  const [task, setTask] = useState<ServiceRequest | null>(null);
  const [events, setEvents] = useState<ServiceEvent[]>([]);
  const [diagnosticNotes, setDiagnosticNotes] = useState('');

  const loadData = () => {
    const t = Repository.requests.getById(id);
    if (t) {
      setTask({ ...t });
      setEvents(Repository.events.getByRequestId(t.id));
      if (t.diagnosticNotes) setDiagnosticNotes(t.diagnosticNotes);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!task) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Task not found.{' '}
        <Link href="/technician/tasks" className="text-teal-600 font-bold hover:underline">
          Return to list
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = (targetStatus: TicketStatus) => {
    if (!diagnosticNotes.trim()) {
      toast.error('Required: Diagnostic findings must be provided before updating task state.');
      return;
    }

    try {
      Repository.requests.updateStatus(
        task.id,
        targetStatus,
        { id: user.id, name: user.name, role: user.role },
        diagnosticNotes.trim()
      );
      toast.success(`Task progressed to ${targetStatus}!`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Cannot perform transition.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/technician/tasks"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{task.ticketNumber}</h1>
              <StatusBadge status={task.status} />
              <StatusBadge status={task.severity} type="severity" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Assigned to: {task.technicianName} • Customer: {task.customerName}</p>
          </div>
        </div>

        {/* Technician Quick Stage Advancement */}
        <div className="flex items-center gap-2">
          {task.status === 'Scheduled' && (
            <button
              onClick={() => handleUpdateStatus('In Progress')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" /> Begin Diagnosis (In Progress)
            </button>
          )}

          {task.status === 'In Progress' && (
            <>
              <button
                onClick={() => handleUpdateStatus('Awaiting Parts')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" /> Request Spares
              </button>
              <button
                onClick={() => handleUpdateStatus('Quality Check')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready for QA
              </button>
            </>
          )}

          {task.status === 'Awaiting Parts' && (
            <button
              onClick={() => handleUpdateStatus('In Progress')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" /> Spares Received &rarr; Resume Repair
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnostic Entry Form */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Field Diagnostics & Workmanship Report
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diagnostic Findings & Root Cause Analysis (Required for stage transition)
              </label>
              <textarea
                rows={4}
                value={diagnosticNotes}
                onChange={(e) => setDiagnosticNotes(e.target.value)}
                placeholder="Document technical observations (e.g. PCB burn mark, inverter compressor resistance test, components replaced)..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Logged securely in the permanent customer audit timeline.
              </span>
            </div>
          </div>

          {/* Customer & Appliance Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Job Dispatch Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Customer Name & Phone:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{task.customerName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{task.customerPhone}</div>
              </div>

              <div>
                <span className="text-slate-500">Appliance Model:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{task.productName}</div>
                <div className="text-slate-500 font-mono text-[11px]">SN: {task.serialNumber}</div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-500">Reported Problem Description:</span>
              <p className="mt-1 text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Task Event History</h2>
              <p className="text-xs text-slate-500">Chronological history</p>
            </div>
            <ServiceTimeline events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
