import { renderAdminMovies } from '../../views/admin-movies.js';
import { renderAdminScreenings } from '../../views/admin-screenings.js';
import { renderAdminSeats } from '../../views/admin-seats.js';
import { renderAdminTickets } from '../../views/admin-tickets.js';
import { renderAdminOrders } from '../../views/admin-orders.js';
import { renderAdminTransactions } from '../../views/admin-transactions.js';
import { renderAdminUsers } from '../../views/admin-users.js';

const routes = [
  { path: /^#\/$|^$/, action: () => renderAdminMovies() },
  { path: /^#\/movies$/, action: () => renderAdminMovies() },
  { path: /^#\/screenings$/, action: () => renderAdminScreenings() },
  { path: /^#\/seats$/, action: () => renderAdminSeats() },
  { path: /^#\/tickets$/, action: () => renderAdminTickets() },
  { path: /^#\/orders$/, action: () => renderAdminOrders() },
  { path: /^#\/transactions$/, action: () => renderAdminTransactions() },
  { path: /^#\/users$/, action: () => renderAdminUsers() },
];

function match(hash) {
  for (const r of routes) {
    const m = hash.match(r.path);
    if (m) return { action: r.action, params: m.slice(1) };
  }
  return { action: () => renderAdminMovies(), params: [] };
}

export function initAdminRouter() {
  const app = document.getElementById('admin-app');
  const handle = () => {
    const { action, params } = match(location.hash);
    app.innerHTML = '';
    action(...params);
    app.classList.add('page-enter');
    requestAnimationFrame(() => {
      app.classList.add('page-enter-active');
      app.addEventListener('transitionend', () => app.classList.remove('page-enter','page-enter-active'), { once: true });
    });
  };
  window.addEventListener('hashchange', handle);
  handle();
}
