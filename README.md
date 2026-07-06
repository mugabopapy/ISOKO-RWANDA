# iSoko Rwanda — Market Validation Survey

Bilingual (English / Kinyarwanda) survey to collect feedback from **customers** and **shop owners** before building the iSoko marketplace platform.

This is step one of the iSoko roadmap: validate demand and pricing with real users in Kigali, then build the MVP with that data in hand.

## What's inside

- **Survey app** (`/`) — mobile-first, works on any phone browser:
  - Language toggle: English ⇄ Kinyarwanda (every question, option, and button is translated)
  - Two tracks: 10 questions for customers, 11 for shop owners
  - Questions cover the core assumptions in the business layout: stock visibility, map discovery, Mobile Money payments, the 3–5% transaction fee, and the premium visibility subscription
  - Optional contact details for early-access follow-up
- **Admin dashboard** (`/admin.html`) — response totals, per-question answer breakdowns, full response table, and one-click **CSV export** (UTF-8 with BOM, opens cleanly in Excel — ready to share with investors)
- **Server** (`server.js`) — zero-dependency Node.js. Responses stored as JSON lines in `data/responses.jsonl` (no database setup required)

## Run it

Requires Node.js 18+. No `npm install` needed — there are no dependencies.

```bash
npm start
```

- Survey: http://localhost:3000
- Admin: http://localhost:3000/admin.html

### Protect the admin dashboard (recommended for production)

```bash
ADMIN_KEY=your-secret npm start
```

Then open `http://localhost:3000/admin.html?key=your-secret`. The API endpoints (`/api/responses`, `/api/stats`, `/api/export.csv`) require the same key.

### Deploy

Any host that runs Node works (Render, Railway, Fly.io, a VPS). Set `PORT` and `ADMIN_KEY` env vars. The `data/` directory must be persistent (use a volume) so responses survive restarts.

## API

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/responses` | Submit a survey response |
| GET | `/api/responses` | List all responses (admin) |
| GET | `/api/stats` | Aggregated counts by role, language, and answer (admin) |
| GET | `/api/export.csv` | Download all responses as CSV (admin) |

Answer option values are stored as stable English slugs regardless of the language the respondent used, so English and Kinyarwanda responses aggregate together in the stats and CSV.

## Editing questions or translations

All survey content lives in one file: `public/i18n.js`. Each question has an `id`, a `type` (`single`, `multi`, or `text`), and `en`/`rw` labels. Add or edit questions there — no other code changes needed.
