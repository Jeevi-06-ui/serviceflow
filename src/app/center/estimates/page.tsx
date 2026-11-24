'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Estimate } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { formatIndianDate, formatINR } from '@/lib/utils/dates';
import { exportToCSV } from '@/lib/utils/export';
import { Download, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function CenterEstimatesPage() {
  const { user } = useAuth();
  const centerId = user.centerId || 'center-blr-1';

  const [estimates, setEstimates] = useState<Estimate[]>([]);

  useEffect(() => {
    setEstimates(Repository.estimates.getAll(centerId));
  }, [centerId]);

  const handleExport = () => {
    exportToCSV('ServiceCenter_Estimates', estimates, [
      { header: 'Estimate ID', key: 'id' },
      { header: 'Ticket Number', key: 'ticketNumber' },
      { header: 'Customer', key: 'customerName' },
      { header: 'Subtotal (INR)', key: 'subtotalInr' },
      { header: 'GST (INR)', key: 'gstAmountInr' },
      { header: 'Total (INR)', key: 'totalInr' },
      { header: 'Status', key: 'status' },
      { header: 'Created Date', key: (e) => formatIndianDate(e.createdAt) },
    ]);
  };

  const columns: Column<Estimate>[] = [
    {
      header: 'Estimate ID',
      key: 'id',
      sortable: true,
      render: (e) => <span className="font-mono font-bold text-xs text-slate-900">{e.id}</span>,
    },
    {
      header: 'Ticket ID',
      key: 'ticketNumber',
      sortable: true,
      render: (e) => (
        <Link href={`/center/requests/${e.serviceRequestId}`} className="text-xs font-semibold text-teal-600 hover:underline">
          {e.ticketNumber}
        </Link>
      ),
    },
    {
      header: 'Customer Name',
      key: 'customerName',
      render: (e) => <span className="text-xs text-slate-800 font-medium">{e.customerName || 'Customer'}</span>,
    },
    {
      header: 'Line Items',
      key: 'lines',
      render: (e) => <span className="text-xs text-slate-600">{e.lines.length} items</span>,
    },
    {
      header: 'Subtotal',
      key: 'subtotalInr',
      sortable: true,
      render: (e) => <span className="text-xs text-slate-600">{formatINR(e.subtotalInr)}</span>,
    },
    {
      header: 'GST (18%)',
      key: 'gstAmountInr',
      render: (e) => <span className="text-xs text-slate-600">{formatINR(e.gstAmountInr)}</span>,
    },
    {
      header: 'Grand Total',
      key: 'totalInr',
      sortable: true,
      render: (e) => <span className="text-xs font-bold text-slate-900">{formatINR(e.totalInr)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (e) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            e.status === 'Approved'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : e.status === 'Rejected'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {e.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Repair Cost Estimates</h1>
          <p className="text-xs text-slate-500">Itemized quotation management and customer approval decisions</p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export Estimates CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        data={estimates}
        searchKey="ticketNumber"
        searchPlaceholder="Search estimates by ticket number..."
      />
    </div>
  );
}
