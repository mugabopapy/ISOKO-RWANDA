/* Shared marketplace frontend: i18n, categories, API client, header, cart. */
(function () {
  const CATEGORIES = {
    pharmacy:    { emoji: '💊', img: '/img/cat-pharmacy.jpg',    en: 'Pharmacy',            rw: 'Farumasi',                    provider: { en: 'Pharmacist', rw: 'Umufarumasiye' } },
    doctor:      { emoji: '🩺', img: '/img/cat-doctor.jpg',      en: 'Doctors & clinics',   rw: 'Abaganga n\u2019amavuriro',   provider: { en: 'Doctor / clinic', rw: 'Umuganga / ivuriro' } },
    food:        { emoji: '🍎', img: '/img/cat-food.jpg',        en: 'Food shop',           rw: 'Ibiribwa',                    provider: { en: 'Food shop owner', rw: 'Umucuruzi w\u2019ibiribwa' } },
    furniture:   { emoji: '🛋️', img: '/img/cat-furniture.jpg',   en: 'Furniture',           rw: 'Ibikoresho byo mu nzu',       provider: { en: 'Furniture maker / seller', rw: 'Umucuruzi w\u2019ibikoresho byo mu nzu' } },
    electronics: { emoji: '📱', img: '/img/cat-electronics.jpg', en: 'Electronics',         rw: 'Ikoranabuhanga',              provider: { en: 'Electronics shop owner', rw: 'Umucuruzi w\u2019ikoranabuhanga' } },
    clothes:     { emoji: '👗', img: '/img/cat-clothes.jpg',     en: 'Clothes',             rw: 'Imyenda',                     provider: { en: 'Clothes shop owner', rw: 'Umucuruzi w\u2019imyenda' } },
    shoes:       { emoji: '👟', img: '/img/cat-shoes.jpg',       en: 'Shoes',               rw: 'Inkweto',                     provider: { en: 'Shoe shop owner', rw: 'Umucuruzi w\u2019inkweto' } },
    rental:      { emoji: '🏠', img: '/img/cat-rental.jpg',      en: 'Landlord & rentals',  rw: 'Amazu akodeshwa',             provider: { en: 'Landlord / rentals', rw: 'Nyir\u2019amazu akodeshwa' } },
    gym:         { emoji: '🏋️', img: '/img/cat-gym.jpg',         en: 'Gym & fitness',       rw: 'Siporo ngororamubiri',        provider: { en: 'Gym owner', rw: 'Nyiri gym' } },
    coach:       { emoji: '⚽', img: '/img/cat-coach.jpg',       en: 'Sports coaching',     rw: 'Abatoza ba siporo',           provider: { en: 'Sports coach', rw: 'Umutoza wa siporo' } },
    tutor:       { emoji: '📚', img: '/img/cat-tutor.jpg',       en: 'Tutors & education',  rw: 'Abarimu n\u2019inyigisho',    provider: { en: 'Educator / tutor', rw: 'Umwarimu / umufasha mu masomo' } },
    salon:       { emoji: '💇', img: '/img/cat-salon.jpg',       en: 'Beauty & salon',      rw: 'Ubwiza na salon',             provider: { en: 'Salon / beauty services', rw: 'Salon / serivisi z\u2019ubwiza' } },
    other:       { emoji: '🛍️', img: '/img/cat-other.jpg',       en: 'Other',               rw: 'Ibindi',                      provider: { en: 'Other services', rw: 'Izindi serivisi' } },
  };

  const I18N = {
    en: {
      navHome: 'Browse', navOrders: 'My orders', navDashboard: 'My shops', navAdmin: 'Admin',
      navLogin: 'Log in', navLogout: 'Log out', navSurvey: 'Feedback',
      heroTitle: 'Everything near you, on one map',
      heroSub: 'Search real shops, pharmacies, rentals, gyms, coaches and tutors near you — see what they offer, order, and pay with Mobile Money without leaving home.',
      searchPlaceholder: 'Search shops, products, services…',
      allCategories: 'All categories',
      shopsFound: (n) => `${n} shop${n === 1 ? '' : 's'} found`,
      noShops: 'No shops found yet. Try another category — or register your shop!',
      viewShop: 'View shop', items: 'items', ordersDone: 'completed orders',
      registerShopCta: 'Own a shop? List it free — first month free of charge',
      loginTitle: 'Welcome back', registerTitle: 'Create your account',
      loginTab: 'Log in', registerTab: 'Register',
      email: 'Email', password: 'Password (6+ characters)', fullName: 'Full name', phone: 'Phone (MTN/Airtel)',
      iAmCustomer: 'I want to buy — customer', iAmOwner: 'I sell or offer services — shop owner',
      submitLogin: 'Log in', submitRegister: 'Create account',
      authError: 'Login failed. Check your email and password.',
      registerError: 'Could not register. Email may already be in use, or a field is invalid.',
      myShops: 'My shops', addShop: 'Register a new shop',
      shopName: 'Shop / business name', category: 'Category', description: 'Description',
      contactPhone: 'Contact phone', address: 'Address / landmark',
      pickLocation: 'Tap the map to pin your exact shop location',
      locationSet: 'Location pinned', saveShop: 'Save shop', cancel: 'Cancel',
      freeTrialBanner: (d) => `Free listing until ${d} — no registration fee during your first month.`,
      feeAfterTrial: (f) => `After the free month: ${f} RWF/month listing fee.`,
      inventory: 'Inventory & services', addProduct: 'Add item',
      productName: 'Item / service name', price: 'Price (RWF)', stock: 'Stock (empty = unlimited/service)',
      unit: 'Unit (e.g. kg, session, month)', save: 'Save', edit: 'Edit', del: 'Delete',
      noProducts: 'No items yet. Add your products or services so customers can order.',
      shopOrders: 'Orders', noOrders: 'No orders yet.',
      confirm: 'Confirm', complete: 'Mark completed', cancelOrder: 'Cancel',
      statusLabel: { pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' },
      youReceive: 'You receive', platformFee: 'Platform fee (4%)',
      cart: 'Your order', addToCart: 'Add', emptyCart: 'Your cart is empty. Add items from the list.',
      subtotal: 'Subtotal', checkout: 'Order & pay with Mobile Money',
      momoPhone: 'Mobile Money phone number',
      deliveryMethod: 'How do you want to receive it?', pickup: 'Pickup at shop', delivery: 'Delivery',
      deliveryAddress: 'Delivery address',
      placeOrder: 'Confirm order', orderPlaced: 'Order placed!',
      orderPlacedBody: (code) => `Your order ${code} was sent to the shop. Payment is held via Mobile Money and released when the order is completed. Track it in “My orders”.`,
      viewMyOrders: 'View my orders', continueShopping: 'Continue browsing',
      loginToOrder: 'Log in to order',
      myOrdersTitle: 'My orders',
      orderFrom: 'from', total: 'Total', qty: 'Qty',
      needLogin: 'You need to log in first.',
      distanceAway: (km) => `${km} km away`,
      mapListToggleMap: 'Map', mapListToggleList: 'List',
      adminTitle: 'Platform dashboard',
      statUsers: 'Users', statShops: 'Shops', statOrders: 'Orders', statCompleted: 'Completed',
      statGmv: 'GMV (RWF)', statFees: 'Fee revenue (RWF)', statListing: 'Listing fees /month (RWF)', statTrial: 'Shops in free month',
      adminShops: 'All shops', adminRecent: 'Recent orders',
      trial: 'Free month', paying: 'Paying', owner: 'Owner',
      errGeneric: 'Something went wrong. Please try again.',
      outOfStock: 'Out of stock',
      inStock: (n) => `${n} in stock`,
      unlimited: 'Available',
      feeNote: 'Free to list. iSoko takes a small 4% fee only on completed orders — first month completely free of charge.',
      providerTypeLabel: 'What do you offer?',
      interestsLabel: 'Which services do you need? (choose any)',
      forYou: 'For you',
      forYouSub: 'Based on the services you told us you need',
      browseByCategory: 'Browse by category',
      myAccount: 'My dashboard',
      profileTitle: 'My profile',
      statOrdersMade: 'Orders placed',
      statCompletedOrders: 'Completed',
      statSpent: 'Total spent (RWF)',
      statShopsUsed: 'Shops ordered from',
      saveProfile: 'Save profile',
      profileSaved: 'Profile saved.',
      ordersTitle: 'Order history',
      shopPhoto: 'Shop photo',
      uploadPhoto: 'Upload photo',
      changePhoto: 'Change photo',
      photoHint: 'A good photo attracts more customers.',
      ordersPerDay: 'Orders per day (last 14 days)',
      revenueByCat: 'Completed sales by category (RWF)',
      welcomeBack: (name) => `Welcome back, ${name}!`,
    },
    rw: {
      navHome: 'Shakisha', navOrders: 'Ibyo natumije', navDashboard: 'Amaduka yanjye', navAdmin: 'Ubuyobozi',
      navLogin: 'Injira', navLogout: 'Sohoka', navSurvey: 'Ibitekerezo',
      heroTitle: 'Ibiri hafi yawe byose, ku ikarita imwe',
      heroSub: 'Shakisha amaduka, farumasi, amazu akodeshwa, siporo, abatoza n\u2019abarimu bari hafi yawe — urebe ibyo batanga, utumize, wishyure na Mobile Money utavuye mu rugo.',
      searchPlaceholder: 'Shakisha amaduka, ibicuruzwa, serivisi…',
      allCategories: 'Ibyiciro byose',
      shopsFound: (n) => `Habonetse amaduka ${n}`,
      noShops: 'Nta maduka araboneka. Gerageza ikindi cyiciro — cyangwa wandikishe iryawe!',
      viewShop: 'Reba iduka', items: 'ibintu', ordersDone: 'ibyagurishijwe',
      registerShopCta: 'Ufite iduka? Ryandikishe ku buntu — ukwezi kwa mbere ni ubuntu',
      loginTitle: 'Murakaza neza', registerTitle: 'Fungura konti yawe',
      loginTab: 'Injira', registerTab: 'Iyandikishe',
      email: 'Imeyili', password: 'Ijambobanga (inyuguti 6+)', fullName: 'Amazina yombi', phone: 'Telefoni (MTN/Airtel)',
      iAmCustomer: 'Ndashaka kugura — umuguzi', iAmOwner: 'Ndagurisha cyangwa ntanga serivisi — umucuruzi',
      submitLogin: 'Injira', submitRegister: 'Fungura konti',
      authError: 'Kwinjira byanze. Reba imeyili n\u2019ijambobanga.',
      registerError: 'Kwiyandikisha byanze. Imeyili ishobora kuba yarakoreshejwe.',
      myShops: 'Amaduka yanjye', addShop: 'Andikisha iduka rishya',
      shopName: 'Izina ry\u2019iduka / ubucuruzi', category: 'Icyiciro', description: 'Ibisobanuro',
      contactPhone: 'Telefoni', address: 'Aderesi / ahantu hazwi',
      pickLocation: 'Kanda ku ikarita werekane aho iduka riri',
      locationSet: 'Aho riri hashyizweho', saveShop: 'Bika iduka', cancel: 'Reka',
      freeTrialBanner: (d) => `Kwandikwa ni ubuntu kugeza ${d} — nta mafaranga y\u2019iyandikisha mu kwezi kwa mbere.`,
      feeAfterTrial: (f) => `Nyuma y\u2019ukwezi k\u2019ubuntu: ${f} RWF ku kwezi.`,
      inventory: 'Ibicuruzwa na serivisi', addProduct: 'Ongeraho',
      productName: 'Izina ry\u2019igicuruzwa / serivisi', price: 'Igiciro (RWF)', stock: 'Umubare uhari (usige ubusa = serivisi)',
      unit: 'Ingero (kg, isomo, ukwezi…)', save: 'Bika', edit: 'Hindura', del: 'Siba',
      noProducts: 'Nta bintu birashyirwaho. Ongeraho ibicuruzwa cyangwa serivisi kugira ngo abaguzi batumize.',
      shopOrders: 'Ibyatumijwe', noOrders: 'Nta cyatumizwa kirabaho.',
      confirm: 'Emeza', complete: 'Byarangiye', cancelOrder: 'Hagarika',
      statusLabel: { pending: 'Bitegereje', confirmed: 'Byemejwe', completed: 'Byarangiye', cancelled: 'Byahagaritswe' },
      youReceive: 'Ubona', platformFee: 'Umusanzu wa iSoko (4%)',
      cart: 'Ibyo utumiza', addToCart: 'Ongeraho', emptyCart: 'Nta kintu urahitamo. Hitamo mu rutonde.',
      subtotal: 'Igiteranyo', checkout: 'Tumiza wishyure na Mobile Money',
      momoPhone: 'Numero ya Mobile Money',
      deliveryMethod: 'Wifuza kubona ibyo watumije gute?', pickup: 'Kubifatira ku iduka', delivery: 'Kubinzanirwa',
      deliveryAddress: 'Aho bizanwa',
      placeOrder: 'Emeza itumiza', orderPlaced: 'Byoherejwe!',
      orderPlacedBody: (code) => `Itumiza ryawe ${code} ryoherejwe ku iduka. Ubwishyu bufatirwa kuri Mobile Money, bugahabwa iduka iyo itumiza rirangiye. Rikurikirane muri “Ibyo natumije”.`,
      viewMyOrders: 'Reba ibyo natumije', continueShopping: 'Komeza ushakishe',
      loginToOrder: 'Injira kugira ngo utumize',
      myOrdersTitle: 'Ibyo natumije',
      orderFrom: 'kuri', total: 'Igiteranyo', qty: 'Umubare',
      needLogin: 'Banza winjire.',
      distanceAway: (km) => `${km} km uvuye aho uri`,
      mapListToggleMap: 'Ikarita', mapListToggleList: 'Urutonde',
      adminTitle: 'Imbonerahamwe y\u2019urubuga',
      statUsers: 'Abakoresha', statShops: 'Amaduka', statOrders: 'Ibyatumijwe', statCompleted: 'Ibyarangiye',
      statGmv: 'Agaciro k\u2019ibyagurishijwe (RWF)', statFees: 'Umusanzu winjiye (RWF)', statListing: 'Iyandikisha /ukwezi (RWF)', statTrial: 'Amaduka mu kwezi k\u2019ubuntu',
      adminShops: 'Amaduka yose', adminRecent: 'Ibyatumijwe vuba',
      trial: 'Ukwezi k\u2019ubuntu', paying: 'Barishyura', owner: 'Nyir\u2019iduka',
      errGeneric: 'Habaye ikibazo. Ongera ugerageze.',
      outOfStock: 'Byashize',
      inStock: (n) => `Hasigaye ${n}`,
      unlimited: 'Birahari',
      feeNote: 'Kwandikisha ni ubuntu. iSoko ifata 4% gusa ku byagurishijwe — ukwezi kwa mbere ni ubuntu bwuzuye.',
      providerTypeLabel: 'Utanga iki?',
      interestsLabel: 'Ni izihe serivisi ukeneye? (hitamo izo ushaka)',
      forYou: 'Byagenewe wowe',
      forYouSub: 'Bishingiye ku serivisi watubwiye ko ukeneye',
      browseByCategory: 'Shakisha mu byiciro',
      myAccount: 'Imbonerahamwe yanjye',
      profileTitle: 'Umwirondoro wanjye',
      statOrdersMade: 'Ibyo natumije',
      statCompletedOrders: 'Ibyarangiye',
      statSpent: 'Yose nakoresheje (RWF)',
      statShopsUsed: 'Amaduka naguzeho',
      saveProfile: 'Bika umwirondoro',
      profileSaved: 'Umwirondoro wabitswe.',
      ordersTitle: 'Amateka y\u2019ibyatumijwe',
      shopPhoto: 'Ifoto y\u2019iduka',
      uploadPhoto: 'Shyiraho ifoto',
      changePhoto: 'Hindura ifoto',
      photoHint: 'Ifoto nziza ikurura abakiriya benshi.',
      ordersPerDay: 'Ibyatumijwe ku munsi (iminsi 14 ishize)',
      revenueByCat: 'Ibyagurishijwe mu byiciro (RWF)',
      welcomeBack: (name) => `Murakaza neza, ${name}!`,
    },
  };

  let lang = localStorage.getItem('isoko_lang') || 'en';
  const t = (key, ...args) => {
    const v = (I18N[lang] || I18N.en)[key];
    return typeof v === 'function' ? v(...args) : v ?? key;
  };
  const catLabel = (id) => (CATEGORIES[id] ? `${CATEGORIES[id].emoji} ${CATEGORIES[id][lang]}` : id);

  function setLang(next) {
    lang = next;
    localStorage.setItem('isoko_lang', next);
    document.documentElement.lang = next;
    location.reload();
  }

  // ---- API client ----
  const token = () => localStorage.getItem('isoko_token') || '';

  async function api(pathname, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token()) headers.Authorization = 'Bearer ' + token();
    const res = await fetch(pathname, {
      method: opts.method || 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || 'request_failed'), { status: res.status, error: data.error });
    return data;
  }

  let cachedUser;
  async function currentUser() {
    if (cachedUser !== undefined) return cachedUser;
    if (!token()) return (cachedUser = null);
    try {
      cachedUser = (await api('/api/me')).user;
    } catch {
      cachedUser = null;
    }
    return cachedUser;
  }

  function logout() {
    api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('isoko_token');
    localStorage.removeItem('isoko_user');
    location.href = '/';
  }

  // ---- Cart (single-shop cart) ----
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('isoko_cart')) || { shopId: null, items: {} };
    } catch {
      return { shopId: null, items: {} };
    }
  }
  function setCart(cart) {
    localStorage.setItem('isoko_cart', JSON.stringify(cart));
  }
  function clearCart() {
    localStorage.removeItem('isoko_cart');
  }

  // ---- Header ----
  async function renderHeader(active) {
    const user = await currentUser();
    const header = document.getElementById('site-header');
    if (!header) return user;
    const link = (href, key, id) =>
      `<a href="${href}" class="nav-link${active === id ? ' active' : ''}">${t(key)}</a>`;
    let links = link('/', 'navHome', 'home');
    if (user && user.role === 'customer') links += link('/orders.html', 'myAccount', 'orders');
    if (user && (user.role === 'owner' || user.role === 'admin')) links += link('/dashboard.html', 'navDashboard', 'dashboard');
    if (user && user.role === 'admin') links += link('/platform-admin.html', 'navAdmin', 'admin');
    links += link('/survey.html', 'navSurvey', 'survey');

    header.innerHTML = `
      <a class="brand" href="/">
        <span class="brand-mark">iS</span>
        <span class="brand-name">iSoko <em>Rwanda</em></span>
      </a>
      <nav class="nav-links">${links}</nav>
      <div class="header-right">
        <div class="lang-toggle" role="group" aria-label="Language">
          <button type="button" data-lang="en" class="${lang === 'en' ? 'active' : ''}">EN</button>
          <button type="button" data-lang="rw" class="${lang === 'rw' ? 'active' : ''}">RW</button>
        </div>
        ${
          user
            ? `<span class="user-chip" title="${user.email}">${user.name.split(' ')[0]}</span>
               <button class="btn btn-ghost btn-sm" id="logoutBtn">${t('navLogout')}</button>`
            : `<a class="btn btn-primary btn-sm" href="/auth.html">${t('navLogin')}</a>`
        }
      </div>`;
    header.querySelectorAll('.lang-toggle button').forEach((b) =>
      b.addEventListener('click', () => setLang(b.dataset.lang))
    );
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    return user;
  }

  const money = (n) => Number(n || 0).toLocaleString('en-US') + ' RWF';
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const catImg = (id) => (CATEGORIES[id] ? CATEGORIES[id].img : '/img/cat-other.jpg');
  const shopPhoto = (shop) => shop.photo || catImg(shop.category);

  /** Read a picked image file, downscale it on a canvas, return a compact JPEG data URL. */
  function fileToDataUrl(file, maxDim = 1000) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  window.ISOKO = {
    CATEGORIES, t, lang: () => lang, setLang, catLabel, catImg, shopPhoto,
    api, currentUser, logout, renderHeader,
    getCart, setCart, clearCart,
    money, esc, fileToDataUrl,
  };
})();
