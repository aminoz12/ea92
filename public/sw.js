// Service Worker for Espace Auto 92
// Provides intelligent caching for better performance

const CACHE_NAME = 'Espace Auto 92-v1.0.2'
const STATIC_CACHE = 'static-v1.0.2'
const DYNAMIC_CACHE = 'dynamic-v1.0.2'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/logo.png',
  '/vid2.mp4',
  '/index.html',
  '/manifest.json'
]

// Resources to cache on demand
const CACHEABLE_PATTERNS = [
  /\.(png|jpg|jpeg|gif|webp|svg)$/,
  /\.(mp4|webm|ogg)$/,
  /\.(css|js)$/,
  /\.(woff|woff2|ttf|eot)$/
]

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching critical resources')
        return cache.addAll(CRITICAL_RESOURCES)
      })
      .then(() => {
        console.log('✅ Critical resources cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip external requests (except fonts and images)
  if (url.origin !== location.origin) {
    // Cache external fonts and images
    if (url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            return cache.match(request)
              .then((response) => {
                if (response) {
                  return response
                }
                return fetch(request)
                  .then((fetchResponse) => {
                    // Responses for fonts may be opaque; cache without inspection.
                    cache.put(request, fetchResponse.clone())
                    return fetchResponse
                  })
                  .catch(() => cache.match(request))
              })
          })
      )
    }
    return
  }
  
  // Handle different resource types
  if (isImageOrVideo(request.url)) {
    event.respondWith(handleImageOrVideo(request))
  } else if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// Helper functions
function isImageOrVideo(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|ogg)$/i.test(url)
}

function isStaticAsset(url) {
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(url)
}

function handleImageOrVideo(request) {
  return caches.open(DYNAMIC_CACHE)
    .then((cache) => {
      return cache.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok && fetchResponse.type === 'basic') {
                cache.put(request, fetchResponse.clone())
              }
              return fetchResponse
            })
            .catch(() => cache.match(request))
        })
    })
}

function handleStaticAsset(request) {
  return caches.open(STATIC_CACHE)
    .then((cache) => {
      return cache.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok && fetchResponse.type === 'basic') {
                cache.put(request, fetchResponse.clone())
              }
              return fetchResponse
            })
            .catch(() => cache.match(request))
        })
    })
}

function handlePageRequest(request) {
  return caches.open(DYNAMIC_CACHE)
    .then((cache) => {
      return cache.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(request)
            .then((fetchResponse) => {
              // Only cache successful same-origin responses
              if (fetchResponse.ok && fetchResponse.type === 'basic') {
                cache.put(request, fetchResponse.clone())
              }
              return fetchResponse
            })
            .catch(() => cache.match(request))
        })
    })
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered')
    // Handle offline form submissions, etc.
  }
})

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

console.log('🎯 Espace Auto 92 Service Worker loaded')
