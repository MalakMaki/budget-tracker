import './style.css';
import { parseHsbc } from './parser/hsbc';
import type { Transaction } from './parser/types';
import { categorise } from './categoriser/categorise';
import { normalise } from './categoriser/normalise';
import { spendingByCategory } from './categoriser/summary';
import { loadOverrides, saveOverrides, clearOverrides } from './storage/overrides';
import { renderTable } from './ui/transactionTable';
import { renderCategoryChart } from './ui/categoryChart';
import { detectSubscriptions } from './subscriptions/detect';
import { renderSubscriptions } from './ui/subscriptionList';
import { hasOverlap, type DateRange } from './parser/ranges';

const input = document.querySelector<HTMLInputElement>('#file-input')!;
const dropzone = document.querySelector<HTMLElement>('#dropzone')!;
const message = document.querySelector<HTMLElement>('#message')!;
const results = document.querySelector<HTMLElement>('#results')!;
const chartCanvas = document.querySelector<HTMLCanvasElement>('#category-chart')!;
const subscriptionsEl = document.querySelector<HTMLElement>('#subscriptions')!;

let transactions: Transaction[] = [];
const overrides = loadOverrides();

function render(): void {
  renderTable(
    results,
    transactions,
    (t) => categorise(t, overrides),
    (t, category) => {
      overrides[normalise(t.description)] = category;
      saveOverrides(overrides);
      render();
    }
  );
  renderCategoryChart(chartCanvas, spendingByCategory(transactions, overrides));
    renderSubscriptions(subscriptionsEl, detectSubscriptions(transactions));
}

async function handleFiles(files: File[]): Promise<void> {
  try {
    const all: Transaction[] = [];
    const ranges: DateRange[] = [];
    let skipped = 0;

    for (const file of files) {
      const parsed = parseHsbc(await file.text());
      skipped += parsed.skipped.length;
      all.push(...parsed.transactions);
      if (parsed.transactions.length > 0) {
        const dates = parsed.transactions.map((t) => t.date).sort();
        ranges.push({ min: dates[0], max: dates[dates.length - 1] });
      }
    }

    transactions = all.sort((a, b) => b.date.localeCompare(a.date));

    if (transactions.length === 0) {
      message.textContent =
        'No transactions found. Is this an HSBC CSV with date, description and amount columns?';
    } else {
      const notes = [`Read ${transactions.length} transactions from ${files.length} file(s).`];
      if (skipped > 0) notes.push(`${skipped} row(s) could not be read and were skipped.`);
      if (hasOverlap(ranges)) {
        notes.push('Warning: some files cover overlapping dates, so some transactions may be counted twice.');
      }
      message.textContent = notes.join(' ');
    }
  } catch {
    transactions = [];
    message.textContent = 'Something went wrong reading those files.';
  }
  render();
}

input.addEventListener('change', () => {
  const files = Array.from(input.files ?? []);
  if (files.length > 0) void handleFiles(files);
  input.value = '';
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragging');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragging');
  const files = Array.from(e.dataTransfer?.files ?? []);
  if (files.length > 0) void handleFiles(files);
});

document.querySelector<HTMLButtonElement>('#clear-corrections')!.addEventListener('click', () => {
  if (!confirm('Delete all saved category corrections from this browser?')) return;
  for (const key of Object.keys(overrides)) delete overrides[key];
  clearOverrides();
  render();
});