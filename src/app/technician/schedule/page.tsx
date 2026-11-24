'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Appointment } from '@/types';
import { formatIndianDate } from '@/lib/utils/dates';
import { Calendar, Clock, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function TechnicianSchedulePage() {
  const { user } = useAuth();
  const technicianId = user.technicianId || 'tech-1';

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setAppointments(Repository.appointments.getAll({ technicianId }));
  }, [technicianId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doorstep Visit Schedule</h1>
        <p className="text-xs text-slate-500">Chronological run sheet of booked on-site repair appointments</p>
      </div>

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No appointments scheduled for your roster.
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-subtle hover:shadow-card transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono text-sm">#{apt.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800">
                    {apt.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
                  <div className="flex items-center gap-1 text-slate-800 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {formatIndianDate(apt.scheduledDate)}
                  </div>
                  <div className="flex items-center gap-1 text-slate-800 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {apt.timeSlot}
                  </div>
                </div>

                <div className="text-slate-700">
                  Customer: <span className="font-semibold text-slate-900">{apt.customerName}</span> ({apt.customerPhone})
                </div>
                <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{apt.customerAddress}</span>
                </div>
              </div>

              <Link
                href={`/technician/tasks/${apt.serviceRequestId}`}
                className="px-3.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                Open Task <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
