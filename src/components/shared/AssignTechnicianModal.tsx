'use client';

import React, { useState } from 'react';
import { Technician } from '@/types';
import { X, UserCheck, Star, Wrench } from 'lucide-react';

interface AssignTechnicianModalProps {
  technicians: Technician[];
  currentTechnicianId?: string;
  ticketNumber: string;
  category: string;
  onClose: () => void;
  onAssign: (technicianId: string) => void;
}

export function AssignTechnicianModal({
  technicians,
  currentTechnicianId,
  ticketNumber,
  category,
  onClose,
  onAssign,
}: AssignTechnicianModalProps) {
  const [selectedId, setSelectedId] = useState(currentTechnicianId || technicians[0]?.id || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Assign Field Technician</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ticket #{ticketNumber} • Category: {category}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technician List */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-2.5">
          {technicians.map((tech) => {
            const isSelected = tech.id === selectedId;
            const hasSkill = tech.skills.includes(category as any);

            return (
              <div
                key={tech.id}
                onClick={() => setSelectedId(tech.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-50/60 border-teal-500 ring-1 ring-teal-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {tech.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{tech.name}</span>
                      {hasSkill && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Skill Match
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Skills: {tech.skills.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold justify-end">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{tech.rating}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {tech.activeTasksCount} active tasks
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onAssign(selectedId)}
            disabled={!selectedId}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm disabled:opacity-50"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
