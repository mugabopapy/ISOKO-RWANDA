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
  {
    owner: { name: 'Dr. Aline Mukamana', email: 'aline@demo.rw', phone: '0788111011' },
    shop: {
      name: 'Kacyiru Family Clinic', category: 'doctor', lat: -1.9370, lng: 30.0850,
      address: 'Kacyiru, near Ministry road', description: 'General practice clinic — consultations, check-ups, vaccinations and lab tests.',
    },
    products: [
      { name: 'General consultation', price: 10000, stock: null, unit: 'visit' },
      { name: 'Full health check-up', price: 35000, stock: null, unit: 'visit' },
      { name: 'Child vaccination visit', price: 8000, stock: null, unit: 'visit' },
      { name: 'Blood test panel', price: 15000, stock: null, unit: 'test' },
    ],
  },
  {
    owner: { name: 'Dr. Jean-Paul Habimana', email: 'jeanpaul@demo.rw', phone: '0788111012' },
    shop: {
      name: 'Smile Dental Kigali', category: 'doctor', lat: -1.9525, lng: 30.0640,
      address: 'CBD, KN 2 Ave', description: 'Dental clinic — cleaning, fillings, braces consultations. English & Kinyarwanda spoken.',
    },
    products: [
      { name: 'Dental check-up & cleaning', price: 20000, stock: null, unit: 'visit' },
      { name: 'Tooth filling', price: 25000, stock: null, unit: 'tooth' },
      { name: 'Braces consultation', price: 10000, stock: null, unit: 'visit' },
    ],
  },
  {
    owner: { name: 'Chantal U.', email: 'chantal@demo.rw', phone: '0788111013' },
    shop: {
      name: 'Belle Coiffure Remera', category: 'salon', lat: -1.9560, lng: 30.1090,
      address: 'Remera, Giporoso', description: 'Braids, weaves, natural hair care and manicure for ladies and kids.',
    },
    products: [
      { name: 'Box braids', price: 15000, stock: null, unit: 'session' },
      { name: 'Hair wash & treatment', price: 6000, stock: null, unit: 'session' },
      { name: 'Manicure & pedicure', price: 8000, stock: null, unit: 'session' },
    ],
  },
  {
    owner: { name: 'Fabrice N.', email: 'fabrice@demo.rw', phone: '0788111014' },
    shop: {
      name: 'Sharp Cut Barbershop', category: 'salon', lat: -1.9800, lng: 30.0610,
      address: 'Nyamirambo, Biryogo', description: 'Modern barbershop — haircuts, beard styling, kids cuts.',
    },
    products: [
      { name: 'Haircut', price: 3000, stock: null, unit: 'cut' },
      { name: 'Haircut + beard styling', price: 5000, stock: null, unit: 'session' },
      { name: 'Kids haircut', price: 2000, stock: null, unit: 'cut' },
    ],
  },
  {
    owner: { name: 'Beatha M.', email: 'beatha@demo.rw', phone: '0788111015' },
    shop: {
      name: 'Kimisagara Food Corner', category: 'food', lat: -1.9600, lng: 30.0430,
      address: 'Kimisagara', description: 'Cooked meals, brochettes, fresh juice — order ahead for pickup or delivery.',
    },
    products: [
      { name: 'Meal of the day (buffet plate)', price: 2500, stock: 60, unit: 'plate' },
      { name: 'Brochettes (goat)', price: 1500, stock: 100, unit: 'stick' },
      { name: 'Fresh passion juice', price: 1000, stock: 50, unit: 'bottle' },
    ],
  },
  {
    owner: { name: 'Theoneste B.', email: 'theoneste@demo.rw', phone: '0788111016' },
    shop: {
      name: 'Kabeza Mini Market', category: 'food', lat: -1.9660, lng: 30.1310,
      address: 'Kabeza, near airport road', description: 'Everyday groceries, drinks, airtime and household basics.',
    },
    products: [
      { name: 'Milk (fresh)', price: 1000, stock: 80, unit: 'litre' },
      { name: 'Bread', price: 1200, stock: 40, unit: 'loaf' },
      { name: 'Sugar', price: 1800, stock: 100, unit: 'kg' },
      { name: 'Drinking water 5L', price: 2000, stock: 60, unit: 'jerrican' },
    ],
  },
  {
    owner: { name: 'Solange I.', email: 'solange@demo.rw', phone: '0788111017' },
    shop: {
      name: 'Huye Campus Pharmacy', category: 'pharmacy', lat: -2.5967, lng: 29.7444,
      address: 'Huye town, near university', description: 'Student-friendly pharmacy with delivery around Huye campus.',
    },
    products: [
      { name: 'Malaria test kit', price: 2000, stock: 100 },
      { name: 'Vitamin C', price: 1500, stock: 200, unit: 'bottle' },
      { name: 'Pain relief gel', price: 3500, stock: 50 },
    ],
  },
  {
    owner: { name: 'Innocent R.', email: 'innocent@demo.rw', phone: '0788111018' },
    shop: {
      name: 'Musanze Electronics Hub', category: 'electronics', lat: -1.4998, lng: 29.6344,
      address: 'Musanze town centre', description: 'Phones, TVs, solar kits and repairs for the Northern Province.',
    },
    products: [
      { name: 'Smartphone (entry level)', price: 85000, stock: 12 },
      { name: 'Solar home kit', price: 120000, stock: 8 },
      { name: 'Phone repair (screen)', price: 15000, stock: null, unit: 'repair' },
    ],
  },
  {
    owner: { name: 'Josiane K.', email: 'josiane@demo.rw', phone: '0788111019' },
    shop: {
      name: 'Rubavu Beach Fashion', category: 'clothes', lat: -1.6790, lng: 29.2610,
      address: 'Rubavu, near Lake Kivu shore', description: 'Beachwear, kitenge dresses and accessories.',
    },
    products: [
      { name: 'Kitenge dress (tailored)', price: 20000, stock: 15 },
      { name: 'Beach shorts', price: 7000, stock: 30 },
      { name: 'Sun hats', price: 4000, stock: 25 },
    ],
  },
  {
    owner: { name: 'Emile G.', email: 'emile@demo.rw', phone: '0788111020' },
    shop: {
      name: 'Gikondo Shoe Factory Outlet', category: 'shoes', lat: -1.9760, lng: 30.0770,
      address: 'Gikondo industrial area', description: 'Locally made leather shoes at factory prices.',
    },
    products: [
      { name: 'Leather office shoes', price: 18000, stock: 30 },
      { name: 'School shoes', price: 9000, stock: 60 },
      { name: 'Sandals (handmade)', price: 7000, stock: 40 },
    ],
  },
  {
    owner: { name: 'Vestine A.', email: 'vestine@demo.rw', phone: '0788111021' },
    shop: {
      name: 'Kanombe Apartments', category: 'rental', lat: -1.9710, lng: 30.1550,
      address: 'Kanombe, near airport', description: 'Furnished and unfurnished apartments, short and long stays.',
    },
    products: [
      { name: '1-bedroom furnished', price: 180000, stock: 3, unit: 'month' },
      { name: '3-bedroom family house', price: 350000, stock: 1, unit: 'month' },
      { name: 'Short stay (furnished studio)', price: 25000, stock: 2, unit: 'night' },
    ],
  },
  {
    owner: { name: 'Callixte M.', email: 'callixte@demo.rw', phone: '0788111022' },
    shop: {
      name: 'Nyarutarama Executive Rentals', category: 'rental', lat: -1.9310, lng: 30.0990,
      address: 'Nyarutarama, golf course area', description: 'Premium houses and offices for executives and NGOs.',
    },
    products: [
      { name: '4-bedroom villa with garden', price: 1200000, stock: 1, unit: 'month' },
      { name: 'Office floor 120m²', price: 900000, stock: 1, unit: 'month' },
    ],
  },
  {
    owner: { name: 'Diane U.', email: 'diane@demo.rw', phone: '0788111023' },
    shop: {
      name: 'Iron Body Gym Kicukiro', category: 'gym', lat: -1.9900, lng: 30.0920,
      address: 'Kicukiro, Sonatube junction', description: 'Weights, boxing corner, aerobics classes every evening.',
    },
    products: [
      { name: 'Monthly membership', price: 25000, stock: null, unit: 'month' },
      { name: 'Aerobics class', price: 2000, stock: null, unit: 'class' },
      { name: 'Boxing training', price: 5000, stock: null, unit: 'session' },
    ],
  },
  {
    owner: { name: 'Coach Chantal', email: 'coachchantal@demo.rw', phone: '0788111024' },
    shop: {
      name: 'Coach Chantal — Volleyball & Athletics', category: 'coach', lat: -1.9440, lng: 30.0930,
      address: 'Kimihurura playgrounds', description: 'Former national team player. Volleyball squads, athletics and fitness for teens.',
    },
    products: [
      { name: 'Volleyball academy (teens)', price: 15000, stock: null, unit: 'month' },
      { name: 'Athletics training', price: 10000, stock: null, unit: 'month' },
      { name: 'Private fitness session', price: 8000, stock: null, unit: 'session' },
    ],
  },
  {
    owner: { name: 'Prof. Samuel N.', email: 'samuel@demo.rw', phone: '0788111025' },
    shop: {
      name: 'Bright Future Academy', category: 'tutor', lat: -1.9480, lng: 30.1260,
      address: 'Kimironko, near market', description: 'National exam prep (P6, S3, S6), sciences and languages. Group and private classes.',
    },
    products: [
      { name: 'P6 exam prep (group)', price: 15000, stock: null, unit: 'month' },
      { name: 'S6 sciences package', price: 30000, stock: null, unit: 'month' },
      { name: 'Private lesson (any subject)', price: 6000, stock: null, unit: 'hour' },
    ],
  },
  {
    owner: { name: 'Linda W.', email: 'linda@demo.rw', phone: '0788111026' },
    shop: {
      name: 'Code Kigali — Computer School', category: 'tutor', lat: -1.9450, lng: 30.0605,
      address: 'CBD, Makuza Peace Plaza', description: 'Computer literacy, Microsoft Office, graphic design and beginner coding courses.',
    },
    products: [
      { name: 'Computer basics course', price: 40000, stock: null, unit: 'course' },
      { name: 'Graphic design course', price: 60000, stock: null, unit: 'course' },
      { name: 'Beginner coding bootcamp', price: 80000, stock: null, unit: 'course' },
    ],
  },
  {
    owner: { name: 'Aimable H.', email: 'aimable@demo.rw', phone: '0788111027' },
    shop: {
      name: 'Gasabo Furniture & Decor', category: 'furniture', lat: -1.9280, lng: 30.1120,
      address: 'Kibagabaga road', description: 'Beds, wardrobes, office desks and interior decoration services.',
    },
    products: [
      { name: 'Queen bed + mattress', price: 220000, stock: 4 },
      { name: 'Office desk & chair set', price: 95000, stock: 6 },
      { name: 'Wardrobe (3 doors)', price: 160000, stock: 3 },
    ],
  },
  {
    owner: { name: 'Immaculee D.', email: 'immaculee@demo.rw', phone: '0788111028' },
    shop: {
      name: 'Kigali Gift & Craft House', category: 'other', lat: -1.9530, lng: 30.0925,
      address: 'Kimihurura, Kigali Heights area', description: 'Agaseke baskets, imigongo art, gifts and souvenirs made in Rwanda.',
    },
    products: [
      { name: 'Agaseke basket (medium)', price: 12000, stock: 20 },
      { name: 'Imigongo wall art', price: 25000, stock: 10 },
      { name: 'Gift hamper (made in Rwanda)', price: 35000, stock: 15 },
    ],
  },
  {
    owner: { name: 'Gilbert S.', email: 'gilbert@demo.rw', phone: '0788111029' },
    shop: {
      name: 'Quick Fix Home Services', category: 'other', lat: -1.9620, lng: 30.0870,
      address: 'Gikondo', description: 'Plumbing, electrical repairs and painting — book a technician to your home.',
    },
    products: [
      { name: 'Plumbing call-out', price: 10000, stock: null, unit: 'visit' },
      { name: 'Electrical repair call-out', price: 10000, stock: null, unit: 'visit' },
      { name: 'Room painting', price: 40000, stock: null, unit: 'room' },
    ],
  },
  {
    owner: { name: 'Dr. Grace Uwera', email: 'graceuwera@demo.rw', phone: '0788111030' },
    shop: {
      name: 'Mama & Baby Clinic Gisozi', category: 'doctor', lat: -1.9150, lng: 30.0760,
      address: 'Gisozi, near sector office', description: 'Maternal and child health — antenatal care, growth monitoring, family planning.',
    },
    products: [
      { name: 'Antenatal consultation', price: 12000, stock: null, unit: 'visit' },
      { name: 'Baby growth check', price: 6000, stock: null, unit: 'visit' },
      { name: 'Family planning consultation', price: 8000, stock: null, unit: 'visit' },
    ],
  },
];

(async () => {
  for (const entry of SHOPS) {
    let token;
    try {
      ({ token } = await api('/api/auth/register', {
        method: 'POST',
        body: { ...entry.owner, password: 'demo1234', role: 'owner', provider_type: entry.shop.category },
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
