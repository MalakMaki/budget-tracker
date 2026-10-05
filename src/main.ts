import './style.css';
import { parseHsbc } from './parser/hsbc';
import { renderTable } from './ui/transactionTable';

const input = document.querySelector<HTMLInputElement>('#file-input')!;
const dropzone = document.querySelector<HTMLElement>('#dropzone')!;
const message = document.querySelector<HTMLElement>('#message')!;
const results = document.querySelector<HTMLElement>('#results')!;

async function handleFile(file: File): Promise<void> {
  try {
    const text = await file.text();
    const { transactions, skipped } = parseHsbc(text);
    transactions.sort((a, b) => b.date.localeCompare(a.date));

    if (transactions.length === 0) {
      message.textContent =
        'No transactions found. Is this an HSBC CSV with date, description and amount columns?';
    } else {
      const skippedNote =
        skipped.length > 0 ? ` ${skipped.length} row(s) could not be read and were skipped.` : '';
      message.textContent = `Read ${transactions.length} transactions.${skippedNote}`;
    }
    renderTable(results, transactions);
  } catch {
    message.textContent = 'Something went wrong reading that file.';
    results.replaceChildren();
  }
}

input.addEventListener('change', () => {
  const file = input.files?.[0];
  if (file) void handleFile(file);
  input.value = ''; // lets you pick the same file again
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