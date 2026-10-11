import { VAPID_PUBLIC_KEY } from './config'
import { writeLog } from './logs'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i)
  return output
}

export async function registerPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, error: 'Este navegador nao suporta push.' }
  }
  const reg = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
  if (!VAPID_PUBLIC_KEY) {
    writeLog('push.preparado', 'Service worker ativo. VAPID ainda nao configurado.')
    return { ok: true, demo: true }
  }
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return { ok: false, error: 'Permissao de notificacao negada.' }
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })
  writeLog('push.inscrito', JSON.stringify(sub.toJSON()).slice(0, 120))
  return { ok: true, subscription: sub }
}

export async function demoNotify(title, body) {
  if (Notification.permission !== 'granted') {
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return false
  }
  new Notification(title, { body, icon: `${import.meta.env.BASE_URL}favicon.svg` })
  writeLog('push.demo', title)
  return true
}
