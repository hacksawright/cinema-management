import { initRouter } from './router.js';
import { updateNavAuth } from './auth.js';
import { seedDemoData } from './data.js';

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

async function bootstrap() {
  seedDemoData();
  setYear();
  updateNavAuth();
  initRouter();
}

bootstrap();
