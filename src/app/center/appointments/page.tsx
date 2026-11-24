'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Appointment } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { formatIndianDate } from '@/lib/utils/dates';
import { Calendar, Clock, UserCheck, ArrowRight } from 'lucide-react';

export default function CenterAppointmentsPage() {
  const { user } = useAuth();
  const centerId = user.centerId || 'center-blr-1';

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setAppointments(Repository.appointments.getAll({ centerId }));
  }, [centerId]);

  const columns: Column<Appointment>[] = [
    {
      header: 'Ticket ID',
      key: 'ticketNumber',
      sortable: true,
      render: (a) => <span className="font-mono font-bold text-xs text-slate-900">{a.ticketNumber}</span>,
    },
    {
      header: 'Date & Time Slot',
      key: 'scheduledDate',
      sortable: true,
      render: (a) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{formatIndianDate(a.scheduledDate)}</div>
          <div className="text-[11px] text-slate-500">{a.timeSlot}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Specialist',
      key: 'technicianName',
      sortable: true,
      render: (a) => <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">{a.technicianName}</span>,
    },
    {
      header: 'Customer & Address',
      key: 'customerName',
      render: (a) => (
        <div className="text-xs max-w-xs truncate">
          <div className="font-semibold text-slate-800">{a.customerName} ({a.customerPhone})</div>
          <div className="text-[11px] text-slate-400 truncate">{a.customerAddress}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (a) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            a.status === 'Completed'
              ? 'bg-emerald-50 text-emerald-700'
              : a.status === 'Cancelled'
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          {a.status}
        </span>
      ),
    },
    {
      header: 'Action',
      key: 'id',
      render: (a) => (
        <Link
          href={`/center/requests/${a.serviceRequestId}`}
          className="text-xs font-semibold text-teal-600 hover:underline"
        >
          Manage &rarr;
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Center Dispatch & Appointment Schedule</h1>
        <p className="text-xs text-slate-500">Doorstep repair appointments scheduled across center field staff</p>
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        searchKey="customerName"
        searchPlaceholder="Search by customer, ticket, or technician..."
      />
    </div>
  );
}
