'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest, Technician, Estimate, ServiceEvent, TicketStatus } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ServiceTimeline } from '@/components/shared/ServiceTimeline';
import { AssignTechnicianModal } from '@/components/shared/AssignTechnicianModal';
import { ScheduleAppointmentModal } from '@/components/shared/ScheduleAppointmentModal';
import { EstimateModal } from '@/components/shared/EstimateModal';
import { PERMITTED_STATUS_TRANSITIONS } from '@/lib/workflow/transition-rules';
import { formatIndianDate, formatIndianDateTime, formatINR } from '@/lib/utils/dates';
import {
  ArrowLeft,
  UserCheck,
  Calendar,
  FileSpreadsheet,
  CheckCircle,
  Wrench,
  AlertTriangle,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function CenterRequestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { user } = useAuth();
  const toast = useToast();
  const centerId = user.centerId || 'center-blr-1';

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [events, setEvents] = useState<ServiceEvent[]>([]);

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [serviceNotes, setServiceNotes] = useState('');

  const loadData = () => {
    const req = Repository.requests.getById(id);
    if (req) {
      setRequest({ ...req });
      if (req.estimateId) {
        const est = Repository.estimates.getById(req.estimateId);
        setEstimate(est ? { ...est } : null);
      }
      setEvents(Repository.events.getByRequestId(req.id));
    }
    setTechnicians(Repository.technicians.getAll(centerId));
  };

  useEffect(() => {
    loadData();
  }, [id, centerId]);

  if (!request) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Ticket not found.{' '}
        <Link href="/center/requests" className="text-teal-600 font-bold hover:underline">
          Return to queue
        </Link>
      </div>
    );
  }

  const handleStatusTransition = (targetStatus: TicketStatus) => {
    try {
      Repository.requests.updateStatus(
        request.id,
        targetStatus,
        { id: user.id, name: user.name, role: user.role },
        serviceNotes.trim() || undefined
      );
      toast.success(`Ticket status successfully transitioned to "${targetStatus}".`);
      setServiceNotes('');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Cannot perform transition.');
    }
  };

  const handleAssignTechnician = (technicianId: string) => {
    try {
      Repository.requests.assignTechnician(request.id, technicianId, centerId, {
        id: user.id,
        name: user.name,
        role: user.role,
      });
      toast.success('Technician assigned successfully!');
      setShowAssignModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error assigning technician.');
    }
  };

  const handleScheduleAppointment = (date: string, slot: string, notes?: string) => {
    try {
      Repository.requests.scheduleAppointment(request.id, date, slot, {
        id: user.id,
        name: user.name,
        role: user.role,
      }, notes);
      toast.success('Appointment scheduled and dispatch order confirmed!');
      setShowScheduleModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Scheduling conflict.');
    }
  };

  const handleCreateEstimate = (lines: any[], notes?: string) => {
    try {
      Repository.estimates.create(request.id, lines, notes, {
        id: user.id,
        name: user.name,
        role: user.role,
      });
      toast.success('Estimate generated and sent to customer for authorization!');
      setShowEstimateModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create estimate.');
    }
  };

  const allowedTransitions = PERMITTED_STATUS_TRANSITIONS[request.status] || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/center/requests"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{request.ticketNumber}</h1>
              <StatusBadge status={request.status} />
              <StatusBadge status={request.severity} type="severity" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Reported by {request.customerName} • {formatIndianDateTime(request.createdAt)}</p>
          </div>
        </div>

        {/* Operational Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            {request.technicianName ? 'Reassign Tech' : 'Assign Technician'}
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Schedule Visit
          </button>

          {!estimate && (
            <button
              onClick={() => setShowEstimateModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Create Estimate
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Progression Workflow Controller */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Service Lifecycle Control</span>
              <span className="text-xs font-normal text-slate-500">Current state: <strong className="text-slate-800">{request.status}</strong></span>
            </h2>

            {/* Allowed Transitions Buttons */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-2">Permitted Target Transitions:</span>
              {allowedTransitions.length === 0 ? (
                <div className="text-xs text-slate-400 italic">Terminal state. No further transitions permitted.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allowedTransitions.map((target) => (
                    <button
                      key={target}
                      onClick={() => handleStatusTransition(target)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <span>Move to {target}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Add Operational Transition Note</label>
              <textarea
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                placeholder="Diagnostic notes, reason for stage change, or parts required..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                rows={2}
              />
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Appliance & Customer Summary
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Customer Name & Phone:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{request.customerName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{request.customerPhone}</div>
              </div>

              <div>
                <span className="text-slate-500">Appliance Model & Category:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{request.productName}</div>
                <div className="text-slate-500 font-mono text-[11px]">SN: {request.serialNumber}</div>
              </div>

              <div>
                <span className="text-slate-500">Warranty Coverage:</span>
                <div className="mt-0.5">
                  <StatusBadge status={request.warrantyStatus || 'Active'} type="warranty" />
                </div>
              </div>

              <div>
                <span className="text-slate-500">Assigned Technician:</span>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {request.technicianName || 'Unassigned'}
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500">Customer Reported Symptom:</span>
              <p className="mt-1 text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                {request.description}
              </p>
            </div>

            {estimate && (
              <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900">Associated Repair Estimate</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${estimate.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : estimate.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {estimate.status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Total Amount (incl 18% GST):</span>
                  <span className="font-bold text-slate-900 text-sm">{formatINR(estimate.totalInr)}</span>
                </div>
                {estimate.rejectionReason && (
                  <p className="text-xs text-red-700 italic">Rejection reason: {estimate.rejectionReason}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Audit Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Service Audit Events</h2>
              <p className="text-xs text-slate-500">Automated chronological event logger</p>
            </div>
            <ServiceTimeline events={events} />
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <AssignTechnicianModal
          technicians={technicians}
          currentTechnicianId={request.technicianId}
          ticketNumber={request.ticketNumber}
          category={request.productCategory || 'Television'}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignTechnician}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleAppointmentModal
          ticketNumber={request.ticketNumber}
          technicianId={request.technicianId}
          technicianName={request.technicianName}
          serviceRequestId={request.id}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleAppointment}
        />
      )}

      {/* Estimate Modal */}
      {showEstimateModal && (
        <EstimateModal
          mode="create"
          ticketNumber={request.ticketNumber}
          customerName={request.customerName}
          onClose={() => setShowEstimateModal(false)}
          onSubmitCreate={handleCreateEstimate}
        />
      )}
    </div>
  );
}
