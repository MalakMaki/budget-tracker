import { describe, it, expect } from 'vitest';
import { categorise } from './categorise';

const tx = (description: string, amount = -5) => ({ date: '2026-01-01', description, amount });

describe('categorise', () => {
  it('matches a grocery store despite store numbers and symbols', () => {
    expect(categorise(tx('TESCO STORES 3042 LONDON )))'))).toBe('Groceries');
  });
  it('matches transport', () => {
    expect(categorise(tx('TFL TRAVEL CH TFL.GOV.UK/CP VIS'))).toBe('Transport');
  });
  it('treats money in as income', () => {
    expect(categorise(tx('MAINTENANCE PAYMENT', 1200))).toBe('Income');
  });
  it('falls back to Other for unknown merchants', () => {
    expect(categorise(tx('SOME RANDOM SHOP'))).toBe('Other');
  });
});