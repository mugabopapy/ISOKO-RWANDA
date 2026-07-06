/**
 * Seeds demo shops across Kigali so the map and browse pages have content.
 * Run while the server is running:  node scripts/seed-demo.js [baseUrl]
 */
const BASE = process.argv[2] || 'http://localhost:3000';

async function api(path, opts = {}) {
  const res = await fetch(BASE + path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.token ? { Authorization: 'Bearer ' + opts.token } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${path}: ${data.error || res.status}`);
  return data;
}

const SHOPS = [
  {
    owner: { name: 'Alice Uwase', email: 'alice@demo.rw', phone: '0788111001' },
    shop: {
      name: 'Kimironko Fresh Market', category: 'food', lat: -1.9326, lng: 30.1272,
      address: 'Kimironko, Gasabo', description: 'Fresh fruits, vegetables and groceries daily.',
    },
    products: [
      { name: 'Bananas', price: 1200, stock: 50, unit: 'bunch' },
      { name: 'Tomatoes', price: 800, stock: 100, unit: 'kg' },
      { name: 'Rice (Tanzania)', price: 1500, stock: 200, unit: 'kg' },
      { name: 'Cooking oil', price: 4500, stock: 40, unit: 'litre' },
    ],
  },
  {
    owner: { name: 'Jean Bosco', email: 'bosco@demo.rw', phone: '0788111002' },
    shop: {
      name: 'Nyamirambo Pharmacy Plus', category: 'pharmacy', lat: -1.9769, lng: 30.0447,
      address: 'Nyamirambo, Nyarugenge', description: 'Licensed pharmacy — medicines, first aid, baby care. Open 7am–10pm.',
    },
    products: [
      { name: 'Paracetamol 500mg', price: 500, stock: 300, unit: 'strip' },
      { name: 'ORS sachets', price: 300, stock: 150, unit: 'sachet' },
      { name: 'First aid kit', price: 8000, stock: 20 },
    ],
  },
  {
    owner: { name: 'Claudine M.', email: 'claudine@demo.rw', phone: '0788111003' },
    shop: {
      name: 'Kigali Phone House', category: 'electronics', lat: -1.9499, lng: 30.0588,
      address: 'CBD, KN 4 Ave', description: 'Phones, accessories, chargers, repairs while you wait.',
    },
    products: [
      { name: 'Phone charger (Type-C)', price: 3500, stock: 60 },
      { name: 'Earphones', price: 2500, stock: 80 },
      { name: 'Screen protector + fitting', price: 2000, stock: null, unit: 'service' },
    ],
  },
  {
    owner: { name: 'Eric N.', email: 'eric@demo.rw', phone: '0788111004' },
    shop: {
      name: 'Remera Furniture Works', category: 'furniture', lat: -1.9536, lng: 30.1044,
      address: 'Remera, Gasabo', description: 'Handmade sofas, beds, tables — custom orders welcome.',
    },
    products: [
      { name: '3-seater sofa', price: 250000, stock: 5 },
      { name: 'Dining table (6 seats)', price: 180000, stock: 3 },
      { name: 'Custom order deposit', price: 50000, stock: null },
    ],
  },
  {
    owner: { name: 'Divine K.', email: 'divine@demo.rw', phone: '0788111005' },
    shop: {
      name: 'Kicukiro Style & Shoes', category: 'shoes', lat: -1.9847, lng: 30.1030,
      address: 'Kicukiro Centre', description: 'Shoes and sandals for men, women and kids.',
    },
    products: [
      { name: 'Men leather shoes', price: 25000, stock: 15 },
      { name: 'Ladies sandals', price: 12000, stock: 25 },
      { name: 'Kids sneakers', price: 15000, stock: 20 },
    ],
  },
  {
    owner: { name: 'Patrick H.', email: 'patrick@demo.rw', phone: '0788111006' },
    shop: {
      name: 'Gisozi Homes & Rentals', category: 'rental', lat: -1.9190, lng: 30.0700,
      address: 'Gisozi, Gasabo', description: 'Apartments and houses for rent — monthly contracts, family friendly.',
    },
    products: [
      { name: '2-bedroom apartment', price: 250000, stock: 2, unit: 'month' },
      { name: 'Single room (self-contained)', price: 80000, stock: 4, unit: 'month' },
      { name: 'Office space 40m²', price: 300000, stock: 1, unit: 'month' },
    ],
  },
  {
    owner: { name: 'Sandrine I.', email: 'sandrine@demo.rw', phone: '0788111007' },
    shop: {
      name: 'FitLife Gym Kacyiru', category: 'gym', lat: -1.9395, lng: 30.0808,
      address: 'Kacyiru, near BK', description: 'Modern gym — cardio, weights, group classes. Day passes and memberships.',
    },
    products: [
      { name: 'Monthly membership', price: 30000, stock: null, unit: 'month' },
      { name: 'Day pass', price: 3000, stock: null, unit: 'day' },
      { name: 'Personal training session', price: 10000, stock: null, unit: 'session' },
    ],
  },
  {
    owner: { name: 'Coach Emmanuel', email: 'emmanuel@demo.rw', phone: '0788111008' },
    shop: {
      name: 'Coach Emmanuel — Football & Basketball', category: 'coach', lat: -1.9578, lng: 30.1127,
      address: 'Amahoro Stadium area', description: 'Certified coach: football, basketball, kids academies and private sessions.',
    },
    products: [
      { name: 'Kids football academy', price: 20000, stock: null, unit: 'month' },
      { name: 'Private coaching session', price: 15000, stock: null, unit: 'session' },
      { name: 'Team training (per squad)', price: 50000, stock: null, unit: 'session' },
    ],
  },
  {
    owner: { name: 'Teacher Grace', email: 'grace@demo.rw', phone: '0788111009' },
    shop: {
      name: 'Grace Tutoring Center', category: 'tutor', lat: -1.9505, lng: 30.0900,
      address: 'Kimihurura', description: 'Math, physics, English and computer lessons — primary to university.',
    },
    products: [
      { name: 'Math tutoring (S1–S6)', price: 5000, stock: null, unit: 'hour' },
      { name: 'English conversation class', price: 4000, stock: null, unit: 'hour' },
      { name: 'Exam prep package', price: 40000, stock: null, unit: 'month' },
    ],
  },
  {
    owner: { name: 'Olivier T.', email: 'olivier@demo.rw', phone: '0788111010' },
    shop: {
      name: 'Nyabugogo Clothing Plaza', category: 'clothes', lat: -1.9394, lng: 30.0445,
      address: 'Nyabugogo', description: 'New and quality second-hand clothes for the whole family.',
    },
    products: [
      { name: 'Men shirts', price: 8000, stock: 40 },
      { name: 'Ladies dresses', price: 12000, stock: 30 },
      { name: 'Kids outfits', price: 6000, stock: 50 },
    ],
  },
];

(async () => {
  for (const entry of SHOPS) {
    let token;
    try {
      ({ token } = await api('/api/auth/register', {
        method: 'POST',
        body: { ...entry.owner, password: 'demo1234', role: 'owner' },
      }));
    } catch {
      ({ token } = await api('/api/auth/login', {
        method: 'POST',
        body: { email: entry.owner.email, password: 'demo1234' },
      }));
    }
    const { shop } = await api('/api/shops', { method: 'POST', body: entry.shop, token });
    for (const product of entry.products) {
      await api(`/api/shops/${shop.id}/products`, { method: 'POST', body: product, token });
    }
    console.log(`Seeded: ${entry.shop.name} (${entry.products.length} items)`);
  }
  console.log('Done. Demo owner logins: <email> / demo1234');
})().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
