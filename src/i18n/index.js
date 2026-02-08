import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ro from './locales/ro.json'
import en from './locales/en.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import it from './locales/it.json'

// Read persisted language from Zustand's localStorage entry
const VALID_LANGUAGES = ['ro', 'en', 'de', 'fr', 'es', 'it']
let savedLanguage = 'en'
try {
  const stored = localStorage.getItem('riseFermentSettings')
  if (stored) {
    const parsed = JSON.parse(stored)
    const lang = parsed.state?.language
    if (typeof lang === 'string' && VALID_LANGUAGES.includes(lang)) {
      savedLanguage = lang
    }
  }
} catch {
  // fallback to 'en'
}

i18n.use(initReactI18next).init({
  resources: { ro, en, de, fr, es, it },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
