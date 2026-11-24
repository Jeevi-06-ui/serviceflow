'use client';

import React, { useState, useEffect } from 'react';
import { Repository } from '@/lib/api/repository';
import { Customer } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { formatIndianDate } from '@/lib/utils/dates';
import { Users, Phone, Mail, MapPin } from 'lucide-react';

export default function CenterCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(Repository.customers.getAll());
  }, []);

  const columns: Column<Customer>[] = [
    {
      header: 'Customer Name',
      key: 'name',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-bold text-xs text-slate-900">{c.name}</div>
          <div className="text-[11px] text-slate-500 font-mono">ID: {c.id}</div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      key: 'phone',
      render: (c) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Mail className="w-3 h-3 text-slate-400" /> {c.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Address / City',
      key: 'address',
      render: (c) => (
        <div className="text-xs text-slate-700 max-w-xs truncate">
          <div className="font-medium text-slate-900">{c.address.city}, {c.address.state}</div>
          <div className="text-[11px] text-slate-400 truncate">{c.address.street}</div>
        </div>
      ),
    },
    {
      header: 'Member Since',
      key: 'registeredAt',
      sortable: true,
      render: (c) => <span className="text-xs text-slate-600">{formatIndianDate(c.registeredAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-slate-500">Registered customers and service contact information</p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customer by name or phone..."
      />
    </div>
  );
}
