import { listMovies } from '../assets/js/data.js';

export function renderMovies() {
  const app = document.getElementById('app');
  const movies = listMovies();

  app.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl md:text-3xl font-semibold">Movies</h1>
      <div class="inline-flex rounded-lg bg-white/5 p-1 ring-1 ring-white/10">
        <button data-filter="all" class="tab px-3 py-1.5 rounded-md bg-brand-500 text-white">All</button>
        <button data-filter="now" class="tab px-3 py-1.5 rounded-md">Now</button>
        <button data-filter="soon" class="tab px-3 py-1.5 rounded-md">Soon</button>
      </div>
    </div>
    <div id="grid" class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"></div>
  `;

  const grid = document.getElementById('grid');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const render = (filter) => {
    const list = movies.filter(m => filter === 'all' ? true : m.status === filter);
    grid.innerHTML = list.map(m => `
      <a href="#/movie/${m.id}" class="group block rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition card-hover">
        <div class="aspect-[2/3] overflow-hidden">
          <img src="${m.poster}" alt="${m.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
        </div>
        <div class="p-3">
          <h3 class="font-medium">${m.title}</h3>
        </div>
      </a>
    `).join('');
  };

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('bg-brand-500','text-white'));
    btn.classList.add('bg-brand-500','text-white');
    render(btn.dataset.filter);
  }));

  render('all');
}
