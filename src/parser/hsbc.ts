import Papa from 'papaparse';
import type { Transaction } from './types';

export type ParseResult = {
  transactions: Transaction[];
  skipped: { row: number; reason: string }[];
};

// "03/10/2026" -> "2026-10-03", or null if it isn't a real date
function toIsoDate(raw: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw.trim());
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  const valid =
    d.getUTCFullYear() === Number(yyyy) &&
    d.getUTCMonth() === Number(mm) - 1 &&
    d.getUTCDate() === Number(dd);
  return valid ? `${yyyy}-${mm}-${dd}` : null;
}

function toAmount(raw: string): number | null {
  const cleaned = raw.replace(/[£,\s]/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100) / 100;
}

export function parseHsbc(csvText: string): ParseResult {
  const { data } = Papa.parse<string[]>(csvText, {
    delimiter: ',',
    skipEmptyLines: true,
  });

  const transactions: Transaction[] = [];
  const skipped: ParseResult['skipped'] = [];

  data.forEach((fields, i) => {
    const row = i + 1;
    if (fields.length !== 3) {
      skipped.push({ row, reason: `expected 3 columns, found ${fields.length}` });
      return;
    }
    const date = toIsoDate(fields[0]);
    if (!date) {
      skipped.push({ row, reason: 'invalid date' });
      return;
    }
    const amount = toAmount(fields[2]);
    if (amount === null) {
      skipped.push({ row, reason: 'invalid amount' });
      return;
    }
    transactions.push({ date, description: fields[1].trim(), amount });
  });

  return { transactions, skipped };
}