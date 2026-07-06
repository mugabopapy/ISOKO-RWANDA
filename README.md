# iSoko Rwanda

iSoko Rwanda is an **online marketplace platform** where **shop owners register their shop on a map with their inventory**, and **customers browse, order, and pay**. A bilingual feedback survey is included as a secondary page for collecting user input.

Everything is bilingual: **English ⇄ Kinyarwanda** toggle on every page.

## Categories

Pharmacy 💊 · Food shop 🍎 · Furniture 🛋️ · Electronics 📱 · Clothes 👗 · Shoes 👟 · Landlord & rentals 🏠 · Gym & fitness 🏋️ · Sports coaching ⚽ · Tutors & lessons 📚 · Other 🛍️

## Revenue model (built in)

| Stream | Rule |
| --- | --- |
| Transaction fee | **4%** deducted automatically from each **completed** order — the order breakdown shows the fee and what the shop receives |
| Registration / listing fee | **5,000 RWF/month** per shop — **first month completely free** (every new shop gets a 30-day free period, shown in their dashboard) |
| Basic browsing & signup | Free for customers |

The platform admin dashboard shows GMV, collected transaction-fee revenue, and monthly listing revenue (shops in the free month are counted separately).

## The platform

- **Browse** (`/`) — search + category chips + **live map** (Leaflet/OpenStreetMap, no API key needed). Shops appear as pins; with location permission, results sort by distance.
- **Shop page** (`/shop.html?id=…`) — real inventory with prices and stock, cart, and checkout with **Mobile Money** (payment flow is simulated for the MVP; funds are "held" and released to the shop when the order is completed).
- **Owner dashboard** (`/dashboard.html`) — register shops (tap the map to pin the exact location), manage inventory (products, services, rentals, sessions — leave stock empty for unlimited/services), and process orders: confirm → complete (or cancel; stock is restored).
- **Customer orders** (`/orders.html`) — track order status, cancel while pending.
- **Platform admin** (`/platform-admin.html`) — totals, GMV, fee revenue, listing revenue, every shop with billing status, recent orders. Log in with the admin account.
- **Feedback** (`/survey.html`) — bilingual customer/shop-owner feedback survey, with its own admin at `/survey-admin.html` and CSV export.

## Run it

Requires Node.js 18+. Zero dependencies — no `npm install` needed.

```bash
npm start
```

- iSoko platform: http://localhost:3000
- Feedback survey: http://localhost:3000/survey.html

On first boot the server seeds a platform admin account (`admin@isoko.rw`) and prints its password. Configure with env vars:

| Var | Purpose |
| --- | --- |
| `PORT` | HTTP port (default 3000) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Platform admin account (seeded on first boot) |
| `ADMIN_KEY` | Protects the survey admin endpoints |

### Demo data

With the server running:

```bash
node scripts/seed-demo.js
```

Seeds 10 shops across Kigali (one per category) with realistic inventory. Demo owner logins: `alice@demo.rw` … `olivier@demo.rw`, password `demo1234`.

## Put it online (no coding tools needed)

You do not need VS Code or any programming tools — only a web browser. The easiest way is Render (free plan available):

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/mugabopapy/ISOKO-RWANDA)

1. Click the button above (works on a phone too).
2. Sign up on Render free of charge — choosing **"Sign in with GitHub"** is easiest.
3. Render reads this repository's `render.yaml` automatically. It will ask you to type an **ADMIN_PASSWORD** — choose a strong password; this is how you will log in as the platform admin.
4. Click **Apply / Deploy**. After 1–2 minutes your platform is live at an address like `https://isoko-rwanda.onrender.com`.
5. Open that address — that is your live iSoko. Share this link with shop owners and customers.
6. To manage the platform, open `/auth.html` on your live site and log in with `admin@isoko.rw` and the password you chose, then open **Admin** in the menu.

The deployment starts with 10 demo shops so the map looks alive. To launch clean, set the `SEED_DEMO` environment variable to `false` in Render before deploying (or delete the demo shops from the admin later).

**Important (free plan limits):** on Render's free plan the app falls asleep after 15 minutes without visitors (the first visit after that takes ~1 minute to wake up), and stored data can be lost when the service restarts. When you have real users, upgrade the service ($7/month) and attach a **persistent disk** mounted at `/opt/render/project/src/data` so shops and orders are stored permanently.

Any other Node.js host also works (Railway, Fly.io, a VPS — a `Dockerfile` is included). Persist the `data/` directory and set `ADMIN_PASSWORD` and `ADMIN_KEY`.

## API overview

| Method | Path | Who | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` `/api/auth/login` `/api/auth/logout` | public | Accounts (customer or owner) |
| GET | `/api/me`, `/api/meta` | public | Session + platform config (fees, categories) |
| GET | `/api/shops?category=&q=` | public | Browse/search shops (map data included) |
| GET | `/api/shops/:id` | public | Shop detail + inventory |
| POST/PUT/DELETE | `/api/shops`, `/api/shops/:id` | owner | Register / edit / remove a shop |
| GET | `/api/my/shops` | owner | Own shops with billing status (free month) |
| POST/PUT/DELETE | `/api/shops/:id/products`, `/api/products/:id` | owner | Inventory management |
| POST | `/api/orders` | customer | Place an order (validates stock, computes 4% fee) |
| GET | `/api/my/orders`, `/api/shops/:id/orders` | customer / owner | Track orders |
| POST | `/api/orders/:id/status` | owner / customer | pending → confirmed → completed, or cancel (stock restored) |
| GET | `/api/admin/overview` | admin | Platform totals, fee revenue, shops, recent orders |
| POST | `/api/responses` + feedback admin endpoints | public / `ADMIN_KEY` | Bilingual feedback survey |

## Storage

Zero-setup JSON storage: marketplace data in `data/db.json`, survey responses in `data/responses.jsonl`. Passwords are hashed with scrypt; sessions are bearer tokens. For scale, the storage layer is small and isolated in `server.js`, ready to swap for Postgres/SQLite later.
