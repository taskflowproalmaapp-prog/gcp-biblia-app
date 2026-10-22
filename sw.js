/* Service worker — Biblia GCP
   - HTML, JSON y JS: primero red (siempre lo más nuevo); si no hay conexión, usa la copia guardada.
   - Imágenes y audio: primero caché (no cambian casi nunca).
   Subir el número de CACHE borra las copias viejas en todos los dispositivos. */
const CACHE = 'biblia-gcp-v2';
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
    caches.open(CACHE)
      .then(c => Promise.all(STATIC.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Clave de caché sin ?v=...&cb=... para no acumular una copia por cada carga */
function cacheKey(req) {
  const url = new URL(req.url);
  url.search = '';
  return url.toString();
}

function isFresh(req, url) {
  return req.mode === 'navigate' || /\.(html|json|js)$/.test(url.pathname) || url.pathname === '/';
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // CDNs y externos: sin tocar
  if (url.pathname.startsWith('/.netlify/')) return;    // funciones (IA): sin caché

  if (isFresh(req, url)) {
    // Red primero, revalidando con el servidor; copia guardada solo sin conexión
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(cacheKey(req), clone));
        }
        return res;
      }).catch(() =>
        caches.match(cacheKey(req)).then(c => c || caches.match('/index.html'))
      )
    );
    return;
  }

  // Imágenes, audio y demás: caché primero
  e.respondWith(
    caches.match(cacheKey(req)).then(cached => cached || fetch(req).then(res => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(cacheKey(req), clone));
      }
      return res;
    }))
  );
});
