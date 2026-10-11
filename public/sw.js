self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('push', (event) => {
  let data = { title: 'Ana', body: 'Voce tem um aviso novo.' }
  try {
    data = { ...data, ...event.data.json() }
  } catch {
    /* keep default */
  }
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body }))
})
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/anaterapeuta/app/avisos'))
})
