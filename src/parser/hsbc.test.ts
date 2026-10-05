import { describe, it, expect } from 'vitest';
import { parseHsbc } from './hsbc';

describe('parseHsbc', () => {
  it('parses a normal row and converts the date to ISO', () => {
    const { transactions } = parseHsbc('28/09/2026,TESCO STORES LONDON ))),-14.20');
    expect(transactions).toEqual([
      { date: '2026-09-28', description: 'TESCO STORES LONDON )))', amount: -14.2 },
    ]);
  });

  it('keeps negative amounts negative and positive amounts positive', () => {
    const { transactions } = parseHsbc('20/09/2026,PAYMENT IN,1200.00\n21/09/2026,SHOP,-3.50');
    expect(transactions[0].amount).toBe(1200);
    expect(transactions[1].amount).toBe(-3.5);
  });

  it('handles Windows line endings', () => {
    const { transactions } = parseHsbc('01/01/2026,A,-1.00\r\n02/01/2026,B,-2.00\r\n');
    expect(transactions).toHaveLength(2);
  });

  it('handles a comma inside a quoted description', () => {
    const { transactions } = parseHsbc('22/09/2026,"BOOTS, ISLINGTON",-8.40');
    expect(transactions[0].description).toBe('BOOTS, ISLINGTON');
  });

  it('skips bad rows and reports why', () => {
    const csv = ['31/02/2026,IMPOSSIBLE DATE,-1.00', '01/01/2026,BAD AMOUNT,abc', 'only,two', '01/01/2026,GOOD,-1.00'].join('\n');
    const { transactions, skipped } = parseHsbc(csv);
    expect(transactions).toHaveLength(1);
    expect(skipped).toHaveLength(3);
  });

  it('returns nothing for empty input', () => {
    expect(parseHsbc('')).toEqual({ transactions: [], skipped: [] });
  });
});