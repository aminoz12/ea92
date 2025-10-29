// Service Worker Registration
// Registers the service worker for caching and offline functionality

export function registerServiceWorker() {
  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
  if ('serviceWorker' in navigator && !isLocalhost) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New content available, refreshing...')
                  // Optionally show update notification to user
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error)
        })
    })
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
        console.log('🗑️ Service Worker unregistered')
      })
    })
  }
}
