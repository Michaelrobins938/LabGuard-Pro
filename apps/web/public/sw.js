// LabGuard-Pro Service Worker for West Nile Virus Laboratory System
// Provides offline functionality for mobile sample intake and critical operations

const CACHE_NAME = 'labguard-wnv-v1.0.0';
const API_CACHE_NAME = 'labguard-api-v1.0.0';
const IMAGES_CACHE_NAME = 'labguard-images-v1.0.0';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/mobile/sample-intake',
  '/mobile/quick-scan',
  '/mobile/pcr-status',
  '/dashboard',
  '/surveillance/map',
  '/manifest.json',
  // Core app files
  '/_next/static/css/',
  '/_next/static/js/',
  // Fonts
  '/fonts/inter-var.woff2',
  // Icons
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico'
];

// API endpoints that should be cached
const CACHEABLE_API_ROUTES = [
  '/api/trap-locations',
  '/api/mosquito-species',
  '/api/equipment',
  '/api/users/profile',
  '/api/laboratory/settings'
];

// API endpoints for background sync
const SYNC_API_ROUTES = [
  '/api/mosquito-pools',
  '/api/pcr-batches',
  '/api/surveillance-alerts'
];

// Maximum cache sizes
const MAX_API_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 100;
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== IMAGES_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
  } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle API requests with network-first strategy for critical data
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const isCacheableRoute = CACHEABLE_API_ROUTES.some(route => 
    url.pathname.startsWith(route)
  );

  if (isCacheableRoute) {
    return networkFirstStrategy(request, API_CACHE_NAME);
  } else {
    // For non-cacheable routes, try network first, fallback to offline message
    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      console.log('[SW] API request failed, device offline:', url.pathname);
      return new Response(
        JSON.stringify({ 
          error: 'Device offline', 
          message: 'This operation requires an internet connection',
          timestamp: new Date().toISOString()
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  return cacheFirstStrategy(request, IMAGES_CACHE_NAME);
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  return cacheFirstStrategy(request, CACHE_NAME);
}

// Network-first strategy for API data
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await trimCache(cacheName, MAX_API_CACHE_SIZE);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cached response is still valid
      const cachedDate = new Date(cachedResponse.headers.get('date'));
      const now = new Date();
      
      if (now - cachedDate < CACHE_EXPIRY_TIME) {
        return cachedResponse;
      }
    }
    
    throw error;
  }
}

// Cache-first strategy for static assets and images
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      if (cacheName === IMAGES_CACHE_NAME) {
        await trimCache(cacheName, MAX_IMAGE_CACHE_SIZE);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch resource:', request.url);
    
    // Return offline fallback for pages
    if (request.headers.get('accept').includes('text/html')) {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/offline.html') || new Response(
        createOfflinePage(),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    
    throw error;
  }
}

// Trim cache to maximum size
async function trimCache(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sample-upload') {
    event.waitUntil(syncOfflineSamples());
  } else if (event.tag === 'photo-upload') {
    event.waitUntil(syncOfflinePhotos());
  }
});

// Sync offline samples when connection is restored
async function syncOfflineSamples() {
  try {
    console.log('[SW] Syncing offline samples...');
    
    // Get offline samples from IndexedDB
    const offlineSamples = await getOfflineData('samples');
    
    for (const sample of offlineSamples) {
      try {
        const response = await fetch('/api/mosquito-pools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sample.data)
        });
        
        if (response.ok) {
          await removeOfflineData('samples', sample.id);
          console.log('[SW] Sample synced successfully:', sample.id);
          
          // Notify all clients about successful sync
          notifyClients({
            type: 'SYNC_SUCCESS',
            data: { id: sample.id, type: 'sample' }
          });
        }
      } catch (error) {
        console.error('[SW] Failed to sync sample:', sample.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync offline photos when connection is restored
async function syncOfflinePhotos() {
  try {
    console.log('[SW] Syncing offline photos...');
    
    const offlinePhotos = await getOfflineData('photos');
    
    for (const photo of offlinePhotos) {
      try {
        const formData = new FormData();
        formData.append('photo', photo.blob);
        formData.append('sampleId', photo.sampleId);
        
        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          await removeOfflineData('photos', photo.id);
          console.log('[SW] Photo synced successfully:', photo.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync photo:', photo.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Photo sync failed:', error);
  }
}

// Handle push notifications for surveillance alerts
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (!event.data) return;
  
  try {
    const payload = event.data.json();
    const options = {
      body: payload.body || 'New surveillance alert',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: payload.tag || 'surveillance-alert',
      requireInteraction: payload.priority === 'HIGH' || payload.priority === 'CRITICAL',
      actions: [
        {
          action: 'view',
          title: 'View Alert',
          icon: '/icons/view-action.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss-action.png'
        }
      ],
      data: payload.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(payload.title || 'LabGuard Alert', options)
    );
  } catch (error) {
    console.error('[SW] Error handling push notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/surveillance/alerts';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Utility functions for offline data management
async function getOfflineData(store) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LabGuardOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const getAllRequest = objectStore.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('samples')) {
        db.createObjectStore('samples', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' });
      }
    };
  });
}

async function removeOfflineData(store, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LabGuardOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const deleteRequest = objectStore.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Notify all clients about sync events
function notifyClients(message) {
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage(message);
      });
    });
}

// Create offline page HTML
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LabGuard - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          opacity: 0.8;
        }
        h1 {
          margin: 0 0 16px;
          font-size: 24px;
        }
        p {
          margin: 0 0 24px;
          opacity: 0.9;
          line-height: 1.6;
        }
        .retry-btn {
          background: white;
          color: #1e40af;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        }
        .retry-btn:hover {
          background: #f8fafc;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
        </div>
        <h1>You're Offline</h1>
        <p>Please check your internet connection and try again. Some features may be available offline.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
}

console.log('[SW] Service worker script loaded');