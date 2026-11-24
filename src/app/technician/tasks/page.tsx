'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate } from '@/lib/utils/dates';
import { ArrowRight, Wrench } from 'lucide-react';

export default function TechnicianTasksPage() {
  const { user } = useAuth();
  const technicianId = user.technicianId || 'tech-1';

  const [tasks, setTasks] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setTasks(Repository.requests.getAll({ technicianId }));
  }, [technicianId]);

  const columns: Column<ServiceRequest>[] = [
    {
      header: 'Ticket ID',
      key: 'ticketNumber',
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-900">{t.ticketNumber}</span>
          <div className="text-[11px] text-slate-500">{formatIndianDate(t.createdAt)}</div>
        </div>
      ),
    },
    {
      header: 'Appliance Model',
      key: 'productName',
      sortable: true,
      render: (t) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{t.productName}</div>
          <div className="text-[11px] text-slate-500 font-mono">SN: {t.serialNumber}</div>
        </div>
      ),
    },
    {
      header: 'Customer Details',
      key: 'customerName',
      render: (t) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800">{t.customerName}</div>
          <div className="text-[11px] text-slate-500">{t.customerPhone}</div>
        </div>
      ),
    },
    {
      header: 'Severity',
      key: 'severity',
      sortable: true,
      render: (t) => <StatusBadge status={t.severity} type="severity" />,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (t) => (
        <Link
          href={`/technician/tasks/${t.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
        >
          Open Task Sheet <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Field Tasks</h1>
        <p className="text-xs text-slate-500">Record diagnostic findings, request spare parts, and submit repairs for Quality Control</p>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        searchKey="ticketNumber"
        searchPlaceholder="Search task by ticket or appliance..."
      />
    </div>
  );
}
