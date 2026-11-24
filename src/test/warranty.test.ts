import { describe, it, expect } from 'vitest';
import { calculateWarrantyStatus } from '../lib/utils/warranty';
import { parseISO } from 'date-fns';

describe('Warranty Status & Boundary Calculations', () => {
  it('correctly identifies Active warranty when far from expiry', () => {
    const result = calculateWarrantyStatus(
      '2026-01-01',
      '2027-01-01',
      parseISO('2026-06-01')
    );
    expect(result.status).toBe('Active');
    expect(result.isEligibleForFreeService).toBe(true);
    expect(result.daysRemaining).toBeGreaterThan(30);
  });

  it('correctly identifies Expiring Soon when within 30 days', () => {
    const result = calculateWarrantyStatus(
      '2025-12-01',
      '2026-12-10',
      parseISO('2026-11-24') // 16 days remaining
    );
    expect(result.status).toBe('Expiring Soon');
    expect(result.isEligibleForFreeService).toBe(true);
    expect(result.daysRemaining).toBeLessThanOrEqual(30);
  });

  it('correctly identifies Expired warranty after end date', () => {
    const result = calculateWarrantyStatus(
      '2024-01-01',
      '2025-01-01',
      parseISO('2026-11-24')
    );
    expect(result.status).toBe('Expired');
    expect(result.isEligibleForFreeService).toBe(false);
    expect(result.daysRemaining).toBe(0);
    expect(result.percentElapsed).toBe(100);
  });

  it('correctly identifies Not Yet Active warranty when evaluation is before start date', () => {
    const result = calculateWarrantyStatus(
      '2027-01-01',
      '2028-01-01',
      parseISO('2026-11-24')
    );
    expect(result.status).toBe('Not Yet Active');
    expect(result.isEligibleForFreeService).toBe(false);
  });
});
