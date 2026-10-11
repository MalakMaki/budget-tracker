export type DateRange = { min: string; max: string };

// true if any two date ranges share a day
export function hasOverlap(ranges: DateRange[]): boolean {
  const sorted = [...ranges].sort((a, b) => a.min.localeCompare(b.min));
  return sorted.some((r, i) => i > 0 && r.min <= sorted[i - 1].max);
}