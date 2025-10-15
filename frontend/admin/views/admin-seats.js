import { getSeatConfig, setSeatConfig } from '../../assets/js/data.js';

export function renderAdminSeats() {
  const app = document.getElementById('admin-app');
  const { rows, cols, types } = getSeatConfig();
  app.innerHTML = `
    <div class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-semibold">Seat Map</h1>
      <button id="save" class="btn px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600">Save</button>
    </div>
    <p class="mt-3 text-slate-400">Configure seat types for a fixed map applied to all auditoriums.</p>
    <div class="mt-6">
      <div id="grid" class="grid" style="grid-template-columns: repeat(${cols}, minmax(28px, 1fr)); gap: 6px;"></div>
      <div class="mt-4 flex gap-3 text-sm text-slate-300">
        <span><span class="inline-block w-4 h-4 rounded align-middle mr-2 bg-white/10"></span> Normal</span>
        <span><span class="inline-block w-4 h-4 rounded align-middle mr-2 bg-amber-500/50"></span> VIP</span>
        <span><span class="inline-block w-4 h-4 rounded align-middle mr-2 bg-emerald-500/50"></span> Couple</span>
      </div>
    </div>
  `;

  const grid = document.getElementById('grid');
  const local = new Map(types.map(t => [t.seat, t.type]));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = String.fromCharCode(65 + r) + (c + 1);
      const type = local.get(id) || 'normal';
      const btn = document.createElement('button');
      btn.textContent = id;
      btn.dataset.seat = id;
      btn.dataset.type = type;
      btn.className = btnClass(type);
      btn.addEventListener('click', () => {
        btn.dataset.type = nextType(btn.dataset.type);
        btn.className = btnClass(btn.dataset.type);
      });
      grid.appendChild(btn);
    }
  }

  document.getElementById('save').addEventListener('click', () => {
    const updated = Array.from(grid.querySelectorAll('button')).map(b => ({ seat: b.dataset.seat, type: b.dataset.type }));
    setSeatConfig({ rows, cols, types: updated });
    alert('Seat configuration saved');
  });
}

function btnClass(type) {
  const base = 'w-9 h-9 md:w-10 md:h-10 rounded text-xs ring-1 ring-white/10 hover:ring-white/20 transition';
  if (type === 'vip') return `${base} bg-amber-500/50`;
  if (type === 'couple') return `${base} bg-emerald-500/50`;
  return `${base} bg-white/10`;
}

function nextType(type) {
  if (type === 'normal') return 'vip';
  if (type === 'vip') return 'couple';
  return 'normal';
}
