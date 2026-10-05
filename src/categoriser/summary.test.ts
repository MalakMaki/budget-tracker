import { describe, it, expect } from 'vitest';
import { spendingByCategory } from './summary';

const tx = (description: string, amount: number) => ({ date: '2026-01-01', description, amount });

describe('spendingByCategory', () => {
  it('sums spending per category, largest first, and ignores income', () => {
    const result = spendingByCategory([
      tx('TESCO STORES LONDON', -10),
      tx('TESCO EXPRESS', -5.5),
      tx('PRET A MANGER', -4),
      tx('MAINTENANCE PAYMENT', 1000),
    ]);
    expect(result).toEqual([
      { category: 'Groceries', total: 15.5 },
      { category: 'Eating out', total: 4 },
    ]);
  });

  it('returns an empty list when there is no spending', () => {
    expect(spendingByCategory([])).toEqual([]);
  });
});