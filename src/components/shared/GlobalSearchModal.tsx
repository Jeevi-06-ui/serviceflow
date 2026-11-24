'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Repository } from '@/lib/api/repository';
import {
  Search,
  Wrench,
  Tv,
  FileCheck2,
  Users,
  X,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'ticket' | 'product' | 'warranty' | 'customer' | 'technician'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Escape, Arrows, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawResults = query.trim() ? Repository.search.omniSearch(query) : [];
  const filteredResults =
    activeTab === 'all' ? rawResults : rawResults.filter((r) => r.category === activeTab);

  const handleSelect = (item: (typeof rawResults)[0]) => {
    onClose();
    router.push(item.link);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ticket':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'product':
        return <Tv className="w-4 h-4 text-blue-600" />;
      case 'warranty':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'customer':
      case 'technician':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ticket':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'product':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warranty':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'customer':
      case 'technician':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-white">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tickets (e.g. SR-2026-0001), serial numbers, appliances, customers..."
            className="flex-1 text-sm bg-transparent border-0 outline-none placeholder:text-slate-400 text-slate-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'ticket', label: 'Service Tickets' },
            { id: 'product', label: 'Appliances' },
            { id: 'warranty', label: 'Warranties' },
            { id: 'customer', label: 'Customers' },
            { id: 'technician', label: 'Technicians' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 max-h-96">
          {!query.trim() ? (
            <div className="py-10 px-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Quick Omnisearch across ServiceFlow</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                Type a service request number like <span className="font-mono text-slate-600 font-bold">SR-2026-0001</span>, an appliance serial number, customer name, or warranty policy.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['SR-2026-0001', 'Priya Sharma', 'SN-VOLT', 'Bengaluru Hub', 'Refrigerator'].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching records found for &ldquo;<span className="font-semibold text-slate-700">{query}</span>&rdquo;.
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <div
                key={item.id + idx}
                onClick={() => handleSelect(item)}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                  idx === selectedIndex ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${getCategoryColor(item.category)}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 shrink-0">
                  <span className="text-[10px] font-medium hidden sm:inline">Jump</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3" /> + K to search anywhere
            </span>
            <span>•</span>
            <span>Esc to exit</span>
          </div>
          <span className="font-medium text-slate-500">{filteredResults.length} match(es)</span>
        </div>
      </div>
    </div>
  );
}
