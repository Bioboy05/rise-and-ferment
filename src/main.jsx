import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'

// Apply theme/glass attributes before first render to avoid layout/theme flash.
try {
  const raw = localStorage.getItem('riseFermentSettings')
  const parsed = raw ? JSON.parse(raw) : null
  const storedTheme = parsed?.state?.theme ?? parsed?.theme
  const initialTheme = storedTheme === 'light' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', initialTheme)
} catch {
  document.documentElement.setAttribute('data-theme', 'dark')
}
document.documentElement.setAttribute('data-glass', 'glassy')

// Clean up legacy service workers/caches from old builds so updates show immediately.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })
}
if ('caches' in window) {
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
}

const params = new URLSearchParams(window.location.search)
const redirectPath = params.get('path')
const isSafeRedirectPath =
  typeof redirectPath === 'string' && redirectPath.startsWith('/') && !redirectPath.startsWith('//')
if (isSafeRedirectPath) {
  window.history.replaceState(null, '', redirectPath)
}

const isAppHtmlRoute = window.location.pathname.startsWith('/app.html')
const isAppRoute = window.location.pathname === '/app' || window.location.pathname.startsWith('/app/')
const routerBase = isAppHtmlRoute ? '/app.html' : isAppRoute ? '/app' : '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
