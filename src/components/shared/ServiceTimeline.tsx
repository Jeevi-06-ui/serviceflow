import React from 'react';
import { ServiceEvent } from '@/types';
import { formatIndianDateTime } from '@/lib/utils/dates';
import { Clock, CheckCircle, ShieldCheck, UserCheck, Wrench, AlertCircle } from 'lucide-react';

interface ServiceTimelineProps {
  events: ServiceEvent[];
}

export function ServiceTimeline({ events }: ServiceTimelineProps) {
  if (!events || events.length === 0) {
    return <div className="text-sm text-slate-500 py-4">No audit events recorded yet.</div>;
  }

  const getActorBadge = (role: string) => {
    switch (role) {
      case 'customer':
        return <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-full">Customer</span>;
      case 'center':
        return <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-full">Service Center</span>;
      case 'technician':
        return <span className="px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 rounded-full">Technician</span>;
      case 'admin':
        return <span className="px-2 py-0.5 text-[11px] font-medium bg-purple-50 text-purple-700 rounded-full">System Admin</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-full">{role}</span>;
    }
  };

  const getEventIcon = (action: string) => {
    if (action.includes('Created') || action.includes('Submitted')) return <Clock className="w-4 h-4 text-purple-600" />;
    if (action.includes('Assigned')) return <UserCheck className="w-4 h-4 text-sky-600" />;
    if (action.includes('Diagnostic') || action.includes('Progress')) return <Wrench className="w-4 h-4 text-amber-600" />;
    if (action.includes('Completed') || action.includes('Approved')) return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (action.includes('Cancelled') || action.includes('Rejected')) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <ShieldCheck className="w-4 h-4 text-teal-600" />;
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {events.map((evt) => (
        <div key={evt.id} className="relative group">
          {/* Timeline node */}
          <div className="absolute -left-6 mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-teal-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
          </div>

          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                {getEventIcon(evt.action)}
                <span className="text-sm font-semibold text-slate-800">{evt.action}</span>
              </div>
              <div className="flex items-center gap-2">
                {getActorBadge(evt.actorRole)}
                <span className="text-xs text-slate-500">{formatIndianDateTime(evt.timestamp)}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600">
              By <span className="font-medium text-slate-800">{evt.actorName}</span>
              {evt.fromStatus && evt.toStatus && (
                <span className="ml-2 text-slate-500">
                  ({evt.fromStatus} &rarr; <span className="font-medium text-slate-700">{evt.toStatus}</span>)
                </span>
              )}
            </div>

            {evt.notes && (
              <p className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200/60 leading-relaxed">
                {evt.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
