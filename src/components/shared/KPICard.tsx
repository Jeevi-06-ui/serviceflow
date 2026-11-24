import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'teal' | 'amber' | 'emerald' | 'blue' | 'rose';
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className = '',
}: KPICardProps) {
  const iconVariants = {
    default: 'bg-slate-100 text-slate-700',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconVariants[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
