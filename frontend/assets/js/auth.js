const AUTH_KEY = 'cm_auth_user';

export function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function signIn(email, password) {
  const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, message: 'Invalid credentials' };
  localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name }));
  updateNavAuth();
  return { ok: true };
}

export function signUp(name, email, password) {
  const users = JSON.parse(localStorage.getItem('cm_users') || '[]');
  if (users.some(u => u.email === email)) {
    return { ok: false, message: 'Email already registered' };
  }
  const user = { id: crypto.randomUUID(), name, email, password };
  users.push(user);
  localStorage.setItem('cm_users', JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name }));
  updateNavAuth();
  return { ok: true };
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY);
  updateNavAuth();
}

export function updateNavAuth() {
  const user = getCurrentUser();
  const signInLink = document.getElementById('nav-auth');
  const signOutBtn = document.getElementById('nav-signout');
  if (user) {
    if (signInLink) {
      signInLink.textContent = user.name || user.email;
      signInLink.href = '#/dashboard';
      signInLink.classList.remove('bg-brand-500/20','text-brand-200');
    }
    if (signOutBtn) {
      signOutBtn.classList.remove('hidden');
      signOutBtn.onclick = () => { signOut(); location.hash = '#/'; };
    }
  } else {
    if (signInLink) {
      signInLink.textContent = 'Sign in';
      signInLink.href = '#/signin';
      signInLink.classList.add('bg-brand-500/20','text-brand-200');
    }
    if (signOutBtn) {
      signOutBtn.classList.add('hidden');
      signOutBtn.onclick = null;
    }
  }
}
