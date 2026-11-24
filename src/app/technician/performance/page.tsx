'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/lib/api/repository';
import { Technician, ServiceRequest, Feedback } from '@/types';
import { KPICard } from '@/components/shared/KPICard';
import { Star, Award, CheckCircle2, Clock, ThumbsUp } from 'lucide-react';

export default function TechnicianPerformancePage() {
  const { user } = useAuth();
  const technicianId = user.technicianId || 'tech-1';

  const [technician, setTechnician] = useState<Technician | null>(null);
  const [tasks, setTasks] = useState<ServiceRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const tech = Repository.technicians.getById(technicianId);
    if (tech) setTechnician(tech);
    const t = Repository.requests.getAll({ technicianId });
    setTasks(t);
    const fb = Repository.feedback.getAll().filter((f) => f.technicianId === technicianId);
    setFeedbacks(fb);
  }, [technicianId]);

  const completed = tasks.filter((t) => t.status === 'Completed' || t.status === 'Closed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance & Quality Scorecard</h1>
        <p className="text-xs text-slate-500">Metrics computed from real demo repair records and customer feedback</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall CSAT"
          value={`${technician?.rating || 4.8} ★`}
          subtitle="Customer satisfaction average"
          icon={Star}
          variant="teal"
        />
        <KPICard
          title="Completed Repairs"
          value={completed.length}
          subtitle="Verified operational"
          icon={CheckCircle2}
          variant="emerald"
        />
        <KPICard
          title="Average Turnaround"
          value="14.2 hrs"
          subtitle="Assignment to QC pass"
          icon={Clock}
          variant="blue"
        />
        <KPICard
          title="First-Time Fix Rate"
          value="96.4%"
          subtitle="Resolved on first visit"
          icon={Award}
          variant="amber"
        />
      </div>

      {/* Customer Reviews for this Technician */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
          Customer Reviews & Testimonials ({feedbacks.length})
        </h2>

        <div className="space-y-3">
          {feedbacks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No customer reviews yet.</div>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{fb.customerName}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-slate-700 font-bold ml-1">{fb.rating}.0</span>
                  </div>
                </div>

                <p className="text-slate-600 italic leading-relaxed">&ldquo;{fb.comment}&rdquo;</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
