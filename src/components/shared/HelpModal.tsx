'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronDown,
  ShieldCheck,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'faq' | 'escalation' | 'contact' | 'ticket'>('faq');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Simulated support ticket form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Warranty Inquiry');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does ServiceFlow calculate appliance warranty validity?',
      a: 'Warranty status is computed dynamically using the purchase date and policy duration. A 30-day grace period is considered for expiring policies ("Expiring Soon"). Commercial usage or unauthorized tampering immediately flags policies as "Void", while unpurchased future appliances show "Not Yet Active".',
    },
    {
      q: 'What is the mandatory Estimate Approval workflow?',
      a: 'When replacement parts or billable out-of-warranty labor are required, service centers issue an itemized estimate with 18% GST. The state machine strictly locks work progression until the customer explicitly clicks "Approve Estimate" in their portal.',
    },
    {
      q: 'How does the conflict-free appointment scheduling work?',
      a: 'The system validates technician availability before dispatch. If a technician already has an active appointment on the requested date in that 3-hour window (Morning 09:00-12:00, Afternoon 12:00-15:00, Evening 15:00-18:00), the scheduling is blocked with an explicit error.',
    },
    {
      q: 'What are the Service Level Agreement (SLA) turnaround standards?',
      a: 'Urgent severity requests (water leaks, sparks, refrigerator cooling loss) must be assigned within 4 hours. Standard domestic appliance repairs have a target SLA of 24–48 hours from dispatch to quality check.',
    },
    {
      q: 'How does customer feedback affect technician performance scores?',
      a: 'Once repair work reaches "Completed", customers submit a 1 to 5 star rating with CSAT metrics (Timely Arrival and Resolution Satisfaction). This dynamically updates the technician’s historical CSAT average and closes the ticket.',
    },
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeRef = `SUP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(fakeRef);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">ServiceFlow Help & Support</h2>
              <p className="text-[11px] text-slate-400">Enterprise After-Sales Assistance & Policy Reference</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs">
          {[
            { id: 'faq', label: 'Knowledge Base & FAQs' },
            { id: 'escalation', label: 'Escalation Matrix' },
            { id: 'contact', label: 'Hotline & Support' },
            { id: 'ticket', label: 'Submit Query' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSubmittedTicket(null);
              }}
              className={`py-3 px-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2 font-medium">
                Standard operating guidelines for warranty validation, repair dispatch, and estimates.
              </div>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-teal-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'escalation' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Three-tier escalation hierarchy guaranteeing unresolved tickets are addressed within statutory service guidelines:
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-teal-900">Level 1: Local Service Center Desk</span>
                    <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      SLA: &lt; 4 Hours
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Frontline triage, technician dispatch, part reservation, and doorstep repair scheduling. Managed by city hub operations.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-900">Level 2: Regional Operations Hub Manager</span>
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      SLA: &lt; 12 Hours
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Intervenes when spare parts are awaiting dispatch from central warehouse, estimate disputes occur, or technician re-assignments are required.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-900">Level 3: OEM Brand Ombudsman & Engineering</span>
                    <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      SLA: &lt; 24 Hours
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Direct manufacturer oversight for critical manufacturing defects, full appliance replacements, and warranty claim arbitration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-100 text-teal-700">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Toll-Free Helpline</h4>
                    <p className="text-sm font-semibold text-teal-700 mt-0.5">1800-202-SERVICE</p>
                    <p className="text-[10px] text-slate-500 mt-1">Mon–Sat • 8:00 AM – 8:00 PM IST</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Email Inquiries</h4>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">support@jeevixserviceflow.in</p>
                    <p className="text-[10px] text-slate-500 mt-1">Average response time: 2 hours</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-200 text-slate-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Central Service Operations</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Jeevix Technologies Ltd, 4th Block, 100 Feet Road, Koramangala, Bengaluru, Karnataka — 560034
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ticket' && (
            <div>
              {submittedTicket ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Support Inquiry Registered</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Reference ID: <span className="font-mono font-bold text-slate-800">{submittedTicket}</span>. A customer service specialist will reach out within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setSubject('');
                      setMessage('');
                    }}
                    className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      >
                        <option value="Warranty Inquiry">Warranty Inquiry</option>
                        <option value="Estimate Question">Repair Estimate / Pricing</option>
                        <option value="Technician Dispatch">Technician Dispatch Delay</option>
                        <option value="Complaint Escalation">Complaint Escalation</option>
                        <option value="Portal Assistance">Portal / Technical Issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Question on Refrigerator warranty terms"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide details of your issue, ticket number, or appliance model..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span>ServiceFlow Enterprise Help Center • Kishore R (Intern)</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
