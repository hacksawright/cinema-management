import { initAdminRouter } from './admin-router.js';
import { ensureAdminSeed } from '../../../assets/js/data.js';

function guard() {
  // Simple guard: allow if a staff is signed in (reuse user auth but check role)
  const raw = localStorage.getItem('cm_auth_user');
  const user = raw ? JSON.parse(raw) : null;
  if (!user) {
    location.href = '/frontend/index.html#/signin';
    return false;
  }
  const staff = (JSON.parse(localStorage.getItem('cm_staff') || '[]')).find(u => u.id === user.id);
  if (!staff) {
    alert('Admin access only');
    location.href = '/frontend/index.html#/';
    return false;
  }
  return true;
}

function bootstrap() {
  ensureAdminSeed();
  if (!guard()) return;
  initAdminRouter();
}

bootstrap();
