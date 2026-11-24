import { describe, it, expect } from 'vitest';
import { COMPLETE_VOICE_TOUR } from '../types/tour';

describe('Voice Guide & Interactive Audio Tour Model', () => {
  it('contains complete 9-step automated walkthrough', () => {
    expect(COMPLETE_VOICE_TOUR.length).toBe(9);
  });

  it('verifies every step has valid target routes and non-empty voice script', () => {
    COMPLETE_VOICE_TOUR.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
      expect(step.title.trim().length).toBeGreaterThan(0);
      expect(step.voiceScript.trim().length).toBeGreaterThan(20);
      expect(step.targetRoute.startsWith('/')).toBe(true);
      expect(step.summaryBullets.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('covers all 4 operational roles plus overview', () => {
    const rolesCovered = new Set(COMPLETE_VOICE_TOUR.map((s) => s.role));
    expect(rolesCovered.has('all')).toBe(true);
    expect(rolesCovered.has('customer')).toBe(true);
    expect(rolesCovered.has('center')).toBe(true);
    expect(rolesCovered.has('technician')).toBe(true);
    expect(rolesCovered.has('admin')).toBe(true);
  });
});
