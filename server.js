/**
 * iSoko Rwanda — Survey server
 *
 * Zero-dependency Node.js server that:
 *   - serves the bilingual survey app from /public
 *   - accepts survey responses (POST /api/responses)
 *   - exposes admin data: list (GET /api/responses), stats (GET /api/stats),
 *     CSV export (GET /api/export.csv)
 *
 * Responses are stored as JSON lines in data/responses.jsonl so the app runs
 * anywhere Node runs, with no database setup.
 *
 * Optional: set ADMIN_KEY to protect admin endpoints (pass as ?key=... or
 * X-Admin-Key header).
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'responses.jsonl');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const VALID_ROLES = new Set(['customer', 'shop_owner']);
const VALID_LANGS = new Set(['en', 'rw']);
// Free-text questions (see public/i18n.js) are excluded from choice aggregation.
const TEXT_QUESTIONS = new Set(['trust_text', 'customer_suggestions', 'best_feature', 'owner_concerns']);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_TEXT_LEN = 2000;

fs.mkdirSync(DATA_DIR, { recursive: true });

function readResponses() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return fs
    .readFileSync(DATA_FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function sanitizeValue(v) {
  if (typeof v === 'string') return v.slice(0, MAX_TEXT_LEN).trim();
  if (Array.isArray(v)) return v.slice(0, 20).map((x) => String(x).slice(0, 200));
  if (typeof v === 'number' || typeof v === 'boolean') return v;
  return '';
}

function sanitizeAnswers(answers) {
  const out = {};
  if (!answers || typeof answers !== 'object') return out;
  for (const [k, v] of Object.entries(answers)) {
    if (Object.keys(out).length >= 40) break;
    const key = String(k).slice(0, 60);
    out[key] = sanitizeValue(v);
  }
  return out;
}

function isAdminAuthorized(req, url) {
  if (!ADMIN_KEY) return true;
  const key = url.searchParams.get('key') || req.headers['x-admin-key'] || '';
  return key === ADMIN_KEY;
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function csvEscape(value) {
  let s = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  // Guard against spreadsheet formula injection in exported text answers.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function buildCsv(responses) {
  const metaCols = ['id', 'submitted_at', 'role', 'language', 'name', 'phone', 'district', 'contact_ok'];
  const answerKeys = [];
  for (const r of responses) {
    for (const k of Object.keys(r.answers || {})) {
      if (!answerKeys.includes(k)) answerKeys.push(k);
    }
  }
  const header = [...metaCols, ...answerKeys];
  const lines = [header.join(',')];
  for (const r of responses) {
    const row = [
      r.id,
      r.submitted_at,
      r.role,
      r.language,
      r.name || '',
      r.phone || '',
      r.district || '',
      r.contact_ok ? 'yes' : 'no',
      ...answerKeys.map((k) => (r.answers || {})[k] ?? ''),
    ];
    lines.push(row.map(csvEscape).join(','));
  }
  return lines.join('\r\n');
}

function buildStats(responses) {
  const stats = {
    total: responses.length,
    by_role: { customer: 0, shop_owner: 0 },
    by_language: { en: 0, rw: 0 },
    contact_ok: 0,
    answer_counts: {}, // question -> option -> count (choice questions only)
  };
  for (const r of responses) {
    if (stats.by_role[r.role] !== undefined) stats.by_role[r.role]++;
    if (stats.by_language[r.language] !== undefined) stats.by_language[r.language]++;
    if (r.contact_ok) stats.contact_ok++;
    for (const [q, a] of Object.entries(r.answers || {})) {
      if (TEXT_QUESTIONS.has(q)) continue;
      const values = Array.isArray(a) ? a : typeof a === 'string' && a.length <= 60 ? [a] : [];
      if (!values.length) continue;
      stats.answer_counts[q] = stats.answer_counts[q] || {};
      for (const v of values) {
        stats.answer_counts[q][v] = (stats.answer_counts[q][v] || 0) + 1;
      }
    }
  }
  return stats;
}

function handleSubmit(req, res) {
  let size = 0;
  const chunks = [];
  let aborted = false;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      aborted = true;
      sendJson(res, 413, { error: 'payload_too_large' });
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => {
    if (aborted) return;
    let payload;
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return sendJson(res, 400, { error: 'invalid_json' });
    }
    const role = String(payload.role || '');
    const language = String(payload.language || '');
    if (!VALID_ROLES.has(role)) return sendJson(res, 400, { error: 'invalid_role' });
    if (!VALID_LANGS.has(language)) return sendJson(res, 400, { error: 'invalid_language' });

    const record = {
      id: crypto.randomUUID(),
      submitted_at: new Date().toISOString(),
      role,
      language,
      name: sanitizeValue(payload.name).slice(0, 120),
      phone: sanitizeValue(payload.phone).slice(0, 30),
      district: sanitizeValue(payload.district).slice(0, 120),
      contact_ok: Boolean(payload.contact_ok),
      answers: sanitizeAnswers(payload.answers),
    };
    fs.appendFile(DATA_FILE, JSON.stringify(record) + '\n', (err) => {
      if (err) return sendJson(res, 500, { error: 'storage_error' });
      sendJson(res, 201, { ok: true, id: record.id });
    });
  });
}

function serveStatic(req, res, urlPath) {
  let filePath = urlPath === '/' ? '/index.html' : urlPath;
  filePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
  const absolute = path.join(PUBLIC_DIR, filePath);
  if (!absolute.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(absolute, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    const ext = path.extname(absolute).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = url.pathname;

  if (req.method === 'POST' && p === '/api/responses') return handleSubmit(req, res);

  if (req.method === 'GET' && (p === '/api/responses' || p === '/api/stats' || p === '/api/export.csv')) {
    if (!isAdminAuthorized(req, url)) return sendJson(res, 401, { error: 'unauthorized' });
    const responses = readResponses();
    if (p === '/api/responses') return sendJson(res, 200, { responses });
    if (p === '/api/stats') return sendJson(res, 200, buildStats(responses));
    const csv = buildCsv(responses);
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="isoko-survey-responses.csv"',
    });
    return res.end('\uFEFF' + csv); // BOM so Excel opens UTF-8 (Kinyarwanda text) correctly
  }

  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, p);

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method not allowed');
});

server.listen(PORT, () => {
  console.log(`iSoko survey running at http://localhost:${PORT}`);
  console.log(`Admin dashboard:       http://localhost:${PORT}/admin.html`);
  if (!ADMIN_KEY) console.log('Note: set ADMIN_KEY env var to protect admin endpoints.');
});
