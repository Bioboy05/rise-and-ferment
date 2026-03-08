import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary'

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

const params = new URLSearchParams(window.location.search)
const redirectPath = params.get('path')
const isSafeRedirectPath =
  typeof redirectPath === 'string' && redirectPath.startsWith('/') && !redirectPath.startsWith('//')
if (isSafeRedirectPath) {
  window.history.replaceState(null, '', redirectPath)
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason)
})

const isAppHtmlRoute = window.location.pathname.startsWith('/app.html')
const routerBase = isAppHtmlRoute ? '/app.html' : '/app'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={routerBase}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
