# Audit Report — Rise & Ferment

**Data:** 2026-02-25
**Branch:** main (clean, synced with remote)
**Build:** `npm run build` — PASS (0 erori, 0 warnings, 2.27s, 912 KB precache)

---

## CRITICE

### C1. Exit popup + sticky CTA sunt complet nefuncționale
**Fișier:** `index.html` (liniile 1829-1876 vs 1881-1897)
Elementele DOM (`#exitPopup`, `#stickyCta`) sunt plasate DUPĂ tag-ul `</script>`. IIFE-urile care le inițializează au guard-uri `if(!ep)return` care se declanșează instant. **Niciun popup de exit intent sau CTA bar nu funcționează.**

### C2. MailerLite este complet dezactivat
**Fișier:** `index.html` (liniile 1756-1757, 1770-1771)
Fetch-urile către MailerLite sunt comentate. Cheile sunt placeholder: `YOUR_MAILERLITE_API_KEY`, `YOUR_GUIDE_GROUP_ID`. Singura colectare funcțională: Netlify Forms (fără autoresponder, fără email delivery). PDF-ul se deschide direct via `window.open()` indiferent dacă form submission reușește.

### C3. Service worker servește landing page în loc de app.html (offline)
**Fișier:** `vite.config.js` (linia 16)
`navigateFallback` defaultează la `index.html`. Când un user e offline și navighează la `/app/settings`, primește landing page-ul de 166 KB în loc de React app. **PWA offline este broken.**

### C4. Linkuri affiliate broken: `/go/breville` și `/go/fwsy-book`
**Fișier:** `index.html` (liniile 428-429) vs `public/_redirects`
Aceste 2 linkuri din landing page **nu au reguli de redirect** — duc la 404 sau catch-all SPA.

### C5. Redirect-uri placeholder live în producție
**Fișier:** `public/_redirects` + `netlify.toml`
- `/go/proofing-box` → `https://brodandtaylor.eu/AWAITING_APPROVAL` (301 permanent!)
- `/go/bread-oven` → `https://brodandtaylor.eu/AWAITING_APPROVAL` (301 permanent!)
- `/go/skillshare` → `SKILLSHARE_AFFILIATE_LINK` (literal string)
301 redirects se cache-uiesc permanent în browser — chiar și după fix, userii afectați rămân blocați.

### C6. Landing page distruge service worker-ul app-ului
**Fișier:** `index.html` (liniile 475-483)
La fiecare vizită pe landing page, SE ȘTERG toate SW registrations + cache-urile. Un user care vizitează `/` apoi merge la `/app` pierde offline support complet.

### C7. Traduceri DE și ES — 58% lipsă (445 din 771 chei fiecare)
**Fișiere:** `src/i18n/locales/de.json`, `es.json`
Lipsesc: toate rețetele, feeding modal, settings, stats, planner, troubleshooting, history, home status, import/export. App-ul este practic nefuncțional în germană și spaniolă.

### C8. Bug validare temperatură Fahrenheit
**Fișier:** `src/store/useStarterStore.js` (linia 183)
`addFeeding` hardcodează max la 60 indiferent de unitate. Temperaturi Fahrenheit valide (ex: 75°F = 24°C) sunt acceptate, dar orice peste 60°F este salvat ca `null`. **Datele de temperatură se pierd pentru useri în Fahrenheit.**

### C9. Lipsă favicon pe landing page
**Fișier:** `index.html` — `<head>` section
Nu există `<link rel="icon">` de niciun tip. Fiecare page load generează un 404 pentru `/favicon.ico`.

### C10. Zero `<label>` pe formularele din landing page
**Fișier:** `index.html` (liniile 438, 455, 1888, 1895)
5 formulare cu câmpuri email folosesc doar `placeholder` ca label. WCAG 2.1 failure. Screen readers nu pot anunța scopul câmpului.

---

## IMPORTANTE

### I1. Manifest PWA fără `scope`
**Fișier:** `public/manifest.json`
`start_url: "/app"` dar lipsește `"scope": "/app"`. PWA instalat include landing page-ul în scope.

### I2. Traduceri FR și IT — 2 chei lipsă fiecare
**Fișiere:** `src/i18n/locales/fr.json`, `it.json`
Lipsesc: `shopProd_fwsy-book_desc`, `shopProd_fwsy-book_name`

### I3. Componente dead code (3 fișiere)
- `src/components/feeding/FeedingCard.jsx` — nu e importat nicăieri
- `src/components/starter/DailyTaskCard.jsx` — nu e importat nicăieri
- `src/components/starter/DayGuide.jsx` — nu e importat nicăieri

### I4. Funcție exportată nefolosită
**Fișier:** `src/utils/dateHelpers.js` (linia 51)
`isToday()` exportată dar neimportată nicăieri.

### I5. Elemente interactive non-focusable (landing page)
**Fișier:** `index.html` (liniile 353, 410)
`<span onclick="showBlogPage()">` — fără `tabindex`, `role="button"`, sau keyboard handler. Inaccesibile pentru keyboard navigation.

### I6. Fără focus-visible pe inputuri (landing page)
**Fișier:** `index.html` (liniile 194, 221)
CSS setează `outline:none` pe inputuri fără `:focus-visible` replacement.

### I7. Fără skip-to-content link (landing page)
Keyboard users trebuie să tab-uiască prin tot nav-ul înainte de a ajunge la conținut.

### I8. Fără Content Security Policy
**Fișier:** `netlify.toml` — are alte security headers dar lipsește CSP.

