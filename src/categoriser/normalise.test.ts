import { describe, it, expect } from 'vitest';
import { normalise } from './normalise';

describe('normalise', () => {
  it('cleans a typical contactless description', () => {
    expect(normalise('TESCO STORES 3042 LONDON )))')).toBe('tesco stores london');
  });
  it('removes card-reader prefixes', () => {
    expect(normalise('SumUp *PUTNEY CHA London )))')).toBe('putney cha london');
  });
});