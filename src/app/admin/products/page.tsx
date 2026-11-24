'use client';

import React, { useState, useEffect } from 'react';
import { Repository } from '@/lib/api/repository';
import { Product } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { formatIndianDate } from '@/lib/utils/dates';
import { Tv } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(Repository.products.getAll());
  }, []);

  const columns: Column<Product>[] = [
    {
      header: 'Product ID',
      key: 'id',
      sortable: true,
      render: (p) => <span className="font-mono text-xs text-slate-700 font-semibold">{p.id}</span>,
    },
    {
      header: 'Appliance & Brand',
      key: 'modelName',
      sortable: true,
      render: (p) => (
        <div className="text-xs">
          <div className="font-bold text-slate-900">{p.modelName}</div>
          <div className="text-[11px] text-slate-500">{p.brand} • {p.category}</div>
        </div>
      ),
    },
    {
      header: 'Serial Number',
      key: 'serialNumber',
      render: (p) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">{p.serialNumber}</span>,
    },
    {
      header: 'Customer Link',
      key: 'customerName',
      render: (p) => <span className="text-xs text-slate-800 font-medium">{p.customerName || 'Registered User'}</span>,
    },
    {
      header: 'Purchase Date',
      key: 'purchaseDate',
      sortable: true,
      render: (p) => <span className="text-xs text-slate-600">{formatIndianDate(p.purchaseDate)}</span>,
    },
    {
      header: 'Authorized Dealer',
      key: 'seller',
      render: (p) => <span className="text-xs text-slate-700">{p.seller}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Master Product Catalog & Registrations</h1>
        <p className="text-xs text-slate-500">Universal registry of serial-numbered electronics and home appliances</p>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="modelName"
        searchPlaceholder="Search product by model or serial..."
      />
    </div>
  );
}
