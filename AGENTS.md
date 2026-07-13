# iSoko Rwanda

Bilingual (English/Kinyarwanda) online marketplace. Single Node.js process (`server.js`) serves both the JSON API and the static frontend in `public/`. See `README.md` for the product overview, API reference, and env vars.

## Cursor Cloud specific instructions

- **Zero npm dependencies, no build step.** The app uses only Node.js built-ins (Node 18+; Node 22 is present). There is nothing to compile and no `node_modules` to install; the update script's `npm install` is effectively a no-op safety net.
- **Run it:** `npm run dev` (auto-reload via `node --watch`) or `npm start`. Everything (API + static pages) is served on `http://localhost:3000`. Health check: `GET /api/meta`.
- **No lint or automated tests exist** in this repo — there are no `lint`/`test` npm scripts and no test framework. Verify changes by running the server and exercising the UI/API.
- **Storage is file-based JSON** under `data/` (gitignored): `data/db.json` + `data/responses.jsonl`, uploads in `data/uploads`. To reset all state, stop the server and delete the `data/` directory, then restart.
- **First boot seeds a platform admin** (`admin@isoko.rw`) and prints a random password to the console unless `ADMIN_PASSWORD` is set. Grab it from server logs to log into `/platform-admin.html`.
- **Demo data seeder must run against a LIVE server:** `node scripts/seed-demo.js` seeds ~30 shops via HTTP API calls, so start the server first. Demo owner logins use password `demo1234`.
- **API request fields are camelCase** (e.g. `shopId`, `productId`) even though some response fields are snake_case (e.g. `platform_fee`). Registration requires `name`, `email`, and `phone`; password must be ≥6 chars.
- **Full-UI rendering (map pins, fonts) needs outbound internet** (Leaflet/OpenStreetMap tiles + Google Fonts via CDN). The app and API still function without it.
