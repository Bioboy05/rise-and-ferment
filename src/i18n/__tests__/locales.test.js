import { describe, it, expect } from 'vitest'
import en from '../locales/en.json'
import ro from '../locales/ro.json'
import de from '../locales/de.json'
import fr from '../locales/fr.json'
import es from '../locales/es.json'
import it_ from '../locales/it.json'
import hu from '../locales/hu.json'

const enKeys = Object.keys(en.translation).sort()

const locales = [
  ['ro', ro],
  ['de', de],
  ['fr', fr],
  ['es', es],
  ['it', it_],
  ['hu', hu],
]

describe('i18n key completeness', () => {
  it.each(locales)('%s has all English keys', (lang, locale) => {
    const localeKeys = new Set(Object.keys(locale.translation))
    const missing = enKeys.filter(k => !localeKeys.has(k))
    expect(missing).toEqual([])
  })
})
