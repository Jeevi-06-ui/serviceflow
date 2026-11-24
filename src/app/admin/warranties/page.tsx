'use client';

import React, { useState, useEffect } from 'react';
import { Repository } from '@/lib/api/repository';
import { Warranty } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate, formatINR } from '@/lib/utils/dates';
import { FileCheck2 } from 'lucide-react';

export default function AdminWarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  useEffect(() => {
    setWarranties(Repository.warranties.getAll());
  }, []);

  const columns: Column<Warranty>[] = [
    {
      header: 'Policy Number',
      key: 'policyNumber',
      sortable: true,
      render: (w) => <span className="font-mono font-bold text-xs text-slate-900">{w.policyNumber}</span>,
    },
    {
      header: 'Coverage Tier',
      key: 'coverageType',
      sortable: true,
      render: (w) => <span className="text-xs font-semibold text-slate-800">{w.coverageType}</span>,
    },
    {
      header: 'Effective Period',
      key: 'startDate',
      sortable: true,
      render: (w) => (
        <span className="text-xs text-slate-600">
          {formatIndianDate(w.startDate)} &rarr; {formatIndianDate(w.endDate)}
        </span>
      ),
    },
    {
      header: 'Claim Liability Limit',
      key: 'claimLimitInr',
      sortable: true,
      render: (w) => <span className="text-xs font-semibold text-slate-900">{formatINR(w.claimLimitInr)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (w) => <StatusBadge status={w.status} type="warranty" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Warranty Policy Master Registry</h1>
        <p className="text-xs text-slate-500">Universal ledger of active, expiring, and expired manufacturer warranty policies</p>
      </div>

      <DataTable
        columns={columns}
        data={warranties}
        searchKey="policyNumber"
        searchPlaceholder="Search warranty by policy number..."
      />
    </div>
  );
}
