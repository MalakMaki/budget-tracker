import type { Transaction } from '../parser/types';

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function renderTable(container: HTMLElement, transactions: Transaction[]): void {
  container.replaceChildren();
  if (transactions.length === 0) return;

  const table = document.createElement('table');

  const headRow = table.createTHead().insertRow();
  for (const label of ['Date', 'Description', 'Amount']) {
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
    const amountCell = row.insertCell();
    amountCell.textContent = gbp.format(t.amount);
    amountCell.className = t.amount < 0 ? 'out' : 'in';
  }

  container.appendChild(table);
}