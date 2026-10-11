import { describe, it, expect } from 'vitest';
import { hasOverlap } from './ranges';

describe('hasOverlap', () => {
  it('is false for back-to-back months', () => {
    expect(hasOverlap([
      { min: '2026-08-01', max: '2026-08-31' },
      { min: '2026-09-01', max: '2026-09-30' },
    ])).toBe(false);
  });
  it('is true when ranges share dates, whatever order they come in', () => {
    expect(hasOverlap([
      { min: '2026-09-15', max: '2026-10-15' },
      { min: '2026-08-20', max: '2026-09-20' },
    ])).toBe(true);
  });
  it('is false for zero or one file', () => {
    expect(hasOverlap([])).toBe(false);
    expect(hasOverlap([{ min: '2026-09-01', max: '2026-09-30' }])).toBe(false);
  });
});