### I9. Blog content — doar 3 din 6 limbi
Conținutul articolelor există doar în EN, RO, IT. Userii DE, FR, ES văd fallback în engleză.

### I10. Duplicate redirects în `_redirects` + `netlify.toml`
Ambele fișiere definesc aceleași reguli. Pe Netlify, `_redirects` are prioritate. Risc de drift.

### I11. `app.html` fără `<link rel="preconnect">` pentru Google Fonts
Landing page-ul are preconnect, app-ul nu. Penalty DNS+TLS ~100-300ms la prima încărcare.

### I12. Manifest icon `"purpose": "any maskable"` pe o singură imagine
**Fișier:** `public/manifest.json` (linia 26)
Aceeași imagine pentru display normal și maskable. Risc de crop pe Android adaptive icons.

### I13. `vercel.json` coexistă cu `netlify.toml`
Proiectul deployează pe Netlify. `vercel.json` e fie leftover, fie backup. Creează confuzie.

### I14. BrowserRouter basename fragil
**Fișier:** `src/main.jsx` (liniile 28-30)
Trei valori posibile de basename (`/app.html`, `/app`, `/`). Path-ul `/` e dead code care poate masca bugs.

### I15. Aria-labels hardcodate în engleză (app)
- `src/pages/OnboardingPage.jsx` (linia 148): `aria-label="Toggle theme"`
- `src/components/common/Modal.jsx` (linia 58): `aria-label="Close"`

### I16. Butoane fără `type="button"` (app)
- `src/components/feeding/FeedingCard.jsx` (liniile 66, 192-197)
- `src/pages/HistoryPage.jsx` (liniile 165-181)
- `src/components/layout/ThemeToggle.jsx` (linia 10)

### I17. Legal pages (Privacy, Terms, Affiliate) — English-only
Folosesc `t("key", "fallback text")` dar cheile NU există în niciun locale file. Afișează mereu fallback-ul în engleză.

### I18. OG image URL neverificabil
`https://riseandferment.com/assets/photo-bread.jpg` — fișierul `photo-bread.jpg` există local în `public/assets/`, dar URL-ul din meta tags presupune path-ul `/assets/` funcțional pe producție.

---

## NICE-TO-HAVE

### N1. Google Fonts render-blocking (landing page)
3 familii de fonturi încărcate via stylesheet. `display=swap` e prezent (bine), dar nu există `<link rel="preload">` pentru fonturile critice.

### N2. Contrast placeholder text
`--wheat: #C4956A` pe background alb = ~2.4:1 contrast ratio (sub WCAG AA 4.5:1).

### N3. `@media(max-width:768px)` duplicat în landing CSS
Două blocuri separate pentru 768px care ar trebui merge-uite.

### N4. Star rating fără aria-label (testimonials)
Stelele decorative din testimonials nu au label accessible.

### N5. Exit popup close button fără aria-label
`<button class="ep__close">&times;</button>` — fără aria-label (moot deoarece popup-ul e broken).

### N6. Sticky CTA close e `<span>`, nu `<button>`
Nu e focusable și fără aria-label (moot deoarece CTA e broken).

### N7. Language switcher fără ARIA roles/keyboard nav
Dropdown-ul de limbă din landing page nu are `role="listbox"` sau keyboard navigation.

### N8. Floating hero elements overlap pe tablete (481-768px)
Pozitionare absolută cu `right:-10px` / `left:-20px` poate cauza overlap pe ecrane narrow.

### N9. Cookie consent CSS fără HTML
Liniile 245-252 din landing definesc `.cc` styles dar HTML-ul pentru cookie banner nu există. Dead CSS.

### N10. `sitemap.xml` — lastmod vechi
`<lastmod>2025-02-18</lastmod>` — un an vechi. Ar trebui actualizat la deploy.

### N11. `<noscript>` lipsă din `app.html`
Userii fără JavaScript văd pagină complet albă.

### N12. `package.json` version este `0.0.0`
UI-ul afișează "v3.0" dar package.json nu reflectă asta.

### N13. Fișiere scaffold nefolosite
- `public/vite.svg` (1.5 KB) — nereferat, se precache-uiește în SW inutil
- `src/assets/react.svg` (4.1 KB) — neimportat nicăieri

### N14. PDF fără cache headers specifice
`7-day-sourdough-starter-guide.pdf` (36 KB) nu are reguli de cache în `netlify.toml`.

### N15. `<html lang="en">` hardcodat în landing page
JS corectează la runtime, dar primul parse e în engleză.

### N16. Observation buttons fără `aria-pressed` (FeedingModal)
Toggle buttons pentru rise level/bubble activity nu comunică starea curentă screen reader-elor.

---

## REZUMAT

| Categorie | Count |
|-----------|-------|
| Critice | 10 |
| Importante | 18 |
| Nice-to-have | 16 |

### Ce funcționează bine
- **Build:** zero erori, zero warnings
- **Zustand:** zero violări ale regulii `getActiveStarter()` în componente
- **CSS variables:** zero hardcoded Tailwind color classes — temele funcționează perfect
- **Security (app):** zero `eval()`, zero `innerHTML`, 2x `dangerouslySetInnerHTML` corect sanitizate
- **Netlify SPA routing:** corect configurat pentru dual-entry-point
- **404.html:** funcțional, redirecționează corect `/app/*` la `app.html`
- **Imagini:** toate optimizate (<35 KB), niciun fișier supradimensionat
- **Security headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy prezente
- **i18n RO:** complet (771/771 chei)
- **Cache strategy:** immutable pentru hashed assets, must-revalidate pentru HTML
