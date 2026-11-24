'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Appointment } from '@/types';
import { formatIndianDate } from '@/lib/utils/dates';
import { Calendar, Clock, MapPin, UserCheck, ArrowRight } from 'lucide-react';

export default function CustomerAppointmentsPage() {
  const { user } = useAuth();
  const customerId = user.customerId || 'cust-1';

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setAppointments(Repository.appointments.getAll({ customerId }));
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Your Service Appointments</h1>
        <p className="text-xs text-slate-500">Upcoming technician visits and historical visit logs</p>
      </div>

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No active or past appointments scheduled.
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-subtle hover:shadow-card transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Ticket #{apt.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : apt.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-teal-50 text-teal-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {formatIndianDate(apt.scheduledDate)}
                  </div>
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {apt.timeSlot}
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    Specialist: <span className="font-semibold text-slate-800 ml-1">{apt.technicianName}</span>
                  </div>
                </div>

                {apt.notes && <p className="text-[11px] text-slate-500 italic mt-1">Note: {apt.notes}</p>}
              </div>

              <Link
                href={`/customer/requests/${apt.serviceRequestId}`}
                className="px-3.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                View Ticket <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
