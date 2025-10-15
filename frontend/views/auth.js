import { signIn, signUp } from '../assets/js/auth.js';

export function renderSignin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="max-w-md mx-auto rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
      <h1 class="text-2xl md:text-3xl font-semibold">Sign in</h1>
      <form id="form" class="mt-5 grid gap-3">
        <input id="email" type="email" required placeholder="Email" class="px-3 py-2.5 rounded-md bg-black/30 ring-1 ring-white/10" />
        <input id="password" type="password" required placeholder="Password" class="px-3 py-2.5 rounded-md bg-black/30 ring-1 ring-white/10" />
        <button class="btn mt-2 px-4 py-2.5 rounded-md bg-brand-500 hover:bg-brand-600">Sign in</button>
      </form>
      <p class="mt-4 text-sm text-slate-400">No account? <a href="#/signup" class="text-brand-300 underline">Sign up</a></p>
    </div>
  `;
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const res = signIn(email, password);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    location.hash = '#/dashboard';
  });
}

export function renderSignup() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="max-w-md mx-auto rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
      <h1 class="text-2xl md:text-3xl font-semibold">Create account</h1>
      <form id="form" class="mt-5 grid gap-3">
        <input id="name" required placeholder="Name" class="px-3 py-2.5 rounded-md bg-black/30 ring-1 ring-white/10" />
        <input id="email" type="email" required placeholder="Email" class="px-3 py-2.5 rounded-md bg-black/30 ring-1 ring-white/10" />
        <input id="password" type="password" required placeholder="Password" class="px-3 py-2.5 rounded-md bg-black/30 ring-1 ring-white/10" />
        <button class="btn mt-2 px-4 py-2.5 rounded-md bg-brand-500 hover:bg-brand-600">Sign up</button>
      </form>
      <p class="mt-4 text-sm text-slate-400">Already have an account? <a href="#/signin" class="text-brand-300 underline">Sign in</a></p>
    </div>
  `;
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const res = signUp(name, email, password);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    location.hash = '#/dashboard';
  });
}
