# iSoko Rwanda — Marketplace Platform

A web-based marketplace where **shop owners register their shop on a map with their inventory**, and **customers browse, order, and pay** — plus the original bilingual market-validation **survey**.

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
- **Survey** (`/survey.html`) — the bilingual customer/shop-owner survey, with its own admin at `/survey-admin.html` and CSV export.

## Run it

Requires Node.js 18+. Zero dependencies — no `npm install` needed.

```bash
npm start
```

- Marketplace: http://localhost:3000
- Survey: http://localhost:3000/survey.html

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

### Deploy

Any Node host works (Render, Railway, Fly.io, a VPS). Persist the `data/` directory (volume) so users, shops and orders survive restarts. Set `ADMIN_PASSWORD` and `ADMIN_KEY`.

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
| POST | `/api/responses` + survey admin endpoints | public / `ADMIN_KEY` | Bilingual survey (unchanged) |

## Storage

Zero-setup JSON storage: marketplace data in `data/db.json`, survey responses in `data/responses.jsonl`. Passwords are hashed with scrypt; sessions are bearer tokens. For scale, the storage layer is small and isolated in `server.js`, ready to swap for Postgres/SQLite later.
