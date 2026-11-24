'use client';

import React, { useState } from 'react';
import { Warranty, Product } from '@/types';
import { Repository } from '@/lib/api/repository';
import { useAuth } from '@/context/AuthContext';
import { formatINR, formatIndianDate } from '@/lib/utils/dates';
import {
  ShieldAlert,
  X,
  FileCheck2,
  CheckCircle2,
  Tv,
  UploadCloud,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WarrantyClaimModalProps {
  isOpen: boolean;
  warranty: Warranty;
  product: Product;
  onClose: () => void;
  onSuccess?: (claimId: string, ticketNum: string) => void;
}

export function WarrantyClaimModal({
  isOpen,
  warranty,
  product,
  onClose,
  onSuccess,
}: WarrantyClaimModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [issueCategory, setIssueCategory] = useState('Cooling Defect');
  const [description, setDescription] = useState('');
  const [claimedAmount, setClaimedAmount] = useState(
    Math.min(5000, warranty.claimLimitInr)
  );
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<{ claimId: string; ticketNum: string; ticketId: string } | null>(null);
  const [declaredCheck, setDeclaredCheck] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File exceeds 5MB limit. Please upload a smaller document.');
        return;
      }
      setErrorMsg('');
      setAttachedFileName(file.name);
    }
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe the defect symptoms in detail.');
      return;
    }
    if (!declaredCheck) {
      setErrorMsg('Please accept the warranty declaration before filing.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const customerId = user.customerId || 'cust-1';
      const result = Repository.claims.create({
        warrantyId: warranty.id,
        customerId,
        issueCategory,
        issueDescription: description,
        amountClaimedInr: claimedAmount,
        actor: { id: user.id, name: user.name },
      });

      setIsSubmitting(false);
      setClaimSuccess({
        claimId: result.claim.id,
        ticketNum: result.request.ticketNumber,
        ticketId: result.request.id,
      });

      if (onSuccess) {
        onSuccess(result.claim.id, result.request.ticketNumber);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to file warranty claim.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">File Official Warranty Claim</h2>
              <p className="text-[11px] text-slate-400">Zero-Deductible Repair & Replacement Processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {claimSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Warranty Claim Registered!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Your claim has been accepted under Policy <span className="font-semibold text-slate-800">{warranty.policyNumber}</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-left space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Claim Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{claimSuccess.claimId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Ticket:</span>
                  <span className="font-mono font-bold text-teal-700">{claimSuccess.ticketNum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage Status:</span>
                  <span className="font-semibold text-emerald-700">100% Covered (₹0 Deductible)</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/customer/requests/${claimSuccess.ticketId}`);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  View Service Ticket <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              {/* Policy & Appliance Snapshot */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Appliance</span>
                  <p className="font-bold text-slate-900 mt-0.5">{product.brand} {product.modelName}</p>
                  <p className="text-[11px] font-mono text-slate-500">SN: {product.serialNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Coverage Master</span>
                  <p className="font-bold text-teal-700 mt-0.5">{warranty.coverageType} Protection</p>
                  <p className="text-[11px] text-slate-500">Max Limit: {formatINR(warranty.claimLimitInr)}</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Defect Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Defect Category</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
                >
                  <option value="Cooling Defect">Cooling / Thermostat Failure</option>
                  <option value="Power Failure">Complete Power Inoperability</option>
                  <option value="Motor Vibration">Motor & Drum Abnormal Vibration</option>
                  <option value="Display Artifacts">Display / Touch Sensor Malfunction</option>
                  <option value="Water Leakage">Internal Seal & Hose Leakage</option>
                  <option value="Electronic Board">Motherboard / Inverter Error Code</option>
                </select>
              </div>

              {/* Symptoms Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Defect Description & Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred, error codes shown on display, or strange noises..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Estimated Repair Claim Amount */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Estimated Claim Value (INR)</label>
                  <span className="text-[11px] text-slate-500">Up to {formatINR(warranty.claimLimitInr)}</span>
                </div>
                <input
                  type="number"
                  min={500}
                  max={warranty.claimLimitInr}
                  value={claimedAmount}
                  onChange={(e) => setClaimedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Simulated Defect Proof Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo or Diagnostic Proof (Optional)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-xl p-3 text-center transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleSimulatedFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <UploadCloud className="w-4 h-4 text-teal-600" />
                    <span>
                      {attachedFileName ? (
                        <span className="font-semibold text-teal-700">{attachedFileName}</span>
                      ) : (
                        'Click to attach photo or invoice copy (PNG, JPG, PDF up to 5MB)'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warranty Compliance Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaredCheck}
                  onChange={(e) => setDeclaredCheck(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I certify that this appliance has not been opened by unauthorized repair technicians, subjected to accidental liquid spill, or used for non-domestic commercial applications.
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldAlert className="w-4 h-4" />
                  {isSubmitting ? 'Submitting Claim...' : 'Submit Official Claim'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
