'use client';

import React, { useState, useEffect } from 'react';
import { Repository } from '@/lib/api/repository';
import { ServiceCenter } from '@/types';
import { Building2, Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function AdminCentersPage() {
  const [centers, setCenters] = useState<ServiceCenter[]>([]);

  useEffect(() => {
    setCenters(Repository.centers.getAll());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Authorized Service Centers</h1>
        <p className="text-xs text-slate-500">Regional service hubs, operating capacities, and active coverage cities</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {centers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle hover:shadow-card transition-shadow space-y-4"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-600 uppercase">{c.code}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{c.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.city} Hub
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Operational
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              {c.address}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{c.email}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Hours: {c.operatingHours}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Active Staff: <strong className="text-slate-900">{c.activeTechniciansCount} Technicians</strong>
              </span>
              <span className="text-slate-500">
                Capacity: <strong className="text-teal-700">{c.capacityPerDay} jobs/day</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
