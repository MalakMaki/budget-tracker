import { describe, it, expect } from 'vitest';
import { detectSubscriptions } from './detect';

const tx = (date: string, description: string, amount: number) => ({ date, description, amount });

describe('detectSubscriptions', () => {
  it('finds a charge that repeats monthly for the same amount', () => {
    const result = detectSubscriptions([
      tx('2026-07-28', 'SPOTIFY P1A2B3C4D STOCKHOLM VIS', -11.99),
      tx('2026-08-28', 'SPOTIFY P5E6F7G8H STOCKHOLM VIS', -11.99),
      tx('2026-09-28', 'SPOTIFY P9I0J1K2L STOCKHOLM VIS', -11.99),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ merchant: 'spotify stockholm', amount: 11.99, count: 3 });
  });

  it('predicts the next payment date', () => {
    const [sub] = detectSubscriptions([
      tx('2026-07-28', 'NETFLIX', -10.99),
      tx('2026-08-28', 'NETFLIX', -10.99),
      tx('2026-09-28', 'NETFLIX', -10.99),
    ]);
    expect(sub.nextExpected).toBe('2026-10-29');
  });

  it('ignores a shop with irregular visits', () => {
    const result = detectSubscriptions([
      tx('2026-09-01', 'TESCO STORES LONDON', -12),
      tx('2026-09-03', 'TESCO STORES LONDON', -8),
      tx('2026-09-20', 'TESCO STORES LONDON', -15),
    ]);
    expect(result).toEqual([]);
  });

  it('ignores monthly charges whose amounts differ a lot', () => {
    const result = detectSubscriptions([
      tx('2026-07-10', 'SOME SHOP', -5),
      tx('2026-08-10', 'SOME SHOP', -40),
      tx('2026-09-10', 'SOME SHOP', -90),
    ]);
    expect(result).toEqual([]);
  });

  it('needs enough charges, and ignores money coming in', () => {
    expect(
      detectSubscriptions([
        tx('2026-08-28', 'NETFLIX', -10.99),
        tx('2026-09-28', 'NETFLIX', -10.99),
      ])
    ).toEqual([]);
    expect(
      detectSubscriptions([
        tx('2026-07-01', 'MAINTENANCE PAYMENT', 500),
        tx('2026-08-01', 'MAINTENANCE PAYMENT', 500),
        tx('2026-09-01', 'MAINTENANCE PAYMENT', 500),
      ])
    ).toEqual([]);
  });
});