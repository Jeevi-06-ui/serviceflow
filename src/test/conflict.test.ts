import { describe, it, expect, beforeEach } from 'vitest';
import { Repository } from '../lib/api/repository';
import { resetDemoData } from '../lib/mock/storage';

describe('Technician Appointment Conflict Detection', () => {
  beforeEach(() => {
    resetDemoData();
  });

  it('detects scheduling clash when same technician is booked in the same date and time slot', () => {
    // tech-1 is already booked on 2026-11-25 during 10:00 AM - 12:00 PM for req-1 (apt-1)
    const hasConflict = Repository.appointments.checkConflict(
      'tech-1',
      '2026-11-25',
      '10:00 AM - 12:00 PM',
      'different-request-id'
    );
    expect(hasConflict).toBe(true);
  });

  it('allows scheduling when technician is free or slot is different', () => {
    // Different slot on same day
    const differentSlotConflict = Repository.appointments.checkConflict(
      'tech-1',
      '2026-11-25',
      '04:30 PM - 06:30 PM',
      'different-request-id'
    );
    expect(differentSlotConflict).toBe(false);

    // Different day
    const differentDayConflict = Repository.appointments.checkConflict(
      'tech-1',
      '2026-11-30',
      '10:00 AM - 12:00 PM',
      'different-request-id'
    );
    expect(differentDayConflict).toBe(false);
  });
});
