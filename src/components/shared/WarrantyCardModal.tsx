'use client';

import React from 'react';
import { Warranty, Product } from '@/types';
import { formatIndianDate, formatINR } from '@/lib/utils/dates';
import { X, Printer, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

interface WarrantyCardModalProps {
  warranty: Warranty;
  product: Product;
  customerName: string;
  onClose: () => void;
}

export function WarrantyCardModal({ warranty, product, customerName, onClose }: WarrantyCardModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-teal-700">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Official Digital Warranty Certificate</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-8 space-y-6 print:p-0">
          {/* Certificate Badge & Seal */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Jeevix Technologies • ServiceFlow
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Certificate of Product Warranty
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Policy Reference: <span className="font-mono font-semibold text-slate-800">{warranty.policyNumber}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> {warranty.status.toUpperCase()}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">ID: {warranty.id}</p>
            </div>
          </div>

          {/* Certificate 2-Column Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Left: Product Information */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5">
                Product Details
              </div>
              <div>
                <span className="text-slate-500">Model Name:</span>
                <div className="font-semibold text-slate-800">{product.modelName}</div>
              </div>
              <div>
                <span className="text-slate-500">Brand & Category:</span>
                <div className="font-semibold text-slate-800">
                  {product.brand} • {product.category}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Serial Number:</span>
                <div className="font-mono font-semibold text-slate-800">{product.serialNumber}</div>
              </div>
              <div>
                <span className="text-slate-500">Authorized Seller:</span>
                <div className="font-semibold text-slate-800">{product.seller}</div>
              </div>
            </div>

            {/* Right: Coverage & Customer Information */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5">
                Coverage Details
              </div>
              <div>
                <span className="text-slate-500">Registered Beneficiary:</span>
                <div className="font-semibold text-slate-800">{customerName}</div>
              </div>
              <div>
                <span className="text-slate-500">Coverage Type:</span>
                <div className="font-semibold text-slate-800">{warranty.coverageType} Protection</div>
              </div>
              <div>
                <span className="text-slate-500">Effective Period:</span>
                <div className="font-semibold text-slate-800">
                  {formatIndianDate(warranty.startDate)} &rarr; {formatIndianDate(warranty.endDate)}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Maximum Claim Liability:</span>
                <div className="font-semibold text-slate-800">{formatINR(warranty.claimLimitInr)}</div>
              </div>
            </div>
          </div>

          {/* Policy Terms Summary */}
          <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 text-xs text-slate-700">
            <div className="font-bold text-teal-900 mb-1">Coverage Inclusions & Guarantee Terms:</div>
            <p className="leading-relaxed">
              {warranty.termsSummary ||
                'This warranty covers manufacturing defects, internal component failures, and certified labor across authorized ServiceFlow centers.'}
            </p>
          </div>

          {/* Verification Barcode & Verification Seal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <QrCode className="w-10 h-10 text-slate-700" />
              <div>
                <div className="font-mono text-[11px] font-semibold text-slate-800">
                  VERIFIED DIGITAL ASSET
                </div>
                <div className="text-[10px] text-slate-400">Scan at any ServiceFlow center for instant claim verification</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400">Jeevix Authorized Warranty Seal</div>
              <div className="text-xs font-bold text-slate-800">Bengaluru, Karnataka</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
