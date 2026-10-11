import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './lib/auth'
import { ToastProvider } from './lib/toast'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}

const rawBase = import.meta.env.BASE_URL.replace(/\/$/, '')
const basename = rawBase === '' || rawBase === '/' ? undefined : rawBase

try {
  const redirect = sessionStorage.getItem('ana.redirect')
  if (redirect) {
    sessionStorage.removeItem('ana.redirect')
    const prefix = basename || ''
    const next = redirect.startsWith(prefix) ? redirect.slice(prefix.length) || '/' : redirect
    if (next && next !== '/' && next !== window.location.pathname) {
      window.history.replaceState(null, '', prefix + next)
    }
  }
} catch {
  /* ignore */
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
