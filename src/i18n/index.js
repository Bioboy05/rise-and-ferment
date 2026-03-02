import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import { SUPPORTED_LANGUAGES } from '../constants/languages'
import { resolveInitialLanguage } from '../utils/languageDetection'

const savedLanguage = resolveInitialLanguage('en')

// Lazy-load locale files — only the active language loads at startup.
// Others are fetched on demand when the user switches language.
const LOCALE_LOADERS = {
  ro: () => import('./locales/ro.json'),
  de: () => import('./locales/de.json'),
  fr: () => import('./locales/fr.json'),
  es: () => import('./locales/es.json'),
  it: () => import('./locales/it.json'),
  hu: () => import('./locales/hu.json'),
}

async function loadLocale(lang) {
  if (lang === 'en' || i18n.hasResourceBundle(lang, 'translation')) return
  const loader = LOCALE_LOADERS[lang]
  if (!loader) return
  const module = await loader()
  const data = module.default || module
  const merged = { ...en.translation, ...(data.translation || data) }
  i18n.addResourceBundle(lang, 'translation', merged, true, true)
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...en.translation } },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  returnNull: false,
  returnEmptyString: false,
})

// Load active language (if not English) right after init
if (savedLanguage !== 'en') {
  loadLocale(savedLanguage)
}

// Hook into language change — load new locale on switch, then re-render
i18n.on('languageChanged', async (lang) => {
  if (lang !== 'en' && !i18n.hasResourceBundle(lang, 'translation')) {
    await loadLocale(lang)
    // Resources are now loaded — re-trigger so components re-render
    i18n.changeLanguage(lang)
  }
})

export default i18n
