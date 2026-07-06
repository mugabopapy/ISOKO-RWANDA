/* iSoko service worker: cache static assets so the app opens fast and works
   on weak connections. API calls always go to the network. */
const CACHE = 'isoko-v2';
const SHELL = [
  '/styles.css',
  '/market.css',
  '/common.js',
  '/manifest.webmanifest',
  '/img/icon-192.png',
  '/img/hero-market.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // live data, never cached

  // Static assets: cache-first with background refresh; pages: network-first.
  const isStatic = /\.(css|js|jpg|jpeg|png|webp|svg|webmanifest)$/.test(url.pathname);
  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        const refresh = fetch(e.request)
          .then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
            return res;
          })
          .catch(() => hit);
        return hit || refresh;
      })
    );
  } else {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then((hit) => hit || caches.match('/'))));
  }
});
