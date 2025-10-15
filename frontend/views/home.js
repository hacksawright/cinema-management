import { listMovies } from '../assets/js/data.js';

export function renderHome() {
  const app = document.getElementById('app');
  const movies = listMovies();
  const now = movies.filter(m => m.status === 'now');
  const soon = movies.filter(m => m.status === 'soon');

  app.innerHTML = `
    <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-soft ring-1 ring-white/10">
      <div class="p-8 md:p-12 lg:p-16 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 class="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">Book movie tickets in minutes</h1>
          <p class="mt-4 text-slate-300 md:text-lg max-w-prose">Browse showtimes, pick your seats on an intuitive map, and pay securely. A modern, fast experience on any device.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#/movies" class="btn inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 transition">Browse Movies</a>
            <a href="#/signup" class="btn inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/15">Create Account</a>
          </div>
        </div>
        <div class="relative">
          <div class="w-full aspect-[4/3] rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden card-hover">
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop" alt="Cinema" class="w-full h-full object-cover"/>
          </div>
          <div class="absolute -bottom-4 -left-4 hidden md:block w-32 h-32 bg-brand-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>

    <section class="mt-12 md:mt-16">
      <h2 class="text-xl md:text-2xl font-semibold">Now Showing</h2>
      <div class="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        ${now.map(card).join('') || empty('No current movies')}
      </div>
    </section>

    <section class="mt-12 md:mt-16">
      <h2 class="text-xl md:text-2xl font-semibold">Coming Soon</h2>
      <div class="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        ${soon.map(card).join('') || empty('No upcoming movies')}
      </div>
    </section>
  `;
}

function card(m) {
  return `
    <a href="#/movie/${m.id}" class="group block rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition card-hover">
      <div class="aspect-[2/3] overflow-hidden">
        <img src="${m.poster}" alt="${m.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
      </div>
      <div class="p-3">
        <h3 class="font-medium">${m.title}</h3>
      </div>
    </a>
  `;
}

function empty(text) {
  return `<div class="col-span-full text-slate-400">${text}</div>`;
}
