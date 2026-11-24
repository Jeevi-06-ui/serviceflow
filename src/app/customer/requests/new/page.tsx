'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';
import { Product, IssueCategory, TicketSeverity } from '@/types';
import { ArrowLeft, Wrench, Calendar, Clock, Upload, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const ISSUES: IssueCategory[] = [
  'Power Failure',
  'Display / Screen',
  'Cooling Issue',
  'Mechanical Noise',
  'Water Leakage',
  'Software Glitch',
  'Hardware Damage',
  'Periodic Maintenance',
];

const TIME_SLOTS = [
  '09:30 AM - 11:30 AM',
  '11:30 AM - 01:30 PM',
  '02:00 PM - 04:00 PM',
  '04:30 PM - 06:30 PM',
];

function NewServiceRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const { user } = useAuth();
  const toast = useToast();
  const customerId = user.customerId || 'cust-1';

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('Power Failure');
  const [severity, setSeverity] = useState<TicketSeverity>('Medium');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-26');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[0]);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const list = Repository.products.getAll(customerId);
    setProducts(list);
    if (preselectedProductId) {
      setSelectedProductId(preselectedProductId);
    } else if (list.length > 0) {
      setSelectedProductId(list[0].id);
    }
  }, [customerId, preselectedProductId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) {
      toast.error('Please select an appliance or register one first.');
      return;
    }

    try {
      const createdRequest = Repository.requests.create({
        customerId,
        productId: selectedProductId,
        issueCategory,
        severity,
        description,
        preferredDate,
        preferredTimeSlot,
        simulatedAttachmentUrl: fileName ? `/attachments/${fileName}` : undefined,
      });

      toast.success(`Service ticket ${createdRequest.ticketNumber} created! Service center notified.`);
      router.push(`/customer/requests/${createdRequest.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error creating service request.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Registered Appliance</label>
          {products.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              You do not have any registered appliances yet.{' '}
              <Link href="/customer/products/new" className="font-bold underline">
                Register one here
              </Link>
            </div>
          ) : (
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.modelName} (SN: {p.serialNumber})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            >
              {ISSUES.map((issue) => (
                <option key={issue} value={issue}>
                  {issue}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Perceived Urgency / Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as TicketSeverity)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            >
              <option value="Low">Low — Minor noise or aesthetic flaw</option>
              <option value="Medium">Medium — Intermittent malfunction</option>
              <option value="High">High — Critical feature inoperable</option>
              <option value="Critical">Critical — Total power/cooling failure</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Describe the Observed Problem</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details (e.g. error code displayed on screen, unusual smoke/smell, leaking water)..."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Appointment Date</label>
            <input
              type="date"
              required
              min="2026-11-24"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Window</label>
            <select
              value={preferredTimeSlot}
              onChange={(e) => setPreferredTimeSlot(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            >
              {TIME_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulated Attachment */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Optional Fault Photo / Audio Recording (Simulated)
          </label>
          <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50/50">
            <input
              type="file"
              id="fault-file"
              accept="image/*,video/*"
              onChange={(e) => e.target.files?.[0] && setFileName(e.target.files[0].name)}
              className="hidden"
            />
            <label htmlFor="fault-file" className="cursor-pointer">
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-semibold text-teal-600 hover:underline">
                Choose photo/video
              </span>
            </label>
            {fileName && (
              <div className="mt-2 text-xs font-medium text-emerald-800 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attached: {fileName}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Link
            href="/customer/requests"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={products.length === 0}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
          >
            Submit Ticket & Book Dispatch
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewServiceRequestPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/customer/requests"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Book Doorstep Repair Service</h1>
          <p className="text-xs text-slate-500">Certified technician dispatch, warranty coverage assessment, and timeline tracking</p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border">Loading form...</div>}>
        <NewServiceRequestForm />
      </Suspense>
    </div>
  );
}
