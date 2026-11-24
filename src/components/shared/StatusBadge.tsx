import React from 'react';
import { TicketStatus, WarrantyStatus, TicketSeverity } from '@/types';

interface StatusBadgeProps {
  status: TicketStatus | WarrantyStatus | TicketSeverity | string;
  type?: 'ticket' | 'warranty' | 'severity';
  className?: string;
}

export function StatusBadge({ status, type = 'ticket', className = '' }: StatusBadgeProps) {
  // Styles for 11 ticket workflow statuses
  const ticketStyles: Record<TicketStatus, { bg: string; text: string; dot: string }> = {
    Submitted: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
    'Under Review': { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    Assigned: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500' },
    Scheduled: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    'In Progress': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Awaiting Parts': { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
    'Awaiting Approval': { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    'Quality Check': { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700', dot: 'bg-teal-500' },
    Completed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Closed: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400' },
    Cancelled: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  };

  // Styles for Warranty statuses
  const warrantyStyles: Record<WarrantyStatus, { bg: string; text: string; dot: string }> = {
    Active: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Expiring Soon': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    Expired: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
    Void: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
    'Not Yet Active': { bg: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  };

  // Styles for Severity
  const severityStyles: Record<TicketSeverity, { bg: string; text: string; dot: string }> = {
    Low: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400' },
    Medium: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    High: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    Critical: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-600' },
  };

  let chosenStyle = { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400' };

  if (type === 'warranty' && status in warrantyStyles) {
    chosenStyle = warrantyStyles[status as WarrantyStatus];
  } else if (type === 'severity' && status in severityStyles) {
    chosenStyle = severityStyles[status as TicketSeverity];
  } else if (status in ticketStyles) {
    chosenStyle = ticketStyles[status as TicketStatus];
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${chosenStyle.bg} ${chosenStyle.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${chosenStyle.dot}`} />
      {status}
    </span>
  );
}
