import { getCurrentUser } from '../assets/js/auth.js';
import { listOrdersByUser } from '../assets/js/data.js';
import { setCart } from '../assets/js/data.js';

export function renderDashboard() {
  const app = document.getElementById('app');
  const user = getCurrentUser();
  if (!user) {
    app.innerHTML = '<div class="text-slate-400">Please <a href="#/signin" class="text-brand-300 underline">sign in</a> to view your dashboard.</div>';
    return;
  }
  const orders = listOrdersByUser(user.id);

  app.innerHTML = `
    <h1 class="text-2xl md:text-3xl font-semibold">My Tickets</h1>
    <div class="mt-6 grid gap-4">
      ${orders.map(orderCard).join('') || empty()}
    </div>
  `;

  // Attach resume handlers
  document.querySelectorAll('[data-resume]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-resume');
      const order = orders.find(o => o.id === id);
      if (!order) return;
      setCart({
        id: crypto.randomUUID(),
        screeningId: order.screeningId,
        seats: order.seats,
        price: order.price,
        createdAt: new Date().toISOString(),
        status: 'processing',
      });
      location.hash = '#/checkout';
    });
  });
}

function orderCard(o) {
  return `
    <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 flex flex-col md:flex-row md:items-center gap-4 card-hover">
      <div class="md:w-1/3">
        <div class="text-sm text-slate-400">Order</div>
        <div class="font-medium">${o.id.slice(0, 8).toUpperCase()}</div>
        <div class="text-sm text-slate-400">${new Date(o.createdAt).toLocaleString()}</div>
      </div>
      <div class="md:w-1/3">
        <div class="text-sm text-slate-400">Seats</div>
        <div>${o.seats.join(', ')}</div>
      </div>
      <div class="md:w-1/3 md:text-right">
        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs ${badgeClass(o.status)}">${o.status}</span>
        <div class="mt-2 font-semibold">$${o.total.toFixed(2)}</div>
        <div class="mt-3 flex md:justify-end gap-2">
          ${o.status === 'processing' ? `<button data-resume="${o.id}" class="btn px-3 py-1.5 rounded-md bg-brand-500 hover:bg-brand-600 text-sm">Resume payment</button>` : ''}
          ${o.status === 'paid' ? `<button class="btn px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-sm" onclick="window.print()">Print</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function badgeClass(status) {
  switch (status) {
    case 'paid': return 'bg-emerald-500/20 text-emerald-200';
    case 'processing': return 'bg-amber-500/20 text-amber-200';
    case 'canceled': return 'bg-rose-500/20 text-rose-200';
    default: return 'bg-white/10 text-slate-300';
  }
}

function empty() {
  return `<div class="text-slate-400">No orders yet.</div>`;
}
