// Demo seed data and simple data helpers using localStorage

const LS_KEYS = {
  movies: 'cm_movies',
  screenings: 'cm_screenings',
  orders: 'cm_orders',
  cart: 'cm_cart',
  seatConfig: 'cm_seat_config',
  staff: 'cm_staff',
};

export function seedDemoData() {
  if (!localStorage.getItem(LS_KEYS.movies)) {
    const movies = [
      {
        id: 'mv1',
        title: 'Starlight Odyssey',
        synopsis: 'A crew ventures beyond known space in search of a lost colony.',
        runtime: 128,
        trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        poster: 'https://picsum.photos/seed/mv1/600/900',
        status: 'now',
      },
      {
        id: 'mv2',
        title: 'Shadows of Dawn',
        synopsis: 'A detective faces the ghosts of his past in a neon city.',
        runtime: 102,
        trailer: 'https://www.youtube.com/embed/oHg5SJYRHA0',
        poster: 'https://picsum.photos/seed/mv2/600/900',
        status: 'now',
      },
      {
        id: 'mv3',
        title: 'Whispering Pines',
        synopsis: 'A summer coming-of-age tale set in a tranquil lakeside town.',
        runtime: 115,
        trailer: 'https://www.youtube.com/embed/9bZkp7q19f0',
        poster: 'https://picsum.photos/seed/mv3/600/900',
        status: 'soon',
      },
    ];
    localStorage.setItem(LS_KEYS.movies, JSON.stringify(movies));
  }

  if (!localStorage.getItem(LS_KEYS.screenings)) {
    const today = new Date();
    const add = (d, h) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + d, h, 0, 0).toISOString();
    const screenings = [
      { id: 'sc1', movieId: 'mv1', auditorium: 'A', time: add(0, 13), price: 8.5 },
      { id: 'sc2', movieId: 'mv1', auditorium: 'A', time: add(0, 19), price: 10.0 },
      { id: 'sc3', movieId: 'mv2', auditorium: 'B', time: add(1, 16), price: 9.0 },
      { id: 'sc4', movieId: 'mv2', auditorium: 'B', time: add(2, 20), price: 11.0 },
    ];
    localStorage.setItem(LS_KEYS.screenings, JSON.stringify(screenings));
  }

  if (!localStorage.getItem(LS_KEYS.orders)) {
    localStorage.setItem(LS_KEYS.orders, JSON.stringify([]));
  }

  if (!localStorage.getItem(LS_KEYS.seatConfig)) {
    const rows = 7, cols = 12;
    const types = [];
    localStorage.setItem(LS_KEYS.seatConfig, JSON.stringify({ rows, cols, types }));
  }
}

export function ensureAdminSeed() {
  if (!localStorage.getItem(LS_KEYS.staff)) {
    const admin = { id: 'staff-admin', name: 'Admin', email: 'admin@cinema.local', role: 'admin', password: 'admin' };
    localStorage.setItem(LS_KEYS.staff, JSON.stringify([admin]));
  }
}

export function listMovies() {
  return JSON.parse(localStorage.getItem(LS_KEYS.movies) || '[]');
}

export function getMovie(id) {
  return listMovies().find(m => m.id === id) || null;
}

export function upsertMovie(movie) {
  const movies = listMovies();
  const idx = movies.findIndex(m => m.id === movie.id);
  if (idx >= 0) movies[idx] = movie; else movies.push(movie);
  localStorage.setItem(LS_KEYS.movies, JSON.stringify(movies));
}

export function deleteMovie(id) {
  const movies = listMovies().filter(m => m.id !== id);
  localStorage.setItem(LS_KEYS.movies, JSON.stringify(movies));
}

export function listScreenings() {
  return JSON.parse(localStorage.getItem(LS_KEYS.screenings) || '[]');
}

export function listScreeningsByMovie(movieId) {
  return listScreenings().filter(s => s.movieId === movieId);
}

export function getScreening(id) {
  return listScreenings().find(s => s.id === id) || null;
}

export function upsertScreening(screening) {
  const screens = listScreenings();
  const idx = screens.findIndex(s => s.id === screening.id);
  if (idx >= 0) screens[idx] = screening; else screens.push(screening);
  localStorage.setItem(LS_KEYS.screenings, JSON.stringify(screens));
}

export function deleteScreening(id) {
  const screens = listScreenings().filter(s => s.id !== id);
  localStorage.setItem(LS_KEYS.screenings, JSON.stringify(screens));
}

export function getSeatConfig() {
  return JSON.parse(localStorage.getItem(LS_KEYS.seatConfig) || '{"rows":7,"cols":12,"types":[]}');
}

export function setSeatConfig(cfg) {
  localStorage.setItem(LS_KEYS.seatConfig, JSON.stringify(cfg));
}

export function getCart() {
  return JSON.parse(localStorage.getItem(LS_KEYS.cart) || 'null');
}

export function setCart(cart) {
  if (cart) localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart));
  else localStorage.removeItem(LS_KEYS.cart);
}

export function listOrdersByUser(userId) {
  return JSON.parse(localStorage.getItem(LS_KEYS.orders) || '[]').filter(o => o.userId === userId);
}

export function listAllOrders() {
  return JSON.parse(localStorage.getItem(LS_KEYS.orders) || '[]');
}

export function upsertOrder(order) {
  const orders = JSON.parse(localStorage.getItem(LS_KEYS.orders) || '[]');
  const idx = orders.findIndex(o => o.id === order.id);
  if (idx >= 0) orders[idx] = order; else orders.push(order);
  localStorage.setItem(LS_KEYS.orders, JSON.stringify(orders));
}

export function generateTicketCode() {
  return 'TKT-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Staff management
export function listStaff() {
  return JSON.parse(localStorage.getItem(LS_KEYS.staff) || '[]');
}

export function upsertStaff(staff, passwordMaybe) {
  const list = listStaff();
  const idx = list.findIndex(s => s.id === staff.id);
  const record = { ...staff };
  if (passwordMaybe) record.password = passwordMaybe;
  if (idx >= 0) list[idx] = { ...list[idx], ...record }; else list.push({ ...record, password: record.password || 'password' });
  localStorage.setItem(LS_KEYS.staff, JSON.stringify(list));
}

export function deleteStaff(id) {
  const list = listStaff().filter(s => s.id !== id);
  localStorage.setItem(LS_KEYS.staff, JSON.stringify(list));
}
