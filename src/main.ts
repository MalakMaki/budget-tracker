import './style.css';
import { parseHsbc } from './parser/hsbc';
import type { Transaction } from './parser/types';
import { categorise } from './categoriser/categorise';
import { normalise } from './categoriser/normalise';
import { spendingByCategory } from './categoriser/summary';
import { loadOverrides, saveOverrides } from './storage/overrides';
import { renderTable } from './ui/transactionTable';
import { renderCategoryChart } from './ui/categoryChart';

const input = document.querySelector<HTMLInputElement>('#file-input')!;
const dropzone = document.querySelector<HTMLElement>('#dropzone')!;
const message = document.querySelector<HTMLElement>('#message')!;
const results = document.querySelector<HTMLElement>('#results')!;
const chartCanvas = document.querySelector<HTMLCanvasElement>('#category-chart')!;

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
}

async function handleFile(file: File): Promise<void> {
  try {
    const text = await file.text();
    const parsed = parseHsbc(text);
    transactions = parsed.transactions.sort((a, b) => b.date.localeCompare(a.date));

    if (transactions.length === 0) {
      message.textContent =
        'No transactions found. Is this an HSBC CSV with date, description and amount columns?';
    } else {
      const skippedNote =
        parsed.skipped.length > 0
          ? ` ${parsed.skipped.length} row(s) could not be read and were skipped.`
          : '';
      message.textContent = `Read ${transactions.length} transactions.${skippedNote}`;
    }
  } catch {
    transactions = [];
    message.textContent = 'Something went wrong reading that file.';
  }
  render();
}

input.addEventListener('change', () => {
  const file = input.files?.[0];
  if (file) void handleFile(file);
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
  const file = e.dataTransfer?.files[0];
  if (file) void handleFile(file);
});