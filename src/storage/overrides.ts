import { CATEGORIES, type Category } from '../categoriser/rules';

export type Overrides = Record<string, Category>;

const KEY = 'budget-tracker:overrides';

export function loadOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: Record<string, unknown> = JSON.parse(raw);
    const clean: Overrides = {};
    for (const [merchant, category] of Object.entries(parsed)) {
      if (CATEGORIES.includes(category as Category)) clean[merchant] = category as Category;
    }
    return clean;
  } catch {
    return {}; // storage blocked or corrupted: start fresh instead of crashing
  }
}

export function saveOverrides(overrides: Overrides): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(overrides));
  } catch {
    // storage unavailable (e.g. private mode): corrections just won't persist
  }
}