import { describe, it, expect, beforeEach } from 'vitest';
import { Repository } from '../lib/api/repository';
import { resetDemoData } from '../lib/mock/storage';

describe('Spare Parts Stock Non-Negative Rule', () => {
  beforeEach(() => {
    resetDemoData();
  });

  it('decrements stock correctly on allocation', () => {
    const spares = Repository.spares.getAll('center-blr-1');
    const initial = spares[0].quantityInStock;

    const updated = Repository.spares.adjustQuantity(spares[0].id, -1);
    expect(updated.quantityInStock).toBe(initial - 1);
  });

  it('prevents stock decrement below zero', () => {
    const spares = Repository.spares.getAll('center-blr-1');
    const spare = spares[0];

    // Attempting to decrement more than available
    expect(() => {
      Repository.spares.adjustQuantity(spare.id, -(spare.quantityInStock + 10));
    }).toThrow(/Cannot reduce stock below zero/);
  });
});
