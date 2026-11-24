'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest, TicketStatus, TicketSeverity } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate, formatIndianDateTime } from '@/lib/utils/dates';
import { exportToCSV } from '@/lib/utils/export';
import { Download, ArrowRight, Filter } from 'lucide-react';

export default function CenterRequestsPage() {
  const { user } = useAuth();
  const centerId = user.centerId || 'center-blr-1';

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  useEffect(() => {
    setRequests(Repository.requests.getAll({ centerId }));
  }, [centerId]);

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    exportToCSV('ServiceCenter_Requests_Report', filteredRequests, [
      { header: 'Ticket Number', key: 'ticketNumber' },
      { header: 'Customer Name', key: 'customerName' },
      { header: 'Customer Phone', key: 'customerPhone' },
      { header: 'Appliance Model', key: 'productName' },
      { header: 'Serial Number', key: 'serialNumber' },
      { header: 'Issue Category', key: 'issueCategory' },
      { header: 'Severity', key: 'severity' },
      { header: 'Current Status', key: 'status' },
      { header: 'Assigned Specialist', key: 'technicianName' },
      { header: 'Created Date', key: (r) => formatIndianDateTime(r.createdAt) },
    ]);
  };

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
      header: 'Customer',
      key: 'customerName',
      sortable: true,
      render: (r) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{r.customerName}</div>
          <div className="text-[11px] text-slate-500">{r.customerPhone}</div>
        </div>
      ),
    },
    {
      header: 'Appliance & Issue',
      key: 'productName',
      render: (r) => (
        <div className="text-xs max-w-xs truncate">
          <div className="font-semibold text-slate-800 truncate">{r.productName}</div>
          <div className="text-[11px] text-slate-500">{r.issueCategory}</div>
        </div>
      ),
    },
    {
      header: 'Severity',
      key: 'severity',
      sortable: true,
      render: (r) => <StatusBadge status={r.severity} type="severity" />,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Technician',
      key: 'technicianName',
      render: (r) =>
        r.technicianName ? (
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
            {r.technicianName}
          </span>
        ) : (
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
            Unassigned
          </span>
        ),
    },
    {
      header: 'Actions',
      key: 'id',
      render: (r) => (
        <Link
          href={`/center/requests/${r.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
        >
          Manage <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Service Center Queue</h1>
          <p className="text-xs text-slate-500">Filter, assign, diagnose, and transition service tickets across lifecycle states</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export Filtered CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="w-4 h-4 text-teal-600" /> Filter Queue:
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Parts">Awaiting Parts</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Quality Check">Quality Check</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600">Severity:</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredRequests.length}</span> tickets
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRequests}
        searchKey="ticketNumber"
        searchPlaceholder="Search by ticket ID, customer, appliance..."
      />
    </div>
  );
}
