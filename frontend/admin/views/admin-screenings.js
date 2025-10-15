import { listMovies } from '../../assets/js/data.js';
import { listScreenings, upsertScreening, deleteScreening } from '../../assets/js/data.js';

export function renderAdminScreenings() {
  const app = document.getElementById('admin-app');
  const screenings = listScreenings();
  const movies = listMovies();
  app.innerHTML = `
    <div class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-semibold">Screenings</h1>
      <button id="add" class="btn px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600">Add screening</button>
    </div>

    <div class="mt-6 overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Movie</th>
            <th class="px-3 py-2">Auditorium</th>
            <th class="px-3 py-2">Time</th>
            <th class="px-3 py-2">Price</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${screenings.map(s => row(s, movies)).join('')}
        </tbody>
      </table>
    </div>

    <dialog id="dlg" class="rounded-xl bg-slate-900 text-slate-100 p-0 w-full max-w-xl">
      <form id="form" method="dialog">
        <div class="p-5 border-b border-white/10">
          <h2 id="dlg-title" class="text-lg font-semibold">Add screening</h2>
        </div>
        <div class="p-5 grid gap-3">
          <select id="movieId" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10">
            ${movies.map(m => `<option value="${m.id}">${m.title}</option>`).join('')}
          </select>
          <div class="grid grid-cols-2 gap-3">
            <input id="auditorium" placeholder="Auditorium" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
            <input id="price" type="number" step="0.01" placeholder="Price" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
          </div>
          <input id="time" type="datetime-local" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
        </div>
        <div class="p-5 border-t border-white/10 flex justify-end gap-2">
          <button value="cancel" class="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15">Cancel</button>
          <button id="save" value="default" class="btn px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600">Save</button>
        </div>
      </form>
    </dialog>
  `;

  document.getElementById('add').addEventListener('click', () => openDialog());
  document.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openDialog(btn.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => doDelete(btn.dataset.delete)));

  function openDialog(id) {
    const dlg = document.getElementById('dlg');
    const titleEl = document.getElementById('dlg-title');
    dlg.returnValue = '';
    dlg.showModal();
    const editing = screenings.find(s => s.id === id) || null;
    titleEl.textContent = editing ? 'Edit screening' : 'Add screening';
    document.getElementById('movieId').value = editing?.movieId || movies[0]?.id || '';
    document.getElementById('auditorium').value = editing?.auditorium || '';
    document.getElementById('price').value = editing?.price ?? '';
    document.getElementById('time').value = editing ? toLocal(editing.time) : '';

    document.getElementById('form').onsubmit = (e) => {
      e.preventDefault();
      const s = {
        id: editing?.id || crypto.randomUUID(),
        movieId: document.getElementById('movieId').value,
        auditorium: document.getElementById('auditorium').value.trim(),
        time: new Date(document.getElementById('time').value).toISOString(),
        price: Number(document.getElementById('price').value),
      };
      upsertScreening(s);
      dlg.close();
      renderAdminScreenings();
    };
  }

  function doDelete(id) {
    if (!confirm('Delete this screening?')) return;
    deleteScreening(id);
    renderAdminScreenings();
  }
}

function row(s, movies) {
  const movie = movies.find(m => m.id === s.movieId);
  return `
    <tr class="odd:bg-white/5">
      <td class="px-3 py-2 font-medium">${movie?.title || s.movieId}</td>
      <td class="px-3 py-2">${s.auditorium}</td>
      <td class="px-3 py-2">${new Date(s.time).toLocaleString()}</td>
      <td class="px-3 py-2">$${s.price.toFixed(2)}</td>
      <td class="px-3 py-2 space-x-2">
        <button data-edit="${s.id}" class="btn px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs">Edit</button>
        <button data-delete="${s.id}" class="btn px-3 py-1.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-100">Delete</button>
      </td>
    </tr>
  `;
}

function toLocal(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}
