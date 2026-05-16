const CACHE_NAME = 'akit-chat-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Laisser passer toutes les requêtes normalement
});
