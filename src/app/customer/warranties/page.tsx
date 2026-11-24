'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Warranty, Product } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { WarrantyCardModal } from '@/components/shared/WarrantyCardModal';
import { formatIndianDate, formatINR } from '@/lib/utils/dates';
import { calculateWarrantyStatus } from '@/lib/utils/warranty';
import { ShieldCheck, Calendar, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export default function CustomerWarrantiesPage() {
  const { user } = useAuth();
  const customerId = user.customerId || 'cust-1';

  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Interactive Date Evaluator
  const [evaluationDate, setEvaluationDate] = useState('2026-11-24');

  useEffect(() => {
    setWarranties(Repository.warranties.getAll(customerId));
    setProducts(Repository.products.getAll(customerId));
  }, [customerId]);

  const handleOpenCertificate = (war: Warranty) => {
    const prod = products.find((p) => p.id === war.productId);
    if (prod) {
      setSelectedWarranty(war);
      setSelectedProduct(prod);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Digital Warranties & Policies</h1>
          <p className="text-xs text-slate-500">Live coverage breakdown and digital certificates for your registered appliances</p>
        </div>

        {/* Date Validity Simulation Box */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-slate-700">Evaluate Validity On:</span>
          <input
            type="date"
            value={evaluationDate}
            onChange={(e) => setEvaluationDate(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-800"
          />
        </div>
      </div>

      {/* Warranties Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {warranties.map((war) => {
          const prod = products.find((p) => p.id === war.productId);
          // Evaluate dynamically based on selected date
          const calc = calculateWarrantyStatus(
            war.startDate,
            war.endDate,
            new Date(evaluationDate)
          );

          return (
            <div
              key={war.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle hover:shadow-card transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                    {war.policyNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {prod?.modelName || 'Home Appliance'}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {prod?.brand} • SN: <span className="font-mono text-slate-700">{prod?.serialNumber}</span>
                  </div>
                </div>

                <StatusBadge status={calc.status} type="warranty" />
              </div>

              {/* Progress & Validity bar */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Coverage Progress:</span>
                  <span className="font-medium">{calc.percentElapsed}% elapsed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      calc.status === 'Active'
                        ? 'bg-teal-500'
                        : calc.status === 'Expiring Soon'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${calc.percentElapsed}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Start: {formatIndianDate(war.startDate)}</span>
                  <span>End: {formatIndianDate(war.endDate)}</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Coverage Level:</span>
                  <span className="font-semibold text-slate-800">{war.coverageType} Protection</span>
                </div>
                <div className="flex justify-between">
                  <span>Claim Limit:</span>
                  <span className="font-semibold text-slate-800">{formatINR(war.claimLimitInr)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Doorstep Service:</span>
                  <span className={`font-semibold ${calc.isEligibleForFreeService ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {calc.isEligibleForFreeService ? 'Eligible' : 'Out of Warranty (Paid)'}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleOpenCertificate(war)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Digital Certificate
                </button>

                {prod && (
                  <Link
                    href={`/customer/requests/new?productId=${prod.id}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    Book Repair &rarr;
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProduct && selectedWarranty && (
        <WarrantyCardModal
          product={selectedProduct}
          warranty={selectedWarranty}
          customerName={user.name}
          onClose={() => {
            setSelectedWarranty(null);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
