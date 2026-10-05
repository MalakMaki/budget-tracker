import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import type { CategoryTotal } from '../categoriser/summary';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
let chart: Chart | null = null;

export function renderCategoryChart(canvas: HTMLCanvasElement, data: CategoryTotal[]): void {
  chart?.destroy(); // avoids stacking charts when a new file is loaded
  chart = null;

  const wrap = canvas.parentElement!;
  wrap.hidden = data.length === 0;
  if (data.length === 0) return;

  // screen readers can't see a canvas, so describe the data in text
  canvas.setAttribute(
    'aria-label',
    'Spending by category: ' + data.map((d) => `${d.category} ${gbp.format(d.total)}`).join(', ')
  );

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map((d) => d.category),
      datasets: [{ data: data.map((d) => d.total), backgroundColor: '#4f6bed' }],
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        tooltip: { callbacks: { label: (ctx) => gbp.format(ctx.parsed.x ?? 0) } },
      },
      scales: { x: { ticks: { callback: (value) => '£' + value } } },
    },
  });
}