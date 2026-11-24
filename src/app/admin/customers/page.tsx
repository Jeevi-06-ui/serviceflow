'use client';

import React, { useState, useEffect } from 'react';
import { Repository } from '@/lib/api/repository';
import { Customer } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { formatIndianDate } from '@/lib/utils/dates';
import { Users, Archive, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<Customer | null>(null);
  const toast = useToast();

  const loadData = () => {
    setCustomers(Repository.customers.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleArchive = () => {
    if (!archiveTarget) return;
    try {
      Repository.customers.archive(archiveTarget.id);
      toast.success(`Customer ${archiveTarget.name} has been archived.`);
      setArchiveTarget(null);
      loadData();
    } catch {
      toast.error('Failed to archive customer.');
    }
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer ID',
      key: 'id',
      sortable: true,
      render: (c) => <span className="font-mono text-xs text-slate-700 font-semibold">{c.id}</span>,
    },
    {
      header: 'Name',
      key: 'name',
      sortable: true,
      render: (c) => <span className="font-bold text-xs text-slate-900">{c.name}</span>,
    },
    {
      header: 'Contact',
      key: 'phone',
      render: (c) => (
        <div className="text-xs">
          <div className="text-slate-800">{c.phone}</div>
          <div className="text-[11px] text-slate-500">{c.email}</div>
        </div>
      ),
    },
    {
      header: 'City & State',
      key: 'address',
      render: (c) => <span className="text-xs text-slate-700">{c.address.city}, {c.address.state}</span>,
    },
    {
      header: 'Registered Date',
      key: 'registeredAt',
      sortable: true,
      render: (c) => <span className="text-xs text-slate-600">{formatIndianDate(c.registeredAt)}</span>,
    },
    {
      header: 'Action',
      key: 'actions',
      render: (c) => (
        <button
          onClick={() => setArchiveTarget(c)}
          className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors flex items-center gap-1"
          title="Non-destructive deactivation (preserves historical ticket links)"
        >
          <Archive className="w-3 h-3" /> Deactivate
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Master Records</h1>
        <p className="text-xs text-slate-500">Manage registered customers, address records, and support account deactivations</p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customer by name or phone..."
      />

      <ConfirmDialog
        isOpen={!!archiveTarget}
        title="Deactivate Customer Account?"
        message={`Are you sure you want to deactivate ${archiveTarget?.name}? All historical warranties and service tickets will remain intact for audit compliance.`}
        confirmLabel="Deactivate Account"
        isDestructive
        onConfirm={handleArchive}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
