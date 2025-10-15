import { renderHome } from '../../views/home.js';
import { renderMovies } from '../../views/movies.js';
import { renderMovieDetail } from '../../views/movieDetail.js';
import { renderBooking } from '../../views/booking.js';
import { renderCheckout } from '../../views/checkout.js';
import { renderDashboard } from '../../views/dashboard.js';
import { renderSignin, renderSignup } from '../../views/auth.js';

const routes = [
  { path: /^#\/$|^$/, action: () => renderHome() },
  { path: /^#\/movies$/, action: () => renderMovies() },
  { path: /^#\/movie\/(\w+)$/, action: (id) => renderMovieDetail(id) },
  { path: /^#\/book\/(\w+)$/, action: (screeningId) => renderBooking(screeningId) },
  { path: /^#\/checkout$/, action: () => renderCheckout() },
  { path: /^#\/dashboard$/, action: () => renderDashboard() },
  { path: /^#\/signin$/, action: () => renderSignin() },
  { path: /^#\/signup$/, action: () => renderSignup() },
];

function matchRoute(hash) {
  for (const r of routes) {
    const m = hash.match(r.path);
    if (m) return { action: r.action, params: m.slice(1) };
  }
  return { action: () => renderHome(), params: [] };
}

function animateEnter(container) {
  container.classList.add('page-enter');
  requestAnimationFrame(() => {
    container.classList.add('page-enter-active');
    container.addEventListener('transitionend', () => {
      container.classList.remove('page-enter', 'page-enter-active');
    }, { once: true });
  });
}

export function initRouter() {
  const app = document.getElementById('app');
  if (!app) throw new Error('App container not found');

  const handle = () => {
    const { action, params } = matchRoute(location.hash);
    app.innerHTML = '';
    action(...params);
    animateEnter(app);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('hashchange', handle);
  handle();
}
