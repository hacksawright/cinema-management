# Cinema – Frontend (Vanilla JS + Tailwind)

Modern, responsive movie ticketing UI built with plain HTML, CSS (Tailwind via CDN), and vanilla JavaScript. Includes a Client site for users to browse and buy tickets, and an Admin site for cinema staff to manage movies, screenings, seats, orders, tickets, and transactions.

## Features

### Client (User)
- Browse movies: Now Showing / Coming Soon
- Movie details: synopsis, trailer, runtime, showtimes
- Seat booking: interactive map with real-time totals
- Checkout (demo): Cash / Bank Transfer; ticket code generation
- Accounts: Sign up / Sign in / Sign out
- Dashboard: purchase history, pending (saved) orders, resume payment

### Admin
- Movies: add/edit/delete, status (now/soon)
- Screenings: assign movie, auditorium, datetime, price
- Seat map: global seat types (Normal / VIP / Couple)
- Tickets: view ticket codes and statuses
- Orders: list and update statuses (paid/processing/canceled)
- Transactions: per-transaction list and daily revenue summary
- Staff: add/edit/delete staff with roles (admin/seller/control/accounting)

## Tech stack
- HTML + TailwindCSS (CDN)
- Vanilla JavaScript modules
- Hash-based router (simple SPA)
- `localStorage` as demo persistence (no backend required)

## Project structure
```
frontend/
  index.html                    # Client entry
  admin/index.html              # Admin entry
  assets/
    css/app.css                # Small enhancements (transitions, focus)
    js/
      app.js                   # Client bootstrap
      router.js                # Client router
      data.js                  # Demo data + CRUD helpers (shared)
      auth.js                  # Client auth helpers
  views/                        # Client views
    home.js, movies.js, movieDetail.js
    booking.js, checkout.js, dashboard.js, auth.js
  admin/
    assets/js/
      admin-app.js             # Admin bootstrap + guard
      admin-router.js          # Admin router
    views/                     # Admin views
      admin-movies.js, admin-screenings.js, admin-seats.js
      admin-tickets.js, admin-orders.js, admin-transactions.js, admin-users.js
```

## Getting started

### Option 1: Open directly
- Open `frontend/index.html` in your browser (file URL). Some browsers restrict `file://` for modules; if you see issues, use a local server.

### Option 2: Run a simple local server
```bash
cd <repo-root>
python3 -m http.server 5173
# Client:   http://localhost:5173/frontend/index.html
# Admin:    http://localhost:5173/frontend/admin/index.html
```

## Demo data and accounts
- Data is seeded on first load and stored in `localStorage`.
- Storage keys used:
  - `cm_movies`, `cm_screenings`, `cm_orders`, `cm_cart`, `cm_users`
  - `cm_seat_config`, `cm_staff`
- Admin seed user (sign in on Client, then open Admin):
  - Email: `admin@cinema.local`
  - Password: `admin`

## Usage
- Client flow: Movies → select showtime → pick seats → Checkout → Pay → Dashboard
- Pending orders: choose “Save for later” on checkout, then “Resume payment” in Dashboard.
- Admin access guard: requires a signed-in user whose id exists in `cm_staff`.

## Customization
- Colors/brand: adjust the small Tailwind config in `frontend/index.html` and `frontend/admin/index.html`.
- Animations/focus: tweak `frontend/assets/css/app.css`.
- Seat map size/types: update `getSeatConfig` defaults in `frontend/assets/js/data.js` and Admin → Seats.

## Notes
- This is a demo-only frontend; payments and persistence are simulated locally.
- To integrate a real backend, replace calls in `frontend/assets/js/data.js` with API requests and remove localStorage seeding.

## Accessibility
- Focus-visible styles are enabled.
- Keyboard navigation supported; further improvements welcome (labels, ARIA for complex widgets).

## License
MIT (or your preferred license).
