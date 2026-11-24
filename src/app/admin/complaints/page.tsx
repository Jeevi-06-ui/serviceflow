'use client';

import React, { useState, useEffect } from 'react';
import { Repository } from '@/lib/api/repository';
import { Complaint } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { useToast } from '@/context/ToastContext';
import { formatIndianDate } from '@/lib/utils/dates';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const toast = useToast();

  const loadData = () => {
    setComplaints(Repository.complaints.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      Repository.complaints.resolve(selectedComplaint.id, resolutionNotes);
      toast.success('Complaint resolved and customer SLA closed.');
      setSelectedComplaint(null);
      setResolutionNotes('');
      loadData();
    } catch {
      toast.error('Failed to resolve complaint.');
    }
  };

  const columns: Column<Complaint>[] = [
    {
      header: 'Complaint ID',
      key: 'ticketNumber',
      sortable: true,
      render: (c) => <span className="font-mono font-bold text-xs text-slate-900">{c.ticketNumber}</span>,
    },
    {
      header: 'Customer',
      key: 'customerName',
      sortable: true,
      render: (c) => <span className="text-xs font-semibold text-slate-800">{c.customerName}</span>,
    },
    {
      header: 'Category',
      key: 'category',
      render: (c) => <span className="text-xs text-slate-700">{c.category}</span>,
    },
    {
      header: 'Priority',
      key: 'priority',
      sortable: true,
      render: (c) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            c.priority === 'High' || c.priority === 'Escalated'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {c.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (c) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            c.status === 'Resolved'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      header: 'Action',
      key: 'id',
      render: (c) => (
        c.status !== 'Resolved' ? (
          <button
            onClick={() => setSelectedComplaint(c)}
            className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
          >
            Investigate & Resolve
          </button>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Resolved</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Grievances & Escalations</h1>
        <p className="text-xs text-slate-500">Track service level agreement breaches, pricing disputes, and customer complaints</p>
      </div>

      <DataTable
        columns={columns}
        data={complaints}
        searchKey="ticketNumber"
        searchPlaceholder="Search complaint by ID or customer..."
      />

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Resolve Complaint #{selectedComplaint.ticketNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Customer: {selectedComplaint.customerName} • Category: {selectedComplaint.category}
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              <strong>Reported Grievance:</strong>
              <p className="mt-1 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Notes & Remedial Action
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail customer compensation, expedited delivery, or technician reprimand..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Mark Grievance Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
