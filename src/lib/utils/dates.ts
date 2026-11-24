import { format, parseISO } from 'date-fns';

/**
 * Format ISO date string or Date object into human-readable Indian standard format.
 * e.g. "24 Nov 2026, 05:40 PM"
 */
export function formatIndianDateTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return String(dateInput);
  }
}

/**
 * Format ISO date string or Date object into human-readable date only.
 * e.g. "24 Nov 2026"
 */
export function formatIndianDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(d, 'dd MMM yyyy');
  } catch {
    return String(dateInput);
  }
}

/**
 * Format currency in Indian Rupees with proper grouping.
 * e.g. ₹1,45,000
 */
export function formatINR(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
