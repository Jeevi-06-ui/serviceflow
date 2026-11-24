'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Technician } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Users, Star, Wrench, Phone, Mail } from 'lucide-react';

export default function CenterTechniciansPage() {
  const { user } = useAuth();
  const centerId = user.centerId || 'center-blr-1';

  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    setTechnicians(Repository.technicians.getAll(centerId));
  }, [centerId]);

  const columns: Column<Technician>[] = [
    {
      header: 'Technician Name',
      key: 'name',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            {t.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">{t.name}</div>
            <div className="text-[11px] text-slate-500">{t.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone Number',
      key: 'phone',
      render: (t) => <span className="text-xs text-slate-700 font-mono">{t.phone}</span>,
    },
    {
      header: 'Certified Skills',
      key: 'skills',
      render: (t) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {t.skills.map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Workload',
      key: 'activeTasksCount',
      sortable: true,
      render: (t) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900">{t.activeTasksCount}</span> active jobs
          <div className="text-[10px] text-slate-400">{t.completedTasksCount} completed</div>
        </div>
      ),
    },
    {
      header: 'CSAT Rating',
      key: 'rating',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{t.rating}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (t) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            t.status === 'Available'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {t.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Technician Roster & Workload</h1>
        <p className="text-xs text-slate-500">Service center technician staff, device skill specialization, and task loads</p>
      </div>

      <DataTable
        columns={columns}
        data={technicians}
        searchKey="name"
        searchPlaceholder="Search technician by name..."
      />
    </div>
  );
}
