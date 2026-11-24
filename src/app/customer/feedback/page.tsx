'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Feedback } from '@/types';
import { formatIndianDate } from '@/lib/utils/dates';
import { Star, MessageSquare } from 'lucide-react';

export default function CustomerFeedbackHistoryPage() {
  const { user } = useAuth();
  const customerId = user.customerId || 'cust-1';

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const list = Repository.feedback.getAll().filter((f) => f.customerId === customerId);
    setFeedbacks(list);
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Your Feedback & Reviews</h1>
        <p className="text-xs text-slate-500">Service ratings submitted for completed home repairs</p>
      </div>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No feedback submitted yet. Ratings unlock after a repair reaches Completed state.
          </div>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">Ticket #{fb.ticketNumber}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Serviced by <span className="font-semibold text-slate-800">{fb.technicianName}</span> at {fb.centerName}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < fb.rating ? 'fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-1.5">{fb.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                &ldquo;{fb.comment}&rdquo;
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Submitted on {formatIndianDate(fb.ratingDate)}</span>
                <span>Resolution: {fb.resolutionSatisfaction}/5 • Punctuality: {fb.timelyArrivalSatisfaction}/5</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
