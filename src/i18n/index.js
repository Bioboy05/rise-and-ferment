import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ro from './locales/ro.json'
import en from './locales/en.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import it from './locales/it.json'
import { SUPPORTED_LANGUAGES } from '../constants/languages'
import { resolveInitialLanguage } from '../utils/languageDetection'

const savedLanguage = resolveInitialLanguage('en')

i18n.use(initReactI18next).init({
  resources: {
    ro: { translation: { ...en.translation, ...ro.translation } },
    en: { translation: { ...en.translation } },
    de: { translation: { ...en.translation, ...de.translation } },
    fr: { translation: { ...en.translation, ...fr.translation } },
    es: { translation: { ...en.translation, ...es.translation } },
    it: { translation: { ...en.translation, ...it.translation } },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
})

export default i18n
