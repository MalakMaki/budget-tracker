import type { Transaction } from '../parser/types';
import { categorise } from './categorise';
import type { Category } from './rules';

export type CategoryTotal = { category: Category; total: number };

export function spendingByCategory(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<Category, number>();
  for (const t of transactions) {
    if (t.amount >= 0) continue; // money coming in is not spending
    const category = categorise(t);
    totals.set(category, (totals.get(category) ?? 0) + -t.amount);
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
}