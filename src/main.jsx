import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'

const params = new URLSearchParams(window.location.search)
const redirectPath = params.get('path')
if (redirectPath) {
  window.history.replaceState(null, '', redirectPath)
}

const isAppRoute =
  window.location.pathname.startsWith('/app') ||
  window.location.pathname.startsWith('/app.html')
const routerBase = isAppRoute ? '/app' : '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
