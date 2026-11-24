'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Product, Warranty } from '@/types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { WarrantyCardModal } from '@/components/shared/WarrantyCardModal';
import { formatIndianDate } from '@/lib/utils/dates';
import { Plus, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

export default function CustomerProductsPage() {
  const { user } = useAuth();
  const customerId = user.customerId || 'cust-1';

  const [products, setProducts] = useState<Product[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);

  useEffect(() => {
    setProducts(Repository.products.getAll(customerId));
    setWarranties(Repository.warranties.getAll(customerId));
  }, [customerId]);

  const openWarrantyModal = (product: Product) => {
    const war = warranties.find((w) => w.productId === product.id);
    if (war) {
      setSelectedProduct(product);
      setSelectedWarranty(war);
    }
  };

  const columns: Column<Product>[] = [
    {
      header: 'Appliance / Device',
      key: 'modelName',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-bold text-slate-900">{p.modelName}</div>
          <div className="text-[11px] text-slate-500 font-medium">{p.brand} • {p.category}</div>
        </div>
      ),
    },
    {
      header: 'Serial Number',
      key: 'serialNumber',
      render: (p) => <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{p.serialNumber}</span>,
    },
    {
      header: 'Purchase Date',
      key: 'purchaseDate',
      sortable: true,
      render: (p) => <span className="text-xs text-slate-600">{formatIndianDate(p.purchaseDate)}</span>,
    },
    {
      header: 'Seller & Invoice',
      key: 'seller',
      render: (p) => (
        <div className="text-xs">
          <div className="text-slate-800">{p.seller}</div>
          <div className="text-[11px] text-slate-400 font-mono">{p.invoiceNumber}</div>
        </div>
      ),
    },
    {
      header: 'Warranty Status',
      key: 'id',
      render: (p) => {
        const war = warranties.find((w) => w.productId === p.id);
        return war ? <StatusBadge status={war.status} type="warranty" /> : <span className="text-slate-400 text-xs">None</span>;
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (p) => {
        const war = warranties.find((w) => w.productId === p.id);
        return (
          <div className="flex items-center gap-2">
            {war && (
              <button
                onClick={() => openWarrantyModal(p)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
                title="View and print official digital warranty card"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Warranty Card
              </button>
            )}
            <Link
              href={`/customer/requests/new?productId=${p.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Book Repair
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Registered Products</h1>
          <p className="text-xs text-slate-500">Manage warranty policies, digital certificates, and service requests for your registered electronics</p>
        </div>

        <Link
          href="/customer/products/new"
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Register New Appliance
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="modelName"
        searchPlaceholder="Search by appliance name or serial..."
      />

      {selectedProduct && selectedWarranty && (
        <WarrantyCardModal
          product={selectedProduct}
          warranty={selectedWarranty}
          customerName={user.name}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedWarranty(null);
          }}
        />
      )}
    </div>
  );
}
