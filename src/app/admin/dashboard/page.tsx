'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Repository } from '@/lib/api/repository';
import { SystemMetrics } from '@/types';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatIndianDate, formatINR } from '@/lib/utils/dates';
import {
  Users,
  Tv,
  FileCheck2,
  Wrench,
  Building2,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);

  useEffect(() => {
    setMetrics(Repository.reports.getSummaryMetrics());
    setStatusDistribution(Repository.reports.getStatusDistribution());
  }, []);

  if (!metrics) return null;

  const trendData = [
    { month: 'Jun', volume: 18, resolved: 16 },
    { month: 'Jul', volume: 22, resolved: 20 },
    { month: 'Aug', volume: 29, resolved: 27 },
    { month: 'Sep', volume: 34, resolved: 31 },
    { month: 'Oct', volume: 38, resolved: 35 },
    { month: 'Nov', volume: 42, resolved: 38 },
  ];

  const centerPerformance = [
    { name: 'Bengaluru', tickets: 16, csat: 4.8 },
    { name: 'Chennai', tickets: 11, csat: 4.7 },
    { name: 'Hyderabad', tickets: 8, csat: 4.8 },
    { name: 'Mumbai', tickets: 7, csat: 4.7 },
  ];

  const pieColors = ['#0d9488', '#0284c7', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-600 tracking-wider uppercase">
            Enterprise Operations Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            ServiceFlow Pan-India Command Center
          </h1>
          <p className="text-xs text-slate-500">Live operational metrics aggregated across 4 tier-1 service hubs</p>
        </div>

        <Link
          href="/admin/reports"
          className="px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
        >
          <TrendingUp className="w-3.5 h-3.5" /> Executive Reports & CSV
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Customers"
          value={metrics.totalCustomers}
          subtitle="Registered consumer accounts"
          icon={Users}
          variant="teal"
        />
        <KPICard
          title="Protected Appliances"
          value={metrics.totalProducts}
          subtitle={`${metrics.activeWarranties} under active warranty`}
          icon={Tv}
          variant="blue"
        />
        <KPICard
          title="Service Requests"
          value={metrics.totalRequests}
          subtitle={`${metrics.activeRequests} currently in progress`}
          icon={Wrench}
          variant="amber"
        />
        <KPICard
          title="System CSAT"
          value={`${metrics.csatAverage} ★`}
          subtitle="Customer satisfaction average"
          icon={Star}
          variant="emerald"
        />
      </div>

      {/* Recharts Analytics Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Workflow State Distribution Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Service Request Status Distribution</h2>
            <p className="text-xs text-slate-500">Live tickets partitioned across all 11 lifecycle states</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="status"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Service Volume Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monthly Repair Intake & Resolution</h2>
            <p className="text-xs text-slate-500">Volume scaling across past 6 months (IST)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="volume" stroke="#0284c7" strokeWidth={2.5} name="Intake" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Hub Performance Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Service Center Hub Performance</h2>
            <p className="text-xs text-slate-500">Workload and satisfaction metrics across active cities</p>
          </div>
          <Link href="/admin/centers" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
            Manage Centers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          {centerPerformance.map((c) => (
            <div key={c.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">{c.name} Hub</span>
              <div className="flex justify-between text-slate-600">
                <span>Active Load:</span>
                <span className="font-semibold text-slate-800">{c.tickets} tickets</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CSAT Score:</span>
                <span className="font-bold text-teal-700">★ {c.csat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
