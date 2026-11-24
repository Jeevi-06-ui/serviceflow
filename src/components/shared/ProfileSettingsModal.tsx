'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  X,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Bell,
  Volume2,
  Lock,
  Globe,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, role, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const roleColorMap = {
    customer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    center: 'bg-blue-50 text-blue-700 border-blue-200',
    technician: 'bg-amber-50 text-amber-700 border-amber-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">{user.name}</h2>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 capitalize ${roleColorMap[role]}`}>
                {role} Account
              </span>
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
            { id: 'profile', label: 'User Profile' },
            { id: 'preferences', label: 'Notification Settings' },
            { id: 'security', label: 'Security & Session' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Full Name</span>
                  </div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </div>
                  <p className="font-semibold text-slate-900">{user.email}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Registered Phone</span>
                  </div>
                  <p className="font-semibold text-slate-900">{user.phone || '+91 98450 12345'}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Assigned Hub / ID</span>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {user.customerId || user.centerId || user.technicianId || 'Super-Admin Root'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 text-xs space-y-1">
                <div className="font-bold text-teal-900">Demo Session Profile</div>
                <p className="text-teal-700 leading-relaxed text-[11px]">
                  You are currently authenticated in the ServiceFlow demo environment as <strong>{user.name}</strong> ({role}). You can switch perspectives anytime via the role switcher or log out below.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Configure your multi-channel alert preferences for service ticket status changes and appointments:
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">SMS Appointment Reminders</div>
                      <div className="text-[11px] text-slate-500">Receive OTP and technician ETA alerts via SMS</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">WhatsApp Live Updates</div>
                      <div className="text-[11px] text-slate-500">Instant PDF estimates and milestone notifications</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Daily Digest Email</div>
                      <div className="text-[11px] text-slate-500">Summary of warranty expiry dates and completed jobs</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Audio Cues & Voice Narration</div>
                      <div className="text-[11px] text-slate-500">Enable sound effects during automated voice tour</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioAlerts}
                    onChange={(e) => setAudioAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Preferences saved!
                  </span>
                ) : (
                  <span />
                )}
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Regional Locale</span>
                  </div>
                  <p className="font-semibold text-slate-900">Asia/Kolkata (IST +05:30)</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Client IP Location</span>
                  </div>
                  <p className="font-semibold text-slate-900">106.51.72.18 (Bengaluru, KA)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3">
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                  <LogOut className="w-4 h-4" />
                  <span>Session Sign Out</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ending this session will clear your active role credentials and redirect to the sign-in screen.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out of ServiceFlow
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span>ServiceFlow v1.0 • APAC (India)</span>
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
