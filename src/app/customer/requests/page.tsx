'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate } from '@/lib/utils/dates';
import { Plus, ArrowRight, Wrench } from 'lucide-react';

export default function CustomerRequestsPage() {
  const { user } = useAuth();
  const customerId = user.customerId || 'cust-1';

  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setRequests(Repository.requests.getAll({ customerId }));
  }, [customerId]);

  const columns: Column<ServiceRequest>[] = [
    {
      header: 'Ticket ID',
      key: 'ticketNumber',
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-900">{r.ticketNumber}</span>
          <div className="text-[11px] text-slate-500">{formatIndianDate(r.createdAt)}</div>
        </div>
      ),
    },
    {
      header: 'Appliance & Issue',
      key: 'productName',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-bold text-xs text-slate-900">{r.productName}</div>
          <div className="text-[11px] text-slate-500 font-medium">Issue: {r.issueCategory}</div>
        </div>
      ),
    },
    {
      header: 'Severity',
      key: 'severity',
      render: (r) => <StatusBadge status={r.severity} type="severity" />,
    },
    {
      header: 'Workflow Status',
      key: 'status',
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Assigned Tech',
      key: 'technicianName',
      render: (r) => (
        <span className="text-xs text-slate-700">
          {r.technicianName ? (
            <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">{r.technicianName}</span>
          ) : (
            <span className="text-slate-400">Triage pending</span>
          )}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'id',
      render: (r) => (
        <Link
          href={`/customer/requests/${r.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Service & Repair Requests</h1>
          <p className="text-xs text-slate-500">Track real-time diagnostics, technician appointments, and estimate decisions</p>
        </div>

        <Link
          href="/customer/requests/new"
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Book New Repair
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        searchKey="ticketNumber"
        searchPlaceholder="Search by Ticket ID or appliance..."
      />
    </div>
  );
}
