const CACHE = 'biblia-gcp-v1';
const STATIC = [
  '/',
  '/index.html',
  '/bible.json',
  '/temas.json',
  '/summaries.json',
  '/personajes.json',
  '/profecias.json',
  '/timeline.json',
  '/sabias.json',
  '/linaje.json',
  '/assets/logo.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo cachear GET
  if (e.request.method !== 'GET') return;
  // No cachear funciones de Netlify
  if (e.request.url.includes('/.netlify/')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached);
    })
  );
});
