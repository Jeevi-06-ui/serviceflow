'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate } from '@/lib/utils/dates';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TechnicianHistoryPage() {
  const { user } = useAuth();
  const technicianId = user.technicianId || 'tech-1';

  const [completedTasks, setCompletedTasks] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    const all = Repository.requests.getAll({ technicianId });
    setCompletedTasks(all.filter((t) => t.status === 'Completed' || t.status === 'Closed'));
  }, [technicianId]);

  const columns: Column<ServiceRequest>[] = [
    {
      header: 'Ticket ID',
      key: 'ticketNumber',
      sortable: true,
      render: (t) => <span className="font-mono font-bold text-xs text-slate-900">{t.ticketNumber}</span>,
    },
    {
      header: 'Appliance Model',
      key: 'productName',
      sortable: true,
      render: (t) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{t.productName}</div>
          <div className="text-[11px] text-slate-500">{t.issueCategory}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      key: 'customerName',
      render: (t) => <span className="text-xs text-slate-800">{t.customerName}</span>,
    },
    {
      header: 'Completed Date',
      key: 'completedAt',
      sortable: true,
      render: (t) => <span className="text-xs text-slate-600">{formatIndianDate(t.completedAt || t.updatedAt)}</span>,
    },
    {
      header: 'Customer CSAT',
      key: 'feedbackRating',
      render: (t) => (
        t.feedbackRating ? (
          <span className="text-xs font-bold text-amber-600">★ {t.feedbackRating}.0</span>
        ) : (
          <span className="text-slate-400 text-xs">No rating</span>
        )
      ),
    },
    {
      header: 'Action',
      key: 'id',
      render: (t) => (
        <Link
          href={`/technician/tasks/${t.id}`}
          className="text-xs font-semibold text-teal-600 hover:underline"
        >
          View &rarr;
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Completed Repairs Log</h1>
        <p className="text-xs text-slate-500">Historical record of resolved service requests and customer ratings</p>
      </div>

      <DataTable
        columns={columns}
        data={completedTasks}
        searchKey="ticketNumber"
        searchPlaceholder="Search completed repairs..."
      />
    </div>
  );
}
