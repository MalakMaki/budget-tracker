import type { Transaction } from '../parser/types';
import { normalise } from './normalise';
import { RULES, type Category } from './rules';
import type { Overrides } from '../storage/overrides';

export function categorise(t: Transaction, overrides: Overrides = {}): Category {
  const text = normalise(t.description);
  const corrected = overrides[text];
  if (corrected) return corrected;

  if (t.amount > 0) return 'Rent';
  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }
  return 'Other';
}