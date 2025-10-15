import { getMovie, listScreeningsByMovie } from '../assets/js/data.js';

export function renderMovieDetail(movieId) {
  const app = document.getElementById('app');
  const movie = getMovie(movieId);
  if (!movie) {
    app.innerHTML = `<div class="text-slate-400">Movie not found.</div>`;
    return;
  }
  const screenings = listScreeningsByMovie(movie.id);

  app.innerHTML = `
    <div class="grid md:grid-cols-3 gap-8">
      <div class="md:col-span-2">
        <div class="aspect-video rounded-xl overflow-hidden ring-1 ring-white/10 bg-black card-hover">
          <iframe class="w-full h-full" src="${movie.trailer}" title="Trailer" frameborder="0" allowfullscreen></iframe>
        </div>
        <h1 class="mt-6 text-2xl md:text-3xl font-semibold">${movie.title}</h1>
        <p class="mt-3 text-slate-300 md:text-lg max-w-prose">${movie.synopsis}</p>
        <p class="mt-2 text-slate-400">Runtime: ${movie.runtime} min</p>
      </div>
      <aside class="md:col-span-1">
        <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
          <h2 class="font-medium">Showtimes</h2>
          <div class="mt-3 space-y-3">
            ${screenings.map(s => `
              <a href="#/book/${s.id}" class="block rounded-lg p-3 bg-white/5 hover:bg-white/10 transition ring-1 ring-white/10 card-hover">
                <div class="flex items-center justify-between">
                  <span>${formatDateTime(s.time)}</span>
                  <span class="text-brand-300 font-medium">$${s.price.toFixed(2)}</span>
                </div>
                <div class="text-sm text-slate-400">Auditorium ${s.auditorium}</div>
              </a>
            `).join('') || '<div class="text-slate-400">No showtimes available.</div>'}
          </div>
        </div>
      </aside>
    </div>
  `;
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
