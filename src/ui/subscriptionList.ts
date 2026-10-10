import type { Subscription } from '../subscriptions/detect';

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function renderSubscriptions(container: HTMLElement, subs: Subscription[]): void {
  container.replaceChildren();
  container.hidden = subs.length === 0;
  if (subs.length === 0) return;

  const heading = document.createElement('h2');
  heading.textContent = 'Likely subscriptions';

  const total = subs.reduce((sum, s) => sum + s.amount, 0);
  const summary = document.createElement('p');
  summary.textContent = `About ${gbp.format(total)} a month across ${subs.length} recurring payment(s).`;

  const list = document.createElement('ul');
  for (const s of subs) {
    const item = document.createElement('li');
    item.textContent = `${s.merchant}: ${gbp.format(s.amount)} (next around ${s.nextExpected})`;
    list.appendChild(item);
  }

  container.append(heading, summary, list);
}