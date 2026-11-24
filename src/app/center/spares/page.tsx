'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';
import { SparePart } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { formatINR } from '@/lib/utils/dates';
import { Layers, AlertTriangle, Plus, Minus } from 'lucide-react';

export default function CenterSparesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const centerId = user.centerId || 'center-blr-1';

  const [spares, setSpares] = useState<SparePart[]>([]);

  const loadData = () => {
    setSpares(Repository.spares.getAll(centerId));
  };

  useEffect(() => {
    loadData();
  }, [centerId]);

  const handleAdjustStock = (spareId: string, delta: number) => {
    try {
      Repository.spares.adjustQuantity(spareId, delta);
      toast.success(delta > 0 ? 'Stock incremented.' : 'Stock allocated to repair.');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error updating stock.');
    }
  };

  const columns: Column<SparePart>[] = [
    {
      header: 'Part Number',
      key: 'partNumber',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-900">{s.partNumber}</span>
          <div className="text-[11px] text-slate-400">{s.location || 'Warehouse Bin'}</div>
        </div>
      ),
    },
    {
      header: 'Component Name',
      key: 'name',
      sortable: true,
      render: (s) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800">{s.name}</div>
          <div className="text-[11px] text-slate-500">{s.category}</div>
        </div>
      ),
    },
    {
      header: 'Unit Cost',
      key: 'unitCostInr',
      sortable: true,
      render: (s) => <span className="text-xs font-semibold text-slate-700">{formatINR(s.unitCostInr)}</span>,
    },
    {
      header: 'Stock Level',
      key: 'quantityInStock',
      sortable: true,
      render: (s) => {
        const isLow = s.quantityInStock <= s.minThreshold;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isLow
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {s.quantityInStock} in stock
            </span>
            {isLow && (
              <span className="text-[10px] text-red-600 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Min: {s.minThreshold}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Stock Adjustment (Non-Negative Rule)',
      key: 'id',
      render: (s) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleAdjustStock(s.id, -1)}
            disabled={s.quantityInStock <= 0}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Decrement stock (Consume 1 unit)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleAdjustStock(s.id, 1)}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Increment stock (Restock 1 unit)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Spare Parts Inventory & Thresholds</h1>
        <p className="text-xs text-slate-500">Track spare part availability, prevent negative stock allocations, and manage reorders</p>
      </div>

      <DataTable
        columns={columns}
        data={spares}
        searchKey="name"
        searchPlaceholder="Search parts by name or part number..."
      />
    </div>
  );
}
