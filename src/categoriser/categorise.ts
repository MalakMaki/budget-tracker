import type { Transaction } from '../parser/types';
import { normalise } from './normalise';
import { RULES, type Category } from './rules';

export function categorise(t: Transaction): Category {
  if (t.amount > 0) return 'Income';
  const text = normalise(t.description);
  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }
  return 'Other';
}