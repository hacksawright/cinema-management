import { getScreening, setCart } from '../assets/js/data.js';

const ROWS = 7; // A-G
const COLS = 12; // 1-12

function seatId(r, c) {
  return String.fromCharCode(65 + r) + (c + 1);
}

function buildSeats() {
  const seats = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      seats.push({ id: seatId(r, c), row: r, col: c });
    }
  }
  return seats;
}

export function renderBooking(screeningId) {
  const app = document.getElementById('app');
  const screening = getScreening(screeningId);
  if (!screening) {
    app.innerHTML = '<div class="text-slate-400">Screening not found.</div>';
    return;
  }

  const seats = buildSeats();
  const selected = new Set();

  app.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
        <h1 class="text-xl md:text-2xl font-semibold">Choose your seats</h1>
        <div class="mt-2 text-slate-400">Auditorium ${screening.auditorium} · ${formatDateTime(screening.time)}</div>
        <div class="mt-6">
          <div class="mx-auto max-w-3xl">
            <div class="text-center text-slate-400 mb-2">Screen</div>
            <div class="h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded"></div>
          </div>
          <div id="seat-grid" class="mt-6 grid grid-cols-12 gap-2 justify-items-center"></div>
          <div class="mt-5 flex items-center justify-center gap-5 text-sm text-slate-400">
            <span class="inline-flex items-center gap-2"><span class="w-4 h-4 rounded bg-white/10 ring-1 ring-white/15"></span> Available</span>
            <span class="inline-flex items-center gap-2"><span class="w-4 h-4 rounded bg-brand-500"></span> Selected</span>
            <span class="inline-flex items-center gap-2"><span class="w-4 h-4 rounded bg-slate-600"></span> Taken</span>
          </div>
        </div>
      </div>

      <aside class="lg:col-span-1">
        <div class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sticky top-24">
          <h2 class="font-medium">Order summary</h2>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between"><span>Tickets</span><span id="sum-tickets">0</span></div>
            <div class="flex justify-between"><span>Price per ticket</span><span>$${screening.price.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Subtotal</span><span id="sum-sub">$0.00</span></div>
            <div class="flex justify-between"><span>Fees & tax (10%)</span><span id="sum-tax">$0.00</span></div>
            <div class="border-t border-white/10 my-2"></div>
            <div class="flex justify-between font-semibold text-brand-200"><span>Total</span><span id="sum-total">$0.00</span></div>
          </div>
          <button id="proceed" class="btn mt-6 w-full px-4 py-2.5 rounded-md bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">Proceed to checkout</button>
        </div>
      </aside>
    </div>
  `;

  const grid = document.getElementById('seat-grid');
  grid.innerHTML = seats.map(seat => seatButton(seat)).join('');

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-seat]');
    if (!btn) return;
    if (btn.dataset.state === 'taken') return;
    const id = btn.dataset.seat;
    if (selected.has(id)) {
      selected.delete(id);
      btn.dataset.state = 'available';
      btn.classList.remove('bg-brand-500','text-white');
      btn.classList.add('bg-white/10','ring-white/15','hover:bg-white/20');
    } else {
      selected.add(id);
      btn.dataset.state = 'selected';
      btn.classList.add('bg-brand-500','text-white');
      btn.classList.remove('bg-white/10','ring-white/15','hover:bg-white/20');
    }
    updateSummary();
  });

  document.getElementById('proceed').addEventListener('click', () => {
    const items = Array.from(selected);
    if (!items.length) return;
    const cart = {
      id: crypto.randomUUID(),
      screeningId,
      seats: items,
      price: screening.price,
      createdAt: new Date().toISOString(),
      status: 'processing',
    };
    setCart(cart);
    location.hash = '#/checkout';
  });

  updateSummary();

  function updateSummary() {
    const qty = selected.size;
    const sub = qty * screening.price;
    const tax = sub * 0.10;
    const total = sub + tax;
    document.getElementById('sum-tickets').textContent = String(qty);
    document.getElementById('sum-sub').textContent = `$${sub.toFixed(2)}`;
    document.getElementById('sum-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('sum-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('proceed').disabled = qty === 0;
  }
}

function seatButton(seat) {
  return `<button data-seat="${seat.id}" aria-label="Seat ${seat.id}" data-state="available" class="w-7 h-7 md:w-8 md:h-8 rounded bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition text-[10px] md:text-xs">${seat.id}</button>`;
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
