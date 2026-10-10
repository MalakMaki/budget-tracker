import type { Transaction } from '../parser/types';
import { CATEGORIES, type Category } from '../categoriser/rules';

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function renderTable(
  container: HTMLElement,
  transactions: Transaction[],
  getCategory: (t: Transaction) => Category,
  onCategoryChange: (t: Transaction, category: Category) => void
): void {
  container.replaceChildren();
  if (transactions.length === 0) return;

  const table = document.createElement('table');

  const headRow = table.createTHead().insertRow();
  for (const label of ['Date', 'Description', 'Category', 'Amount']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headRow.appendChild(th);
  }

  const body = table.createTBody();
  for (const t of transactions) {
    const row = body.insertRow();
    row.insertCell().textContent = t.date;
    row.insertCell().textContent = t.description;

    const select = document.createElement('select');
    select.setAttribute('aria-label', `Category for ${t.description}`);
    for (const c of CATEGORIES) {
      const option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      select.appendChild(option);
    }
    select.value = getCategory(t);
    select.addEventListener('change', () => onCategoryChange(t, select.value as Category));
    row.insertCell().appendChild(select);

    const amountCell = row.insertCell();
    amountCell.textContent = gbp.format(t.amount);
    amountCell.className = t.amount < 0 ? 'out' : 'in';
  }

  container.appendChild(table);
}