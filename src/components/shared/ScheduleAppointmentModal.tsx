'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Repository } from '@/lib/api/repository';

interface ScheduleAppointmentModalProps {
  ticketNumber: string;
  technicianId?: string;
  technicianName?: string;
  serviceRequestId: string;
  onClose: () => void;
  onSchedule: (date: string, slot: string, notes?: string) => void;
}

const TIME_SLOTS = [
  '09:30 AM - 11:30 AM',
  '11:30 AM - 01:30 PM',
  '02:00 PM - 04:00 PM',
  '04:30 PM - 06:30 PM',
];

export function ScheduleAppointmentModal({
  ticketNumber,
  technicianId,
  technicianName,
  serviceRequestId,
  onClose,
  onSchedule,
}: ScheduleAppointmentModalProps) {
  const [date, setDate] = useState('2026-11-26');
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [conflictError, setConflictError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianId) {
      setConflictError('Please assign a technician before scheduling an appointment.');
      return;
    }

    const hasConflict = Repository.appointments.checkConflict(
      technicianId,
      date,
      slot,
      serviceRequestId
    );

    if (hasConflict) {
      setConflictError(
        `Scheduling conflict: ${technicianName} already has an active appointment on ${date} during ${slot}. Please choose a different slot.`
      );
      return;
    }

    onSchedule(date, slot, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Schedule Service Appointment</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ticket #{ticketNumber} {technicianName && `• Assigned to ${technicianName}`}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {conflictError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{conflictError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
            <input
              type="date"
              value={date}
              min="2026-11-24"
              onChange={(e) => {
                setDate(e.target.value);
                setConflictError(null);
              }}
              required
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Window</label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSlot(s);
                    setConflictError(null);
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                    slot === s
                      ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch / Location Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call customer 30 mins before arrival, security gate pass required..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              rows={2}
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
