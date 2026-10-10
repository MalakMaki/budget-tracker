import type { Transaction } from '../parser/types';
import { normalise } from '../categoriser/normalise';

export type Subscription = {
  merchant: string;
  amount: number;       // typical charge, as a positive number
  count: number;        // how many charges were found
  lastDate: string;
  nextExpected: string;
};

const DAY_MS = 86_400_000;
const MIN_GAP = 25;     // days between charges that still count as "monthly"
const MAX_GAP = 37;

// "SPOTIFY P1A2B3C4D STOCKHOLM VIS" -> "spotify stockholm"
function merchantKey(description: string): string {
  return normalise(description)
    .split(' ')
    .filter((word) => !/\d/.test(word))
    .join(' ');
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS);
}

function addDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function detectSubscriptions(
  transactions: Transaction[],
  minOccurrences = 3
): Subscription[] {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.amount >= 0) continue; // only spending can be a subscription
    const key = merchantKey(t.description);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }

  const found: Subscription[] = [];
  for (const [merchant, group] of groups) {
    if (group.length < minOccurrences) continue;

    const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date));

    const gaps = sorted.slice(1).map((t, i) => daysBetween(sorted[i].date, t.date));
    if (!gaps.every((g) => g >= MIN_GAP && g <= MAX_GAP)) continue;

    const amounts = sorted.map((t) => -t.amount);
    const typical = median(amounts);
    const tolerance = Math.max(1, typical * 0.1); // £1 or 10%, whichever is bigger
    if (!amounts.every((a) => Math.abs(a - typical) <= tolerance)) continue;

    const lastDate = sorted[sorted.length - 1].date;
    found.push({
      merchant,
      amount: Math.round(typical * 100) / 100,
      count: sorted.length,
      lastDate,
      nextExpected: addDays(lastDate, Math.round(median(gaps))),
    });
  }

  return found.sort((a, b) => b.amount - a.amount);
}