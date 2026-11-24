'use client';

import React, { useState } from 'react';
import { Estimate, EstimateLine, EstimateLineType } from '@/types';
import { formatINR } from '@/lib/utils/dates';
import { X, Plus, Trash2, Calculator, Check, AlertCircle } from 'lucide-react';

interface EstimateModalProps {
  mode: 'create' | 'review';
  estimate?: Estimate;
  ticketNumber: string;
  customerName?: string;
  onClose: () => void;
  onSubmitCreate?: (lines: EstimateLine[], notes?: string) => void;
  onDecision?: (decision: 'Approved' | 'Rejected', reason?: string) => void;
}

export function EstimateModal({
  mode,
  estimate,
  ticketNumber,
  customerName,
  onClose,
  onSubmitCreate,
  onDecision,
}: EstimateModalProps) {
  // Create mode state
  const [lines, setLines] = useState<EstimateLine[]>([
    { id: '1', description: 'Diagnostic inspection & board level rework', type: 'Labor', quantity: 1, unitPriceInr: 950, amountInr: 950 },
  ]);
  const [notes, setNotes] = useState('');

  // Review mode state
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: String(Date.now()),
        description: '',
        type: 'Part',
        quantity: 1,
        unitPriceInr: 0,
        amountInr: 0,
      },
    ]);
  };

  const updateLine = (id: string, updates: Partial<EstimateLine>) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...updates };
        updated.amountInr = (updated.quantity || 1) * (updated.unitPriceInr || 0);
        return updated;
      })
    );
  };

  const removeLine = (id: string) => {
    if (lines.length === 1) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const subtotal = lines.reduce((acc, l) => acc + l.amountInr, 0);
  const gst = Math.round((subtotal * 18) / 100);
  const total = subtotal + gst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {mode === 'create' ? 'Create Repair Cost Estimate' : 'Review Repair Estimate'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Ticket #{ticketNumber} {customerName && `• ${customerName}`}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {mode === 'create' ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Itemized Line Items</span>
                  <button
                    onClick={addLine}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line
                  </button>
                </div>

                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description (e.g. PCB Module)"
                          value={line.description}
                          onChange={(e) => updateLine(line.id, { description: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={line.type}
                          onChange={(e) => updateLine(line.id, { type: e.target.value as EstimateLineType })}
                          className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded"
                        >
                          <option value="Part">Part</option>
                          <option value="Labor">Labor</option>
                          <option value="Inspection">Inspection</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => updateLine(line.id, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="₹ Unit"
                          min={0}
                          value={line.unitPriceInr || ''}
                          onChange={(e) => updateLine(line.id, { unitPriceInr: parseInt(e.target.value) || 0 })}
                          className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimate Notes / Justification</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain why parts/labor are billed (e.g. voltage surge damage not covered by warranty)..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  rows={2}
                />
              </div>

              {/* Total Calculation Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Applicable GST (18%):</span>
                  <span className="font-semibold text-slate-900">{formatINR(gst)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Due:</span>
                  <span className="text-teal-700">{formatINR(total)}</span>
                </div>
              </div>
            </>
          ) : (
            // REVIEW MODE
            estimate && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">Type</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {estimate.lines.map((l) => (
                        <tr key={l.id}>
                          <td className="p-3 font-medium text-slate-800">{l.description}</td>
                          <td className="p-3 text-slate-500">{l.type}</td>
                          <td className="p-3 text-right text-slate-600">{l.quantity}</td>
                          <td className="p-3 text-right text-slate-600">{formatINR(l.unitPriceInr)}</td>
                          <td className="p-3 text-right font-semibold text-slate-800">{formatINR(l.amountInr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-medium text-slate-800">{formatINR(estimate.subtotalInr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Goods & Services Tax (GST {estimate.gstRatePercent}%):</span>
                    <span className="font-medium text-slate-800">{formatINR(estimate.gstAmountInr)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-teal-700 font-extrabold">{formatINR(estimate.totalInr)}</span>
                  </div>
                </div>

                {estimate.notes && (
                  <p className="text-xs text-slate-600 bg-teal-50/50 border border-teal-100 p-3 rounded-lg">
                    <span className="font-bold text-teal-900">Service Center Note:</span> {estimate.notes}
                  </p>
                )}

                {showRejectForm && (
                  <div className="bg-red-50/60 border border-red-200 p-3 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-red-900">Reason for Rejection</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please specify why you decline this repair cost..."
                      className="w-full text-xs p-2 bg-white border border-red-200 rounded focus:outline-none"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>

          {mode === 'create' ? (
            <button
              onClick={() => onSubmitCreate && onSubmitCreate(lines, notes)}
              disabled={subtotal === 0}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              Issue & Send Estimate
            </button>
          ) : (
            estimate?.status === 'Pending' && (
              <>
                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg"
                  >
                    Decline Estimate
                  </button>
                ) : (
                  <button
                    onClick={() => onDecision && onDecision('Rejected', rejectionReason)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                  >
                    Confirm Rejection
                  </button>
                )}
                <button
                  onClick={() => onDecision && onDecision('Approved')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Approve & Authorize Repair
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
