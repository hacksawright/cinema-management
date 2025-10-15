import { listAllOrders, upsertOrder } from '../../assets/js/data.js';

export function renderAdminOrders() {
  const app = document.getElementById('admin-app');
  const orders = listAllOrders();
  app.innerHTML = `
    <h1 class="text-2xl md:text-3xl font-semibold">Orders</h1>
    <div class="mt-6 overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Order</th>
            <th class="px-3 py-2">User</th>
            <th class="px-3 py-2">Seats</th>
            <th class="px-3 py-2">Total</th>
            <th class="px-3 py-2">Status</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(row).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.querySelectorAll('select[data-status]').forEach(sel => {
    sel.addEventListener('change', () => {
      const id = sel.getAttribute('data-status');
      const order = orders.find(o => o.id === id);
      if (!order) return;
      order.status = sel.value;
      upsertOrder(order);
      renderAdminOrders();
    });
  });
}

function row(o) {
  return `
    <tr class="odd:bg-white/5">
      <td class="px-3 py-2 font-medium">${o.id.slice(0,8)}</td>
      <td class="px-3 py-2">${o.userId}</td>
      <td class="px-3 py-2">${o.seats.join(', ')}</td>
      <td class="px-3 py-2">$${o.total.toFixed(2)}</td>
      <td class="px-3 py-2">
        <select data-status="${o.id}" class="px-2 py-1 rounded-md bg-black/30 ring-1 ring-white/10">
          ${['paid','processing','canceled'].map(s => `<option ${o.status===s?'selected':''} value="${s}">${s}</option>`).join('')}
        </select>
      </td>
      <td class="px-3 py-2 text-slate-400 text-xs">${new Date(o.createdAt).toLocaleString()}</td>
    </tr>
  `;
}
