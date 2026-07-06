/**
 * iSoko Rwanda — Marketplace platform server
 *
 * Zero-dependency Node.js server providing:
 *   - Marketplace API: auth, shops (pinned on map), inventory, orders,
 *     platform fees (transaction % + monthly listing fee, first month free)
 *   - Admin API for platform stats and fee revenue
 *   - The original bilingual survey (POST /api/responses + admin endpoints)
 *   - Static frontend from /public
 *
 * Storage: data/db.json (marketplace) and data/responses.jsonl (survey).
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || ''; // survey admin endpoints
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@isoko.rw';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SURVEY_FILE = path.join(DATA_DIR, 'responses.jsonl');
const PUBLIC_DIR = path.join(__dirname, 'public');

// ---- Business rules -------------------------------------------------------
const TRANSACTION_FEE_RATE = 0.04; // 4% of each completed order, paid by the shop
const MONTHLY_LISTING_FEE = 5000; // RWF per shop per month after the free period
const FREE_TRIAL_DAYS = 30; // first month free for every new shop

const CATEGORIES = [
  'pharmacy',
  'food',
  'furniture',
  'electronics',
  'clothes',
  'shoes',
  'rental', // landlords & rentals
  'gym',
  'coach', // sports coaching
  'tutor',
  'other',
];

const ORDER_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// ---- Store ----------------------------------------------------------------

fs.mkdirSync(DATA_DIR, { recursive: true });

let db = { users: [], sessions: {}, shops: [], products: [], orders: [] };
if (fs.existsSync(DB_FILE)) {
  try {
    db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
  } catch (e) {
    console.error('Could not parse db.json, starting fresh:', e.message);
  }
}

let saveTimer = null;
function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    fs.writeFile(DB_FILE, JSON.stringify(db, null, 1), (err) => {
      if (err) console.error('Failed to persist db:', err.message);
    });
  }, 50);
}

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ---- Passwords & sessions ---------------------------------------------------

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

function createSession(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = { userId, created_at: now() };
  save();
  return token;
}

function userFromRequest(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const session = db.sessions[token];
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) || null;
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}

// ---- Fee helpers ------------------------------------------------------------

function trialEndsAt(shop) {
  return new Date(new Date(shop.created_at).getTime() + FREE_TRIAL_DAYS * 24 * 3600 * 1000);
}
function shopBilling(shop) {
  const ends = trialEndsAt(shop);
  const inTrial = Date.now() < ends.getTime();
  return {
    free_trial: inTrial,
    trial_ends_at: ends.toISOString(),
    monthly_fee: inTrial ? 0 : MONTHLY_LISTING_FEE,
  };
}

// ---- Small HTTP helpers -----------------------------------------------------

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req, maxBytes = 256 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error('payload_too_large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(Object.assign(new Error('invalid_json'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

const str = (v, max = 300) => String(v ?? '').trim().slice(0, max);
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

function fail(status, error) {
  throw Object.assign(new Error(error), { status, apiError: error });
}

function requireUser(req) {
  const user = userFromRequest(req);
  if (!user) fail(401, 'not_logged_in');
  return user;
}

// ---- Serialization ----------------------------------------------------------

function shopSummary(shop) {
  return {
    id: shop.id,
    name: shop.name,
    category: shop.category,
    description: shop.description,
    phone: shop.phone,
    address: shop.address,
    lat: shop.lat,
    lng: shop.lng,
    created_at: shop.created_at,
    product_count: db.products.filter((p) => p.shopId === shop.id).length,
    completed_orders: db.orders.filter((o) => o.shopId === shop.id && o.status === 'completed').length,
  };
}

function orderView(order) {
  const shop = db.shops.find((s) => s.id === order.shopId);
  const customer = db.users.find((u) => u.id === order.customerId);
  return {
    ...order,
    shop_name: shop ? shop.name : '(deleted shop)',
    shop_phone: shop ? shop.phone : '',
    customer_name: customer ? customer.name : '',
    customer_phone: customer ? customer.phone : '',
  };
}

// ---- Marketplace API --------------------------------------------------------

async function handleApi(req, res, url) {
  const p = url.pathname;
  const method = req.method;
  const seg = p.split('/').filter(Boolean); // e.g. ['api','shops',':id','products']

  // ---------- Auth ----------
  if (method === 'POST' && p === '/api/auth/register') {
    const b = await readBody(req);
    const name = str(b.name, 100);
    const email = str(b.email, 150).toLowerCase();
    const phone = str(b.phone, 30);
    const password = String(b.password || '');
    const role = b.role === 'owner' ? 'owner' : 'customer';
    if (!name || !email || !phone) fail(400, 'missing_fields');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'invalid_email');
    if (password.length < 6) fail(400, 'password_too_short');
    if (db.users.some((u) => u.email === email)) fail(409, 'email_taken');
    const user = {
      id: uid(),
      name,
      email,
      phone,
      role,
      password: hashPassword(password),
      created_at: now(),
    };
    db.users.push(user);
    const token = createSession(user.id);
    save();
    return sendJson(res, 201, { token, user: publicUser(user) });
  }

  if (method === 'POST' && p === '/api/auth/login') {
    const b = await readBody(req);
    const email = str(b.email, 150).toLowerCase();
    const user = db.users.find((u) => u.email === email);
    if (!user || !verifyPassword(String(b.password || ''), user.password)) fail(401, 'bad_credentials');
    const token = createSession(user.id);
    return sendJson(res, 200, { token, user: publicUser(user) });
  }

  if (method === 'POST' && p === '/api/auth/logout') {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    delete db.sessions[token];
    save();
    return sendJson(res, 200, { ok: true });
  }

  if (method === 'GET' && p === '/api/me') {
    const user = userFromRequest(req);
    return sendJson(res, 200, { user: user ? publicUser(user) : null });
  }

  // ---------- Meta ----------
  if (method === 'GET' && p === '/api/meta') {
    return sendJson(res, 200, {
      categories: CATEGORIES,
      transaction_fee_rate: TRANSACTION_FEE_RATE,
      monthly_listing_fee: MONTHLY_LISTING_FEE,
      free_trial_days: FREE_TRIAL_DAYS,
    });
  }

  // ---------- Shops (public browse) ----------
  if (method === 'GET' && p === '/api/shops') {
    const category = url.searchParams.get('category') || '';
    const q = (url.searchParams.get('q') || '').toLowerCase();
    let shops = db.shops;
    if (category) shops = shops.filter((s) => s.category === category);
    if (q) {
      shops = shops.filter((s) => {
        if (s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)) return true;
        return db.products.some(
          (pr) => pr.shopId === s.id && (pr.name.toLowerCase().includes(q) || (pr.description || '').toLowerCase().includes(q))
        );
      });
    }
    return sendJson(res, 200, { shops: shops.map(shopSummary) });
  }

  if (method === 'GET' && seg[0] === 'api' && seg[1] === 'shops' && seg.length === 3) {
    const shop = db.shops.find((s) => s.id === seg[2]);
    if (!shop) fail(404, 'shop_not_found');
    return sendJson(res, 200, {
      shop: shopSummary(shop),
      products: db.products.filter((pr) => pr.shopId === shop.id),
    });
  }

  // ---------- Shops (owner) ----------
  if (method === 'GET' && p === '/api/my/shops') {
    const user = requireUser(req);
    const shops = db.shops
      .filter((s) => s.ownerId === user.id)
      .map((s) => ({ ...shopSummary(s), billing: shopBilling(s) }));
    return sendJson(res, 200, { shops });
  }

  if (method === 'POST' && p === '/api/shops') {
    const user = requireUser(req);
    if (user.role !== 'owner' && user.role !== 'admin') fail(403, 'owners_only');
    const b = await readBody(req);
    const name = str(b.name, 120);
    const category = CATEGORIES.includes(b.category) ? b.category : '';
    const lat = num(b.lat);
    const lng = num(b.lng);
    if (!name) fail(400, 'name_required');
    if (!category) fail(400, 'invalid_category');
    if (!(lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)) fail(400, 'invalid_location');
    const shop = {
      id: uid(),
      ownerId: user.id,
      name,
      category,
      description: str(b.description, 600),
      phone: str(b.phone, 30) || user.phone,
      address: str(b.address, 200),
      lat,
      lng,
      created_at: now(),
    };
    db.shops.push(shop);
    save();
    return sendJson(res, 201, { shop: { ...shopSummary(shop), billing: shopBilling(shop) } });
  }

  if ((method === 'PUT' || method === 'DELETE') && seg[0] === 'api' && seg[1] === 'shops' && seg.length === 3) {
    const user = requireUser(req);
    const shop = db.shops.find((s) => s.id === seg[2]);
    if (!shop) fail(404, 'shop_not_found');
    if (shop.ownerId !== user.id && user.role !== 'admin') fail(403, 'not_your_shop');
    if (method === 'DELETE') {
      db.shops = db.shops.filter((s) => s.id !== shop.id);
      db.products = db.products.filter((pr) => pr.shopId !== shop.id);
      save();
      return sendJson(res, 200, { ok: true });
    }
    const b = await readBody(req);
    if (b.name !== undefined) shop.name = str(b.name, 120) || shop.name;
    if (b.category !== undefined && CATEGORIES.includes(b.category)) shop.category = b.category;
    if (b.description !== undefined) shop.description = str(b.description, 600);
    if (b.phone !== undefined) shop.phone = str(b.phone, 30);
    if (b.address !== undefined) shop.address = str(b.address, 200);
    const lat = num(b.lat), lng = num(b.lng);
    if (lat >= -90 && lat <= 90) shop.lat = lat;
    if (lng >= -180 && lng <= 180) shop.lng = lng;
    save();
    return sendJson(res, 200, { shop: { ...shopSummary(shop), billing: shopBilling(shop) } });
  }

  // ---------- Products / inventory ----------
  if (method === 'POST' && seg[0] === 'api' && seg[1] === 'shops' && seg[3] === 'products' && seg.length === 4) {
    const user = requireUser(req);
    const shop = db.shops.find((s) => s.id === seg[2]);
    if (!shop) fail(404, 'shop_not_found');
    if (shop.ownerId !== user.id && user.role !== 'admin') fail(403, 'not_your_shop');
    const b = await readBody(req);
    const name = str(b.name, 150);
    const price = num(b.price);
    if (!name) fail(400, 'name_required');
    if (!(price > 0)) fail(400, 'invalid_price');
    const stockNum = num(b.stock);
    const product = {
      id: uid(),
      shopId: shop.id,
      name,
      price: Math.round(price),
      // null stock = unlimited (services, rentals, coaching sessions, ...)
      stock: Number.isFinite(stockNum) && stockNum >= 0 ? Math.floor(stockNum) : null,
      unit: str(b.unit, 40),
      description: str(b.description, 400),
      created_at: now(),
    };
    db.products.push(product);
    save();
    return sendJson(res, 201, { product });
  }

  if ((method === 'PUT' || method === 'DELETE') && seg[0] === 'api' && seg[1] === 'products' && seg.length === 3) {
    const user = requireUser(req);
    const product = db.products.find((pr) => pr.id === seg[2]);
    if (!product) fail(404, 'product_not_found');
    const shop = db.shops.find((s) => s.id === product.shopId);
    if (!shop || (shop.ownerId !== user.id && user.role !== 'admin')) fail(403, 'not_your_shop');
    if (method === 'DELETE') {
      db.products = db.products.filter((pr) => pr.id !== product.id);
      save();
      return sendJson(res, 200, { ok: true });
    }
    const b = await readBody(req);
    if (b.name !== undefined) product.name = str(b.name, 150) || product.name;
    if (b.price !== undefined) {
      const price = num(b.price);
      if (price > 0) product.price = Math.round(price);
    }
    if (b.stock !== undefined) {
      const stockNum = num(b.stock);
      product.stock = Number.isFinite(stockNum) && stockNum >= 0 ? Math.floor(stockNum) : null;
    }
    if (b.unit !== undefined) product.unit = str(b.unit, 40);
    if (b.description !== undefined) product.description = str(b.description, 400);
    save();
    return sendJson(res, 200, { product });
  }

  // ---------- Orders ----------
  if (method === 'POST' && p === '/api/orders') {
    const user = requireUser(req);
    const b = await readBody(req);
    const shop = db.shops.find((s) => s.id === b.shopId);
    if (!shop) fail(404, 'shop_not_found');
    if (shop.ownerId === user.id) fail(400, 'cannot_order_own_shop');
    const rawItems = Array.isArray(b.items) ? b.items.slice(0, 50) : [];
    if (!rawItems.length) fail(400, 'empty_order');

    const items = [];
    for (const it of rawItems) {
      const product = db.products.find((pr) => pr.id === it.productId && pr.shopId === shop.id);
      if (!product) fail(400, 'unknown_product');
      const qty = Math.floor(num(it.qty));
      if (!(qty >= 1 && qty <= 999)) fail(400, 'invalid_qty');
      if (product.stock !== null && product.stock < qty) fail(409, 'out_of_stock');
      items.push({ productId: product.id, name: product.name, unit: product.unit, price: product.price, qty });
    }
    // Reserve stock after all validations pass.
    for (const it of items) {
      const product = db.products.find((pr) => pr.id === it.productId);
      if (product.stock !== null) product.stock -= it.qty;
    }

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const fee = Math.round(subtotal * TRANSACTION_FEE_RATE);
    const order = {
      id: uid(),
      code: 'IS-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
      customerId: user.id,
      shopId: shop.id,
      items,
      subtotal,
      platform_fee: fee,
      shop_receives: subtotal - fee,
      delivery_method: b.delivery_method === 'delivery' ? 'delivery' : 'pickup',
      delivery_address: str(b.delivery_address, 300),
      momo_phone: str(b.momo_phone, 30) || user.phone,
      payment: 'mobile_money',
      status: 'pending',
      created_at: now(),
      updated_at: now(),
    };
    db.orders.push(order);
    save();
    return sendJson(res, 201, { order: orderView(order) });
  }

  if (method === 'GET' && p === '/api/my/orders') {
    const user = requireUser(req);
    const orders = db.orders
      .filter((o) => o.customerId === user.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(orderView);
    return sendJson(res, 200, { orders });
  }

  if (method === 'GET' && seg[0] === 'api' && seg[1] === 'shops' && seg[3] === 'orders' && seg.length === 4) {
    const user = requireUser(req);
    const shop = db.shops.find((s) => s.id === seg[2]);
    if (!shop) fail(404, 'shop_not_found');
    if (shop.ownerId !== user.id && user.role !== 'admin') fail(403, 'not_your_shop');
    const orders = db.orders
      .filter((o) => o.shopId === shop.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(orderView);
    return sendJson(res, 200, { orders });
  }

  if (method === 'POST' && seg[0] === 'api' && seg[1] === 'orders' && seg[3] === 'status' && seg.length === 4) {
    const user = requireUser(req);
    const order = db.orders.find((o) => o.id === seg[2]);
    if (!order) fail(404, 'order_not_found');
    const shop = db.shops.find((s) => s.id === order.shopId);
    const isOwner = shop && (shop.ownerId === user.id || user.role === 'admin');
    const isCustomer = order.customerId === user.id;
    const b = await readBody(req);
    const status = String(b.status || '');
    if (!ORDER_STATUSES.includes(status)) fail(400, 'invalid_status');

    const allowed =
      (isOwner && order.status === 'pending' && (status === 'confirmed' || status === 'cancelled')) ||
      (isOwner && order.status === 'confirmed' && (status === 'completed' || status === 'cancelled')) ||
      (isCustomer && order.status === 'pending' && status === 'cancelled');
    if (!allowed) fail(isOwner || isCustomer ? 409 : 403, 'transition_not_allowed');

    if (status === 'cancelled') {
      for (const it of order.items) {
        const product = db.products.find((pr) => pr.id === it.productId);
        if (product && product.stock !== null) product.stock += it.qty;
      }
    }
    order.status = status;
    order.updated_at = now();
    save();
    return sendJson(res, 200, { order: orderView(order) });
  }

  // ---------- Platform admin ----------
  if (method === 'GET' && p === '/api/admin/overview') {
    const user = requireUser(req);
    if (user.role !== 'admin') fail(403, 'admins_only');
    const completed = db.orders.filter((o) => o.status === 'completed');
    const gmv = completed.reduce((s, o) => s + o.subtotal, 0);
    const feeRevenue = completed.reduce((s, o) => s + o.platform_fee, 0);
    const shops = db.shops.map((s) => {
      const owner = db.users.find((u) => u.id === s.ownerId);
      return {
        ...shopSummary(s),
        owner_name: owner ? owner.name : '',
        owner_email: owner ? owner.email : '',
        billing: shopBilling(s),
      };
    });
    const listingRevenueMonthly = shops.reduce((s, x) => s + x.billing.monthly_fee, 0);
    return sendJson(res, 200, {
      totals: {
        users: db.users.length,
        customers: db.users.filter((u) => u.role === 'customer').length,
        owners: db.users.filter((u) => u.role === 'owner').length,
        shops: db.shops.length,
        products: db.products.length,
        orders: db.orders.length,
        completed_orders: completed.length,
        gmv,
        fee_revenue: feeRevenue,
        listing_revenue_monthly: listingRevenueMonthly,
        shops_in_trial: shops.filter((s) => s.billing.free_trial).length,
      },
      shops,
      recent_orders: db.orders
        .slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 50)
        .map(orderView),
    });
  }

  fail(404, 'not_found');
}

// ---- Survey endpoints (unchanged behavior) ----------------------------------

const VALID_SURVEY_ROLES = new Set(['customer', 'shop_owner']);
const VALID_SURVEY_LANGS = new Set(['en', 'rw']);
const TEXT_QUESTIONS = new Set(['trust_text', 'customer_suggestions', 'best_feature', 'owner_concerns']);
const MAX_TEXT_LEN = 2000;

function readSurveyResponses() {
  if (!fs.existsSync(SURVEY_FILE)) return [];
  return fs
    .readFileSync(SURVEY_FILE, 'utf8')
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

function sanitizeSurveyValue(v) {
  if (typeof v === 'string') return v.slice(0, MAX_TEXT_LEN).trim();
  if (Array.isArray(v)) return v.slice(0, 20).map((x) => String(x).slice(0, 200));
  if (typeof v === 'number' || typeof v === 'boolean') return v;
  return '';
}

function csvEscape(value) {
  let s = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

async function handleSurvey(req, res, url) {
  const p = url.pathname;
  if (req.method === 'POST' && p === '/api/responses') {
    const payload = await readBody(req, 64 * 1024);
    const role = String(payload.role || '');
    const language = String(payload.language || '');
    if (!VALID_SURVEY_ROLES.has(role)) return sendJson(res, 400, { error: 'invalid_role' });
    if (!VALID_SURVEY_LANGS.has(language)) return sendJson(res, 400, { error: 'invalid_language' });
    const answers = {};
    if (payload.answers && typeof payload.answers === 'object') {
      for (const [k, v] of Object.entries(payload.answers)) {
        if (Object.keys(answers).length >= 40) break;
        answers[String(k).slice(0, 60)] = sanitizeSurveyValue(v);
      }
    }
    const record = {
      id: uid(),
      submitted_at: now(),
      role,
      language,
      name: str(payload.name, 120),
      phone: str(payload.phone, 30),
      district: str(payload.district, 120),
      contact_ok: Boolean(payload.contact_ok),
      answers,
    };
    fs.appendFile(SURVEY_FILE, JSON.stringify(record) + '\n', (err) => {
      if (err) return sendJson(res, 500, { error: 'storage_error' });
      sendJson(res, 201, { ok: true, id: record.id });
    });
    return true;
  }

  if (req.method === 'GET' && (p === '/api/responses' || p === '/api/stats' || p === '/api/export.csv')) {
    if (ADMIN_KEY) {
      const key = url.searchParams.get('key') || req.headers['x-admin-key'] || '';
      if (key !== ADMIN_KEY) return sendJson(res, 401, { error: 'unauthorized' });
    }
    const responses = readSurveyResponses();
    if (p === '/api/responses') return sendJson(res, 200, { responses });
    if (p === '/api/stats') {
      const stats = {
        total: responses.length,
        by_role: { customer: 0, shop_owner: 0 },
        by_language: { en: 0, rw: 0 },
        contact_ok: 0,
        answer_counts: {},
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
          for (const v of values) stats.answer_counts[q][v] = (stats.answer_counts[q][v] || 0) + 1;
        }
      }
      return sendJson(res, 200, stats);
    }
    const metaCols = ['id', 'submitted_at', 'role', 'language', 'name', 'phone', 'district', 'contact_ok'];
    const answerKeys = [];
    for (const r of responses) {
      for (const k of Object.keys(r.answers || {})) if (!answerKeys.includes(k)) answerKeys.push(k);
    }
    const lines = [[...metaCols, ...answerKeys].join(',')];
    for (const r of responses) {
      lines.push(
        [
          r.id, r.submitted_at, r.role, r.language, r.name || '', r.phone || '', r.district || '',
          r.contact_ok ? 'yes' : 'no',
          ...answerKeys.map((k) => (r.answers || {})[k] ?? ''),
        ].map(csvEscape).join(',')
      );
    }
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="isoko-survey-responses.csv"',
    });
    res.end('\uFEFF' + lines.join('\r\n'));
    return true;
  }
  return false;
}

// ---- Static files -----------------------------------------------------------

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

// ---- Server -----------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      const handledSurvey = await handleSurvey(req, res, url);
      if (handledSurvey) return;
      return await handleApi(req, res, url);
    }
    if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, url.pathname);
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  } catch (err) {
    if (err && err.status) return sendJson(res, err.status, { error: err.apiError || err.message });
    console.error('Unhandled error:', err);
    if (!res.headersSent) sendJson(res, 500, { error: 'server_error' });
  }
});

// Seed the platform admin account on first boot.
if (!db.users.some((u) => u.role === 'admin')) {
  const password = ADMIN_PASSWORD || crypto.randomBytes(6).toString('hex');
  db.users.push({
    id: uid(),
    name: 'iSoko Admin',
    email: ADMIN_EMAIL,
    phone: '',
    role: 'admin',
    password: hashPassword(password),
    created_at: now(),
  });
  save();
  console.log(`Seeded admin account: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD ? '(from ADMIN_PASSWORD env)' : 'password: ' + password}`);
  if (!ADMIN_PASSWORD) console.log('Set ADMIN_PASSWORD env var before deploying to production.');
}

server.listen(PORT, () => {
  console.log(`iSoko marketplace running at http://localhost:${PORT}`);
  console.log(`Survey:                     http://localhost:${PORT}/survey.html`);
  console.log(`Platform admin:             http://localhost:${PORT}/platform-admin.html`);
});
