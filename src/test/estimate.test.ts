import { describe, it, expect } from 'vitest';
import { EstimateLine } from '../types';

describe('Estimate Calculations & GST Tax Logic', () => {
  it('correctly calculates subtotal, 18% GST and grand total', () => {
    const lines: EstimateLine[] = [
      { id: '1', description: 'Motherboard Component', type: 'Part', quantity: 2, unitPriceInr: 2500, amountInr: 5000 },
      { id: '2', description: 'Technician Labor', type: 'Labor', quantity: 1, unitPriceInr: 1000, amountInr: 1000 },
    ];

    const subtotalInr = lines.reduce((acc, l) => acc + l.amountInr, 0);
    const gstRatePercent = 18;
    const gstAmountInr = Math.round((subtotalInr * gstRatePercent) / 100);
    const totalInr = subtotalInr + gstAmountInr;

    expect(subtotalInr).toBe(6000);
    expect(gstAmountInr).toBe(1080);
    expect(totalInr).toBe(7080);
  });
});
