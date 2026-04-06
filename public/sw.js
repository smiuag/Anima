const CACHE = 'anima-fichas-v1'
const BASE = '/Anima/'

// Assets to precache on install
const PRECACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'ficha_anima.pdf',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  // Only handle GET requests for same-origin or BASE assets
  if (e.request.method !== 'GET') return
  // Network-first for Supabase API calls — never cache auth/data requests
  if (e.request.url.includes('supabase.co')) return

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      try {
        const resp = await fetch(e.request)
        // Cache successful HTML/JS/CSS/font responses
        if (resp.ok && (resp.type === 'basic' || resp.type === 'cors')) {
          cache.put(e.request, resp.clone())
        }
        return resp
      } catch {
        // Offline — serve from cache
        const cached = await cache.match(e.request)
        if (cached) return cached
        // Fallback for navigation requests
        if (e.request.mode === 'navigate') {
          return cache.match(BASE + 'index.html')
        }
      }
    })
  )
})
