import { getCart, setCart, getScreening, upsertOrder, generateTicketCode } from '../assets/js/data.js';
import { getCurrentUser } from '../assets/js/auth.js';

export function renderCheckout() {
  const app = document.getElementById('app');
  const cart = getCart();
  if (!cart) {
    app.innerHTML = '<div class="text-slate-400">Your cart is empty.</div>';
    return;
  }
  const screening = getScreening(cart.screeningId);
  const qty = cart.seats.length;
  const sub = qty * cart.price;
  const tax = sub * 0.10;
  const total = sub + tax;

  app.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
        <h1 class="text-xl md:text-2xl font-semibold">Checkout</h1>
        <div class="mt-5">
          <h2 class="font-medium">Payment method</h2>
          <div class="mt-3 grid gap-3">
            <label class="flex items-center gap-3 p-3 rounded-lg bg-white/5 ring-1 ring-white/10 cursor-pointer card-hover">
              <input type="radio" name="pm" value="cash" class="accent-brand-500" checked />
              <span>Cash (demo)</span>
            </label>
            <label class="flex items-center gap-3 p-3 rounded-lg bg-white/5 ring-1 ring-white/10 cursor-pointer card-hover">
              <input type="radio" name="pm" value="bank" class="accent-brand-500" />
              <span>Bank Transfer (demo)</span>
            </label>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button id="pay" class="btn px-5 py-2.5 rounded-md bg-brand-500 hover:bg-brand-600">Pay $${total.toFixed(2)}</button>
            <button id="save" class="btn px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/15">Save for later</button>
          </div>
        </div>
      </div>

      <aside class="lg:col-span-1">
        <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sticky top-24">
          <h2 class="font-medium">Order summary</h2>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between"><span>Tickets</span><span>${qty}</span></div>
            <div class="flex justify-between"><span>Price per ticket</span><span>$${cart.price.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Seats</span><span>${cart.seats.join(', ')}</span></div>
            <div class="flex justify-between"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Fees & tax (10%)</span><span>$${tax.toFixed(2)}</span></div>
            <div class="border-t border-white/10 my-2"></div>
            <div class="flex justify-between font-semibold text-brand-200"><span>Total</span><span>$${total.toFixed(2)}</span></div>
            <div class="text-slate-400 mt-2 text-xs">Auditorium ${screening.auditorium} · ${formatDateTime(screening.time)}</div>
          </div>
        </div>
      </aside>
    </div>
  `;

  document.getElementById('pay').addEventListener('click', () => completeOrder('paid'));
  document.getElementById('save').addEventListener('click', () => completeOrder('processing'));

  function completeOrder(status) {
    const user = getCurrentUser();
    if (!user) {
      alert('Please sign in to complete your order.');
      location.hash = '#/signin';
      return;
    }
    const order = {
      id: crypto.randomUUID(),
      userId: user.id,
      screeningId: cart.screeningId,
      seats: cart.seats,
      price: cart.price,
      subtotal: sub,
      tax,
      total,
      status,
      createdAt: new Date().toISOString(),
      tickets: status === 'paid' ? cart.seats.map(() => generateTicketCode()) : [],
    };
    upsertOrder(order);
    setCart(null);
    if (status === 'paid') {
      location.hash = '#/dashboard';
    } else {
      alert('Order saved. You can resume payment from your dashboard.');
      location.hash = '#/dashboard';
    }
  }
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
