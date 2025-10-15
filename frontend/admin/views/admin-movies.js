import { listMovies, getMovie, upsertMovie, deleteMovie } from '../../assets/js/data.js';

export function renderAdminMovies() {
  const app = document.getElementById('admin-app');
  const movies = listMovies();
  app.innerHTML = `
    <div class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-semibold">Movies</h1>
      <button id="add" class="btn px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600">Add movie</button>
    </div>

    <div class="mt-6 overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Title</th>
            <th class="px-3 py-2">Status</th>
            <th class="px-3 py-2">Runtime</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${movies.map(row).join('')}
        </tbody>
      </table>
    </div>

    <dialog id="dlg" class="rounded-xl bg-slate-900 text-slate-100 p-0 w-full max-w-xl">
      <form id="form" method="dialog">
        <div class="p-5 border-b border-white/10">
          <h2 id="dlg-title" class="text-lg font-semibold">Add movie</h2>
        </div>
        <div class="p-5 grid gap-3">
          <input id="title" required placeholder="Title" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
          <textarea id="synopsis" required placeholder="Synopsis" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10"></textarea>
          <div class="grid grid-cols-2 gap-3">
            <input id="runtime" type="number" required placeholder="Runtime (min)" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
            <select id="status" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10">
              <option value="now">Now Showing</option>
              <option value="soon">Coming Soon</option>
            </select>
          </div>
          <input id="poster" placeholder="Poster URL" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
          <input id="trailer" placeholder="Trailer embed URL" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
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
    const editing = id ? getMovie(id) : null;
    titleEl.textContent = editing ? 'Edit movie' : 'Add movie';
    document.getElementById('title').value = editing?.title || '';
    document.getElementById('synopsis').value = editing?.synopsis || '';
    document.getElementById('runtime').value = editing?.runtime || '';
    document.getElementById('status').value = editing?.status || 'now';
    document.getElementById('poster').value = editing?.poster || '';
    document.getElementById('trailer').value = editing?.trailer || '';

    document.getElementById('form').onsubmit = (e) => {
      e.preventDefault();
      const m = {
        id: editing?.id || crypto.randomUUID(),
        title: document.getElementById('title').value.trim(),
        synopsis: document.getElementById('synopsis').value.trim(),
        runtime: Number(document.getElementById('runtime').value),
        status: document.getElementById('status').value,
        poster: document.getElementById('poster').value.trim() || `https://picsum.photos/seed/${Math.random().toString(36).slice(2,7)}/600/900`,
        trailer: document.getElementById('trailer').value.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      };
      upsertMovie(m);
      dlg.close();
      renderAdminMovies();
    };
  }

  function doDelete(id) {
    if (!confirm('Delete this movie?')) return;
    deleteMovie(id);
    renderAdminMovies();
  }
}

function row(m) {
  return `
    <tr class="odd:bg-white/5">
      <td class="px-3 py-2 font-medium">${m.title}</td>
      <td class="px-3 py-2">${m.status}</td>
      <td class="px-3 py-2">${m.runtime} min</td>
      <td class="px-3 py-2 space-x-2">
        <button data-edit="${m.id}" class="btn px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs">Edit</button>
        <button data-delete="${m.id}" class="btn px-3 py-1.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-100">Delete</button>
      </td>
    </tr>
  `;
}
