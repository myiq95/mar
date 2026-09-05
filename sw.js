
const CACHE_NAME = 'marvin3-v2-offline-fix';
const BASE = self.location.pathname.replace(/[^/]*$/, '');
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192x192.png',
  BASE + 'icons/icon-512x512.png'
];
const CDN_ASSETS = [
  'https://unpkg.com/mammoth@1.6.0/mammoth.browser.min.js'
];

self.addEventListener('install', e => {
  console.log('[SW] install', BASE);
  e.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try { await cache.addAll(ASSETS); } catch(err){ console.warn('cache addAll failed', err); }
      try { await cache.addAll(CDN_ASSETS); } catch(err){ console.warn('CDN cache failed', err); }
      // cache current page itself
      const reqs = await cache.keys();
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // only handle GET
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        // cache same-origin and CDN
        if(res.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes('mammoth'))){
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c=>c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // offline fallback for navigation
        if(e.request.mode === 'navigate'){
          return caches.match(BASE + 'index.html') || caches.match(BASE);
        }
      });
    })
  );
});
