// ===== SERVICE WORKER AKIT_CHAT =====
// Gère le cache et le mode hors ligne

const CACHE_NAME = ‘akit-chat-v1’;
const CACHE_FILES = [
‘/’,
‘/index.html’,
‘/accueil.html’,
‘/test.html’,
‘/manifest.json’,
‘/icon-192.png’,
‘/icon-512.png’
];

// Installation : mettre en cache les fichiers essentiels
self.addEventListener(‘install’, event => {
console.log(’[SW] Installation…’);
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
console.log(’[SW] Mise en cache des fichiers’);
return cache.addAll(CACHE_FILES).catch(err => {
console.log(’[SW] Erreur cache (normal si première fois):’, err);
});
})
);
self.skipWaiting();
});

// Activation : supprimer les anciens caches
self.addEventListener(‘activate’, event => {
console.log(’[SW] Activation…’);
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
)
)
);
self.clients.claim();
});

// Fetch : répondre avec le cache si disponible, sinon réseau
self.addEventListener(‘fetch’, event => {
// Ne pas intercepter les requêtes Firebase / Cloudinary / CDN
const url = event.request.url;
if (
url.includes(‘firebasejs’) ||
url.includes(‘firebaseapp.com’) ||
url.includes(‘googleapis.com’) ||
url.includes(‘cloudinary.com’) ||
url.includes(‘cdnjs.cloudflare.com’) ||
url.includes(‘fonts.googleapis.com’) ||
url.includes(‘anthropic.com’)
) {
return; // Laisser passer sans cache
}

event.respondWith(
caches.match(event.request).then(cached => {
if (cached) return cached;
return fetch(event.request).then(response => {
// Mettre en cache la nouvelle ressource
if (response && response.status === 200 && event.request.method === ‘GET’) {
const responseClone = response.clone();
caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, responseClone);
});
}
return response;
}).catch(() => {
// Hors ligne : retourner la page principale en cache
if (event.request.destination === ‘document’) {
return caches.match(’/index.html’);
}
});
})
);
});

// Notification push (pour les futurs messages)
self.addEventListener(‘push’, event => {
const data = event.data ? event.data.json() : {};
const title = data.title || ‘🔔 AKIT_CHAT’;
const options = {
body: data.body || ‘Nouvelle notification’,
icon: ‘/icon-192.png’,
badge: ‘/icon-192.png’,
vibrate: [200, 100, 200],
data: { url: data.url || ‘/’ }
};
event.waitUntil(self.registration.showNotification(title, options));
});

// Clic sur notification
self.addEventListener(‘notificationclick’, event => {
event.notification.close();
event.waitUntil(
clients.openWindow(event.notification.data.url || ‘/’)
);
});