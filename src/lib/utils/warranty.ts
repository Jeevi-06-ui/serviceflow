import { WarrantyStatus } from '@/types';
import { differenceInDays, isBefore, isAfter, parseISO } from 'date-fns';

/**
 * Calculates deterministic warranty validity for a given target evaluation date.
 * Validates not-yet-active, active, expiring soon (<= 30 days), and expired.
 */
export function calculateWarrantyStatus(
  startDateStr: string,
  endDateStr: string,
  evaluationDate: Date = new Date()
): {
  status: WarrantyStatus;
  daysRemaining: number;
  totalDurationDays: number;
  percentElapsed: number;
  isEligibleForFreeService: boolean;
} {
  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);

  const totalDurationDays = Math.max(1, differenceInDays(endDate, startDate));

  // If evaluation date is before warranty start date
  if (isBefore(evaluationDate, startDate)) {
    return {
      status: 'Not Yet Active',
      daysRemaining: differenceInDays(endDate, evaluationDate),
      totalDurationDays,
      percentElapsed: 0,
      isEligibleForFreeService: false,
    };
  }

  // If evaluation date is after warranty end date
  if (isAfter(evaluationDate, endDate)) {
    return {
      status: 'Expired',
      daysRemaining: 0,
      totalDurationDays,
      percentElapsed: 100,
      isEligibleForFreeService: false,
    };
  }

  // Warranty is currently running
  const daysRemaining = differenceInDays(endDate, evaluationDate);
  const daysElapsed = differenceInDays(evaluationDate, startDate);
  const percentElapsed = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDurationDays) * 100)));

  if (daysRemaining <= 30) {
    return {
      status: 'Expiring Soon',
      daysRemaining,
      totalDurationDays,
      percentElapsed,
      isEligibleForFreeService: true,
    };
  }

  return {
    status: 'Active',
    daysRemaining,
    totalDurationDays,
    percentElapsed,
    isEligibleForFreeService: true,
  };
}
