'use client';

import React from 'react';
import { useVoiceTour } from '@/context/VoiceTourContext';
import { TourRole } from '@/types/tour';
import {
  Headphones,
  X,
  Sparkles,
  Users,
  Building2,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Play,
} from 'lucide-react';

interface VoiceTourLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceTourLauncherModal({ isOpen, onClose }: VoiceTourLauncherModalProps) {
  const { startTour } = useVoiceTour();

  if (!isOpen) return null;

  const handleLaunch = (role: TourRole) => {
    onClose();
    startTour(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Audio Walkthrough
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">ServiceFlow Voice-Guided Tour</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
            Let our automated voice companion guide you through the entire warranty and after-sales service lifecycle.
            It will narrate key architecture decisions, switch operational roles, and demonstrate live features.
          </p>
        </div>

        {/* Tour Selection Cards */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Main Full Tour */}
          <div
            onClick={() => handleLaunch('all')}
            className="group p-4 rounded-2xl border-2 border-teal-500 bg-teal-50/30 hover:bg-teal-50/60 cursor-pointer transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                    Complete Platform Tour (All 4 Personas)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Full 9-stop walkthrough: Customer registration &rarr; Service Center dispatch &rarr; Technician diagnostics &rarr; Executive analytics.
                </p>
                <div className="text-[11px] text-teal-700 font-semibold mt-1">Duration: ~4 mins • 9 stops</div>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-teal-600 group-hover:bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-md group-hover:translate-x-1 transition-all">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
            Or Jump Directly to a Role Tour:
          </div>

          {/* Sub-tour grid */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {/* Customer Tour */}
            <div
              onClick={() => handleLaunch('customer')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Users className="w-4 h-4" />
                <span>Customer Self-Service Guide</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Appliance registration, digital warranty card download, repair booking, and estimate authorization.
              </p>
            </div>

            {/* Service Center Tour */}
            <div
              onClick={() => handleLaunch('center')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <Building2 className="w-4 h-4" />
                <span>Service Center Dispatch Guide</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Queue triage, conflict-checked scheduling, 18% GST estimate generator, and spare parts inventory.
              </p>
            </div>

            {/* Field Technician Tour */}
            <div
              onClick={() => handleLaunch('technician')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <Wrench className="w-4 h-4" />
                <span>Field Technician Run Sheet</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Daily schedule calendar, mandatory diagnostic logs, spare part requests, and Quality Control sign-off.
              </p>
            </div>

            {/* Admin Tour */}
            <div
              onClick={() => handleLaunch('admin')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/30 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2 text-purple-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Operations & Analytics</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Recharts status distributions, regional hub turnaround times, customer grievance handling, and CSV export.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Powered by HTML5 Web Speech Synthesis API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
