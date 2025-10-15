import { listAllOrders } from '../../assets/js/data.js';

export function renderAdminTransactions() {
  const app = document.getElementById('admin-app');
  const orders = listAllOrders().filter(o => o.status === 'paid');
  const rows = orders.map(o => ({ id: o.id, amount: o.total, date: o.createdAt }));
  const grouped = groupByDate(rows);
  const total = orders.reduce((a,b) => a + b.total, 0);

  app.innerHTML = `
    <div class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-semibold">Transactions</h1>
      <div class="text-right">
        <div class="text-sm text-slate-400">Total revenue</div>
        <div class="text-xl font-semibold">$${total.toFixed(2)}</div>
      </div>
    </div>

    <div class="mt-6 grid md:grid-cols-2 gap-6">
      <div class="rounded-xl ring-1 ring-white/10 overflow-hidden">
        <table class="min-w-full text-sm">
          <thead class="bg-white/5 text-left">
            <tr><th class="px-3 py-2">Transaction</th><th class="px-3 py-2">Amount</th><th class="px-3 py-2">Date</th></tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr class="odd:bg-white/5">
                <td class="px-3 py-2 font-medium">${r.id.slice(0,8)}</td>
                <td class="px-3 py-2">$${r.amount.toFixed(2)}</td>
                <td class="px-3 py-2">${new Date(r.date).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="rounded-xl ring-1 ring-white/10 overflow-hidden">
        <table class="min-w-full text-sm">
          <thead class="bg-white/5 text-left">
            <tr><th class="px-3 py-2">Date</th><th class="px-3 py-2">Revenue</th></tr>
          </thead>
          <tbody>
            ${Object.entries(grouped).map(([date, sum]) => `
              <tr class="odd:bg-white/5">
                <td class="px-3 py-2 font-medium">${date}</td>
                <td class="px-3 py-2">$${sum.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function groupByDate(rows) {
  const out = {};
  for (const r of rows) {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    out[key] = (out[key] || 0) + r.amount;
  }
  return out;
}
