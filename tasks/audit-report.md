# Audit Report — Rise & Ferment

**Data:** 2026-02-26
**Branch:** main (commit c5f9c4e)
**Build:** `npm run build` — PASS (0 erori, 18 precache entries, 1013 KB)

---

## 1. Formulare (handleLead, handleNL) — Conexiune MailerLite

**Status: FUNCȚIONAL**

Ambele formulare sunt conectate real la MailerLite prin serverless function:

- `handleLead(e)` (linia 1897): Trimite la Netlify Forms + `subscribeMailerLite(email, 'guide')` + deschide PDF + showToast
- `handleNL(e)` (linia 1915): Trimite la Netlify Forms + `subscribeMailerLite(email, 'newsletter')` + showToast
- Exit popup (linia 1992): Same flow ca handleLead
- Sticky CTA (linia 2024): Same flow ca handleLead

`subscribeMailerLite()` (linia 1894) face POST la `/.netlify/functions/subscribe` cu `{email, form}`. Funcția serverless (netlify/functions/subscribe.mjs) proxy-uiește către MailerLite API cu API key din env vars. Grupurile: guide (180187655996179636), newsletter (180410570589079079).

**Verificat end-to-end:** subscriberi apar în MailerLite, automatizarea trimite PDF-ul.

---

## 2. Mobile UX

**Status: BUN, dar toast + responsive existente deja**

Ce EXISTĂ deja:
- `viewport-fit=cover` pe meta viewport ✓
- `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-title` ✓
- `min-height: 100dvh` pe body ✓
- Touch targets 44px pe butoane (.btn, .nav__cta, .lead__sub, etc.) ✓
- `font-size: 16px !important` pe inputuri (previne iOS zoom) ✓
- Toast notification system complet (CSS + HTML + showToast/hideToast JS) ✓
- Toast-uri afișate în handleLead și handleNL ✓
- Responsive breakpoints: 1024px, 768px, 480px ✓
- Hero single column la 1024px (nu 768px) ✓
- Form single column la 480px ✓
- Mobile hamburger menu cu overlay ✓

Ce LIPSEȘTE:
- Nimic critic. Toast + mobile UX sunt deja implementate complet.

---

## 3. Traduceri

**Status: 99.6% complet**

| Locale | Chei | Status |
|--------|------|--------|
| EN | 828 | Complet (referință) |
| RO | 828 | Complet |
| FR | 828 | Complet |
| IT | 828 | Complet |
| DE | 825 | 3 chei lipsă |
| ES | 825 | 3 chei lipsă |

Landing page i18n: Complet — `LANDING_I18N` obiect cu toate 6 limbile.
Blog content: Doar 3 limbi (EN, RO, IT) — DE, FR, ES nu au articole.

---

## 4. Dead Code / Importuri nefolosite

1. **`getStarterInsights()`** în `src/utils/feedingInsights.js` — exportat dar niciodată importat
2. **Constante duplicate**: `VALID_RISE_LEVELS`, `VALID_BUBBLE_ACTIVITIES`, `VALID_AROMAS` definite în:
   - `feedingInsights.js` (ca arrays, exportate)
   - `starterHelpers.js` (ca Sets, locale)
3. **3 chei i18n lipsă** în DE și ES (fallback la EN funcționează)

---

## 5. Starea PWA

**Status: COMPLET FUNCȚIONAL**

- `public/manifest.json`: corect configurat (standalone, scope /app, 3 icons)
- `vite-plugin-pwa` în vite.config.js: autoUpdate, workbox cu navigateFallback /app.html
- Service worker: 18 precache entries, runtime caching Google Fonts
- Affiliate redirects (/go/*) excluse din SW via navigateFallbackDenylist
- Icons: icon.svg, icon-192.png, icon-512.png ✓

---

## 6. Build

```
npm run build → PASS
✓ 131 modules transformed
✓ built in 2.01s
✓ 18 precache entries (1013.53 KiB)
✓ sw.js + workbox generated
```

---

## 7. Alte observații

- **Affiliate links**: 9 redirect-uri Amazon UK în netlify.toml, toate verificate funcționale (302, HTTP 200)
- **CSP header**: configurat în netlify.toml (script-src unsafe-inline, fonts, mailerlite)
- **Security headers**: X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy
- **ARIA**: star ratings, language switcher, form labels, skip link — toate implementate
- **Securitate React**: sanitizeLimitedHtml(), input validation, no innerHTML/eval
- **Zustand persist**: 2 stores cu middleware, version control
