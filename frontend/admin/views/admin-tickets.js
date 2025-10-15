import { listAllOrders } from '../../assets/js/data.js';

export function renderAdminTickets() {
  const app = document.getElementById('admin-app');
  const orders = listAllOrders();
  const rows = orders.flatMap(o => (o.tickets || []).map((code, idx) => ({
    orderId: o.id,
    code,
    status: o.status === 'paid' ? 'sold' : (o.status === 'canceled' ? 'canceled' : 'reserved'),
    seat: o.seats[idx],
    screeningId: o.screeningId,
    price: o.price,
  })));

  app.innerHTML = `
    <h1 class="text-2xl md:text-3xl font-semibold">Tickets</h1>
    <div class="mt-6 overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Code</th>
            <th class="px-3 py-2">Seat</th>
            <th class="px-3 py-2">Status</th>
            <th class="px-3 py-2">Order</th>
            <th class="px-3 py-2">Screening</th>
            <th class="px-3 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr class="odd:bg-white/5">
              <td class="px-3 py-2 font-medium">${r.code}</td>
              <td class="px-3 py-2">${r.seat}</td>
              <td class="px-3 py-2">${r.status}</td>
              <td class="px-3 py-2">${r.orderId.slice(0,8)}</td>
              <td class="px-3 py-2">${r.screeningId}</td>
              <td class="px-3 py-2">$${r.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
