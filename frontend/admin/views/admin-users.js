import { listStaff, upsertStaff, deleteStaff } from '../../assets/js/data.js';

export function renderAdminUsers() {
  const app = document.getElementById('admin-app');
  const staff = listStaff();
  app.innerHTML = `
    <div class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-semibold">Staff</h1>
      <button id="add" class="btn px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600">Add staff</button>
    </div>

    <div class="mt-6 overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Name</th>
            <th class="px-3 py-2">Email</th>
            <th class="px-3 py-2">Role</th>
            <th class="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${staff.map(row).join('')}
        </tbody>
      </table>
    </div>

    <dialog id="dlg" class="rounded-xl bg-slate-900 text-slate-100 p-0 w-full max-w-xl">
      <form id="form" method="dialog">
        <div class="p-5 border-b border-white/10">
          <h2 id="dlg-title" class="text-lg font-semibold">Add staff</h2>
        </div>
        <div class="p-5 grid gap-3">
          <input id="name" required placeholder="Name" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
          <input id="email" type="email" required placeholder="Email" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
          <input id="password" type="password" placeholder="Password (set or change)" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10" />
          <select id="role" class="px-3 py-2 rounded-md bg-black/30 ring-1 ring-white/10">
            <option value="admin">Admin</option>
            <option value="seller">Ticket Seller</option>
            <option value="control">Controller</option>
            <option value="accounting">Accounting</option>
          </select>
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
    const editing = staff.find(s => s.id === id) || null;
    titleEl.textContent = editing ? 'Edit staff' : 'Add staff';
    document.getElementById('name').value = editing?.name || '';
    document.getElementById('email').value = editing?.email || '';
    document.getElementById('password').value = '';
    document.getElementById('role').value = editing?.role || 'seller';

    document.getElementById('form').onsubmit = (e) => {
      e.preventDefault();
      const s = {
        id: editing?.id || crypto.randomUUID(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        role: document.getElementById('role').value,
      };
      const pwd = document.getElementById('password').value;
      upsertStaff(s, pwd || undefined);
      dlg.close();
      renderAdminUsers();
    };
  }

  function doDelete(id) {
    if (!confirm('Delete this staff account?')) return;
    deleteStaff(id);
    renderAdminUsers();
  }
}

function row(s) {
  return `
    <tr class="odd:bg-white/5">
      <td class="px-3 py-2 font-medium">${s.name}</td>
      <td class="px-3 py-2">${s.email}</td>
      <td class="px-3 py-2">${s.role}</td>
      <td class="px-3 py-2 space-x-2">
        <button data-edit="${s.id}" class="btn px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs">Edit</button>
        <button data-delete="${s.id}" class="btn px-3 py-1.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-100">Delete</button>
      </td>
    </tr>
  `;
}
