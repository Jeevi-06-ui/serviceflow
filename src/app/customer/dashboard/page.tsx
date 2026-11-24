'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Product, Warranty, ServiceRequest } from '@/types';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate, formatIndianDateTime } from '@/lib/utils/dates';
import {
  Tv,
  FileCheck2,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Plus,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const customerId = user.customerId || 'cust-1';

  const [products, setProducts] = useState<Product[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setProducts(Repository.products.getAll(customerId));
    setWarranties(Repository.warranties.getAll(customerId));
    setRequests(Repository.requests.getAll({ customerId }));
  }, [customerId]);

  const activeWarranties = warranties.filter((w) => w.status === 'Active' || w.status === 'Expiring Soon');
  const pendingRequests = requests.filter((r) => !['Completed', 'Closed', 'Cancelled'].includes(r.status));
  const completedRequests = requests.filter((r) => r.status === 'Completed' || r.status === 'Closed');

  const expiringSoon = warranties.filter((w) => w.status === 'Expiring Soon');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-400 tracking-wider uppercase">
            Customer Self-Service Hub
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">Welcome back, {user.name}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Track warranty status for your registered home electronics, schedule certified doorstep repair appointments, and review itemized estimates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/customer/products/new"
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Register Appliance
          </Link>
          <Link
            href="/customer/requests/new"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" /> Request Repair
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Registered Appliances"
          value={products.length}
          subtitle="Electronics & Home appliances"
          icon={Tv}
          variant="teal"
        />
        <KPICard
          title="Active Warranties"
          value={activeWarranties.length}
          subtitle={`${expiringSoon.length} expiring within 30 days`}
          icon={FileCheck2}
          variant="emerald"
        />
        <KPICard
          title="Active Service Tickets"
          value={pendingRequests.length}
          subtitle="Diagnostics & repairs in progress"
          icon={Wrench}
          variant="amber"
        />
        <KPICard
          title="Completed Repairs"
          value={completedRequests.length}
          subtitle="Verified & closed tickets"
          icon={CheckCircle2}
          variant="blue"
        />
      </div>

      {/* Expiring Soon Banner Alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs flex-1">
            <span className="font-bold text-amber-900">Warranty Expiring Soon: </span>
            <span className="text-amber-800">
              You have {expiringSoon.length} policy nearing expiry. Schedule preventative servicing before coverage expires.
            </span>
          </div>
          <Link
            href="/customer/warranties"
            className="text-xs font-semibold text-amber-900 hover:underline shrink-0"
          >
            View Warranties &rarr;
          </Link>
        </div>
      )}

      {/* 2-Column Section: Active Requests & Registered Appliances */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Current Service Requests</h2>
              <p className="text-xs text-slate-500">Live status of your repair requests</p>
            </div>
            <Link
              href="/customer/requests"
              className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No active repair tickets. All appliances operational.</div>
            ) : (
              pendingRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/customer/requests/${req.id}`}
                  className="block p-3.5 rounded-lg border border-slate-200 hover:border-teal-500/50 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{req.ticketNumber}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-1">{req.productName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{req.description}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-500 shrink-0">
                      <div>{formatIndianDate(req.createdAt)}</div>
                      {req.technicianName && (
                        <div className="text-teal-700 font-medium mt-1">Tech: {req.technicianName}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Registered Appliances */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Your Appliances & Devices</h2>
              <p className="text-xs text-slate-500">{products.length} registered units</p>
            </div>
            <Link
              href="/customer/products"
              className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p) => {
              const warranty = warranties.find((w) => w.productId === p.id);
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{p.modelName}</span>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {p.brand} • SN: <span className="font-mono text-slate-700">{p.serialNumber}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {warranty ? (
                      <StatusBadge status={warranty.status} type="warranty" />
                    ) : (
                      <span className="text-slate-400">No warranty</span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1">
                      Purchased: {formatIndianDate(p.purchaseDate)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
