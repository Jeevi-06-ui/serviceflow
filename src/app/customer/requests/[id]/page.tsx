'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';
import { ServiceRequest, Estimate, ServiceEvent } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ServiceTimeline } from '@/components/shared/ServiceTimeline';
import { EstimateModal } from '@/components/shared/EstimateModal';
import { FeedbackModal } from '@/components/shared/FeedbackModal';
import { formatIndianDate, formatIndianDateTime, formatINR } from '@/lib/utils/dates';
import {
  ArrowLeft,
  Calendar,
  Clock,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Star,
  AlertCircle,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerRequestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { user } = useAuth();
  const toast = useToast();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [events, setEvents] = useState<ServiceEvent[]>([]);

  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

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
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!request) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Ticket not found.{' '}
        <Link href="/customer/requests" className="text-teal-600 font-bold hover:underline">
          Return to list
        </Link>
      </div>
    );
  }

  const handleEstimateDecision = (decision: 'Approved' | 'Rejected', reason?: string) => {
    if (!estimate) return;
    try {
      Repository.estimates.recordDecision(estimate.id, decision, reason, {
        id: user.id,
        name: user.name,
        role: user.role,
      });
      toast.success(decision === 'Approved' ? 'Estimate approved! Repair authorized to proceed.' : 'Estimate declined.');
      setShowEstimateModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error recording decision.');
    }
  };

  const handleFeedbackSubmit = (feedbackData: {
    rating: number;
    comment: string;
    resolutionSatisfaction: number;
    timelyArrivalSatisfaction: number;
  }) => {
    try {
      Repository.feedback.create({
        serviceRequestId: request.id,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        resolutionSatisfaction: feedbackData.resolutionSatisfaction,
        timelyArrivalSatisfaction: feedbackData.timelyArrivalSatisfaction,
        actor: { id: user.id, name: user.name },
      });
      toast.success('Thank you for rating your service experience! Ticket is now officially Closed.');
      setShowFeedbackModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback.');
    }
  };

  const handleCancelTicket = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Repository.requests.updateStatus(
        request.id,
        'Cancelled',
        { id: user.id, name: user.name, role: user.role },
        undefined,
        cancelReason || 'Cancelled by customer'
      );
      toast.success('Service request has been cancelled.');
      setShowCancelModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Cannot cancel ticket at this stage.');
    }
  };

  const canCancel = ['Submitted', 'Under Review', 'Assigned', 'Scheduled', 'Awaiting Approval'].includes(
    request.status
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/customer/requests"
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
            <p className="text-xs text-slate-500 mt-0.5">Created on {formatIndianDateTime(request.createdAt)}</p>
          </div>
        </div>

        {/* Quick Contextual Actions */}
        <div className="flex items-center gap-2">
          {request.status === 'Awaiting Approval' && estimate && (
            <button
              onClick={() => setShowEstimateModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm flex items-center gap-1.5 animate-pulse"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Review Estimate ({formatINR(estimate.totalInr)})
            </button>
          )}

          {request.status === 'Completed' && !request.hasFeedback && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" /> Rate Service (1-5 Stars)
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Ban className="w-3.5 h-3.5" /> Cancel Request
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Details on Left, Audit Timeline on Right */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Ticket Summary & Appliance Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Service Request Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Appliance Model:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{request.productName}</div>
                <div className="text-slate-400 font-mono text-[11px]">SN: {request.serialNumber}</div>
              </div>

              <div>
                <span className="text-slate-500">Issue Category:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{request.issueCategory}</div>
              </div>

              <div>
                <span className="text-slate-500">Assigned Service Center:</span>
                <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {request.centerName || 'Hub Allocation Pending'}
                </div>
              </div>

              <div>
                <span className="text-slate-500">Assigned Field Specialist:</span>
                <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  {request.technicianName || 'Awaiting assignment'}
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500">Reported Problem Description:</span>
              <p className="mt-1 text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                {request.description}
              </p>
            </div>

            {request.diagnosticNotes && (
              <div className="bg-amber-50/70 border border-amber-200/70 p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900">Technician Diagnostic Findings:</span>
                <p className="text-amber-800 leading-relaxed">{request.diagnosticNotes}</p>
              </div>
            )}

            {request.resolutionNotes && (
              <div className="bg-emerald-50/70 border border-emerald-200/70 p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-bold text-emerald-900">Repair Resolution & Quality Verification:</span>
                <p className="text-emerald-800 leading-relaxed">{request.resolutionNotes}</p>
              </div>
            )}

            {request.cancellationReason && (
              <div className="bg-red-50/70 border border-red-200/70 p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-bold text-red-900">Cancellation Reason:</span>
                <p className="text-red-800 leading-relaxed">{request.cancellationReason}</p>
              </div>
            )}
          </div>

          {/* Appointment Slot Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Appointment Schedule
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500">Requested Preferred Slot:</span>
                <div className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatIndianDate(request.preferredDate)} ({request.preferredTimeSlot})
                </div>
              </div>

              <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                <span className="text-teal-900 font-semibold">Confirmed Dispatch Schedule:</span>
                <div className="font-bold text-teal-800 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {request.scheduledDate
                    ? `${formatIndianDate(request.scheduledDate)} (${request.scheduledTimeSlot})`
                    : 'Awaiting center schedule confirmation'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Chronological Audit Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Chronological Event Timeline</h2>
              <p className="text-xs text-slate-500">Tamper-evident audit trail of state transitions</p>
            </div>

            <ServiceTimeline events={events} />
          </div>
        </div>
      </div>

      {/* Review Estimate Modal */}
      {showEstimateModal && estimate && (
        <EstimateModal
          mode="review"
          estimate={estimate}
          ticketNumber={request.ticketNumber}
          customerName={user.name}
          onClose={() => setShowEstimateModal(false)}
          onDecision={handleEstimateDecision}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          ticketNumber={request.ticketNumber}
          technicianName={request.technicianName}
          productName={request.productName}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {/* Cancel Request Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Cancel Service Request?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Please specify the cancellation reason. If the repair has progressed past diagnosis, cancellation requires center authorization.
            </p>

            <form onSubmit={handleCancelTicket} className="space-y-3">
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason (e.g. Issue resolved on own, travel scheduled)..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Keep Request
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
