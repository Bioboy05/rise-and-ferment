# Rise & Ferment — Plan de migrare HTML → React

## Stare actuală (ce există deja)

| Fișier | Status |
|--------|--------|
| `App.jsx` + `main.jsx` | App shell cu Router + i18n |
| `index.css` | CSS variables light/dark complet |
| `useStarterStore.js` | Zustand store + persist + validare/sanitizare |
| `useSettingsStore.js` | Zustand store + persist + whitelist inputs |
| `Header.jsx` + `Navigation.jsx` + `ThemeToggle.jsx` | Layout funcțional cu NavLink |
| `HomePage.jsx` | Afișează starter info + FeedingCard |
| `FeedingCard.jsx` + `FeedingModal.jsx` | Hrănire completă (modal, calculator, tărâțe, temp, note) |
| `src/i18n/` | Config + 6 fișiere locale (parțial — nu toate 256 chei) |
| 4 pagini placeholder | HistoryPage, RecipesPage, StatsPage, SettingsPage |

**Lipsă:** Migrare persistență din format vechi, chei i18n complete, 4 pagini reale, onboarding, rețete, statistici, lecții, troubleshooting, planner, sunet, celebrări, import/export.

---

## Sursa originală

Fișier: `rise-ferment-v4.1.html` (~530KB, ~7200 linii)
- 256 chei de traducere × 6 limbi (ro 100%, en 100%, de/fr/es/it ~63%)
- 65+ funcții JS
- 5 modale (feed, lesson, trouble, mature, recipe)
- 15 rețete complete
- 3 căi de onboarding (create/adopt/existing)
- 8 lecții educaționale
- 7 zile ghid zilnic
- Planner cu export calendar ICS
- Web Audio sintetizat (4 sunete)
- Confetti + celebrări (4 milestone-uri)

---

## Faze de migrare

### Faza 1 — Infrastructură critică
> Fundația pe care se construiesc toate feature-urile. Fără asta, nimic nu persistă și nu se traduce.

- [x] **1.1 Persistență localStorage pentru Zustand** ✅
  - ~~Adaugă `zustand/middleware` persist la ambele store-uri~~
  - ⚠️ Cheie actuală: `riseFermentStarters`/`riseFermentSettings` (NU `riseFermentV3`)
  - [ ] TODO: Migrare automată din formatul vechi `maiauaMea`
  - ~~Verificare: refresh browser → state-ul rămâne~~

- [x] **1.2 Configurare i18next** ✅ (parțial)
  - ~~Instalare + config `src/i18n/index.js`~~
  - ⚠️ Nu toate 256 chei extrase — componentele existente au chei, restul lipsesc
  - ~~Provider în `main.jsx`~~
  - ~~Înlocuiește textele hardcodate existente cu `t('key')`~~
  - [ ] TODO: Extrage restul cheilor + verificare switch limbă complet

- [x] **1.3 React Router** ✅
  - ~~Înlocuiește `activeTab` state cu `react-router-dom`~~
  - ~~Rute: `/` (home), `/history`, `/recipes`, `/stats`, `/settings`~~
  - ~~`Navigation.jsx` → `NavLink` cu URL-uri~~
  - ~~Verificare: navigare + URL se schimbă + back button funcționează~~

---

### Faza 2 — Date statice și utilități
> Datele din HTML trebuie extrase în fișiere separate pentru a fi consumate de componente.

- [x] **2.1 Fișiere de date (`src/data/`)** ✅
  - `lessons.js` — 14 lecții cu icon, titleKey, shortKey, contentKey
  - `dailyTasks.js` — 7 zile cu titleKey, taskKey, actionKey, action type
  - `recipes.js` — 15 rețete (5 bread + 5 discard + 5 other) cu i18n keys
  - `troubleshooting.js` — checks, common, serious, normal timeline
  - `dailyQuotes.js` — greetings, daily (1-7), streak milestones, action messages
  - `celebrations.js` — 4 milestones (day7, firstBread, streak7, streak30) cu condition functions
  - ⚠️ dayGuides.js — NU creat separat, se integrează prin dailyTasks + lessons
  - ⚠️ Toate datele referențiază i18n keys — conținut HTML complet se adaugă la i18n în Faza 3+

- [x] **2.2 Funcții utilitare (`src/utils/`)** ✅
  - `dateHelpers.js` — getTimeSince, formatTimeAgo, isToday, formatICSDate
  - `calculations.js` — calculateBreadRecipe (base: 100/400/280/8 per loaf)
  - `starterHelpers.js` — calculateStreak, getStarterStatus, normalizeStarter
  - `exportHelpers.js` — exportData, importData (with validation), generateICS
  - FeedingCard.jsx refactored: getTimeSince imported from utils

- [x] **2.3 Custom hooks (`src/hooks/`)** ✅
  - `useActiveStarter.js` — shortcut for getActiveStarter()
  - `useStreak.js` — derives streak from history via calculateStreak
  - useLocalStorage.js — NOT needed (Zustand persist handles everything)

---

### Faza 3 — Pagini și componente de bază
> Completarea celor 4 pagini lipsă + componente comune reutilizabile.

- [x] **3.1 Componente comune (`src/components/common/`)** ✅
  - `Modal.jsx` — overlay reutilizabil (backdrop click, close button)
  - `Toggle.jsx` — toggle switch reutilizabil (extras din FeedingModal)
  - `TipBox.jsx` — tip box colorat (success/warning/info/danger)
  - FeedingModal refactored to use Modal + Toggle

- [x] **3.2 SettingsPage** ✅
  - 8 secțiuni: starter name edit, personal notes, appearance (theme + language 3x2), beginner mode, sound, temperature units, backup (export/import), reset with modal
  - Added resetAll() to settings store
  - Added ~200 i18n keys (settings + all 15 recipes in en + ro)

- [x] **3.3 HistoryPage** ✅
  - Feeding list grouped by date (newest first)
  - Each entry: time, amount, bran indicator, temp, note
  - Mini stats bar (total feedings, avg temp)
  - Empty state

- [x] **3.4 RecipesPage + RecipeModal** ✅
  - 3 category tabs (Bread/Discard/Other) with pill buttons
  - 2-column gradient card grid with icon, title, difficulty stars, time
  - RecipeModal with ingredients, numbered steps, tip box
  - All 15 recipes working

- [x] **3.5 StatsPage** ✅
  - Quick stats grid 2x2 (total feedings, streak, avg temp, age)
  - 14-day activity bar chart (CSS divs)
  - Temperature SVG polyline chart with fill area
  - Weekly pattern heatmap (7 boxes, opacity by frequency)
  - Empty state

---

### Faza 4 — Onboarding și ghidare
> Experiența primului contact al utilizatorului cu aplicația.

- [ ] **4.1 Onboarding flow**
  - Screen cu 3 căi: Creez de la zero / Adopt / Am deja
  - **Path Create:** Shopping list → Naming → Start
  - **Path Adopt:** Surse adopție → Checklist → Naming → Start
  - **Path Existing:** Health quiz (4 opțiuni) → Sfat → Naming → Start
  - Input nume starter (placeholder "Pufi, Maya, Dora...")
  - Selectare limbă (6 flags)
  - Theme toggle
  - Animație jar SVG decorativă
  - Condiție: se arată DOAR dacă nu există niciun starter în store

- [ ] **4.2 Day Guide (zilele 1-14)**
  - Progress bar cu zilele (dots + current day highlighted)
  - Navigare prev/next între zile
  - Card instrucțiuni per zi din `dayGuides.js`
  - Buton "Am terminat ziua!" → `completeDay()`
  - Preview mode (vezi alte zile fără a completa)
  - Se arată pe HomePage doar dacă `starter.isNewStarter && currentDay <= 14`

- [ ] **4.3 Sistem de lecții**
  - Tab Învață cu grid de lecții din `lessons.js`
  - Card: icon + titlu + descriere scurtă
  - Click → modal cu conținut complet
  - 8 lecții (starter basics, temperatură, hidratare, PMC, troubleshooting...)

- [ ] **4.4 Daily tasks**
  - Card pe HomePage cu task-ul zilei (zilele 1-7)
  - Text specific per zi din data
  - Buton acțiune (hrănește / verifică / observă)

---

### Faza 5 — Feature-uri avansate
> Funcționalități care fac aplicația completă.

- [ ] **5.1 Multi-starter management**
  - Tabs orizontale pe HomePage pentru switch între starters
  - Buton "+" pentru adăugare starter nou
  - Fiecare starter e independent (history, day, streak)
  - Verificare: switch între 2+ starters → totul se actualizează corect

- [ ] **5.2 Troubleshooting panel**
  - Buton "Maiaua nu crește?" pe HomePage
  - Modal cu secțiuni:
    - Ce e normal (timeline zi 1-7)
    - Verificări (temperatură, apă, făină, răbdare)
    - Probleme comune (hooch, miros acetonă, aciditate)
    - Probleme serioase (mucegai)
  - Tip boxes colorate per severitate

- [ ] **5.3 Baking Planner**
  - Selector dată + oră "când vrei pâinea gata"
  - Calcul schedule invers (10 pași cu ore concrete)
  - Calculator ingrediente per loaves (1-5)
  - Note de coacere
  - Export calendar ICS

- [ ] **5.4 Urgent alert**
  - Banner pe HomePage dacă `lastFed > 24h`
  - Stil gradient portocaliu cu puls
  - Buton direct "Hrănește acum!" → deschide FeedingModal
  - Se ascunde automat după feeding
  - (Parțial implementat deja în FeedingCard)

- [ ] **5.5 Import/Export data**
  - Export: descarcă JSON `maiaua-mea-backup-YYYY-MM-DD.json`
  - Import: upload JSON, validare, confirmare, restore
  - În pagina Settings

---

### Faza 6 — Polish și experiență
> Detaliile care fac aplicația să se simtă vie.

- [ ] **6.1 Sunet (Web Audio API)**
  - `useSound.js` hook
  - 4 sunete sintetizate: success (C major), celebration (arpegiu), click, milestone
  - Respectă `soundEnabled` din settings
  - Oscilator sine wave + lowpass filter + envelope

- [ ] **6.2 Celebrări + Confetti**
  - Overlay fullscreen cu emoji + titlu + text
  - 4 milestone-uri: firstBread, streak7, streak30, day7
  - Confetti: 50-80 particule (8 culori, 3 forme)
  - Trigger din `checkMilestones()` după feeding
  - Flag în localStorage pentru one-time display

- [ ] **6.3 Mesaje motivaționale**
  - Card pe HomePage (condițional, în beginner mode)
  - 3 greetings random
  - 7 mesaje per zi (day 1-7)
  - 4 mesaje streak (3/7/14/30)
  - 2 mesaje acțiune (feed done, float pass)

- [ ] **6.4 Animații CSS**
  - `src/styles/animations.css`
  - fadeInUp, warmGlow, bubble, floatWheat, pulse, shake
  - Jar illustration cu bubbling
  - Wheat decoration animată
  - Splash screen (dacă e necesar)

- [ ] **6.5 Beginner mode**
  - Toggle în settings
  - Când activ: texte simplificate (fără termeni tehnici)
  - Funcția `tb(key, fallbackKey)` — beginner text cu fallback la expert
  - Afișează/ascunde elemente extra (tips, motivational cards)

---

## Ordinea recomandată de implementare

```
Faza 1 (infrastructură)  →  obligatoriu primul
  1.1 Persistență          1-2 ore
  1.2 i18next              2-3 ore
  1.3 React Router         1 oră

Faza 2 (date + utils)    →  al doilea, debloachează Faza 3-6
  2.1 Fișiere de date      2-3 ore
  2.2 Funcții utilitare    1-2 ore
  2.3 Custom hooks         1 oră

Faza 3 (pagini)           →  cel mai mare volum de muncă
  3.1 Componente comune    1 oră
  3.2 SettingsPage         2-3 ore
  3.3 HistoryPage          1-2 ore
  3.4 RecipesPage          2-3 ore
  3.5 StatsPage            3-4 ore

Faza 4 (onboarding)       →  important dar independent
  4.1 Onboarding flow      3-4 ore
  4.2 Day Guide            2-3 ore
  4.3 Lecții               1-2 ore
  4.4 Daily tasks          1 oră

Faza 5 (features)         →  poate fi paralelizat
  5.1 Multi-starter        1-2 ore
  5.2 Troubleshooting      1-2 ore
  5.3 Planner              3-4 ore
  5.4 Urgent alert         30 min (parțial existent)
  5.5 Import/Export        1-2 ore

Faza 6 (polish)           →  ultimul, după ce totul merge
  6.1 Sunet                1 oră
  6.2 Celebrări            1-2 ore
  6.3 Motivaționale        30 min
  6.4 Animații             1-2 ore
  6.5 Beginner mode        1 oră
```

---

## Dependențe între task-uri

```
1.1 Persistență ──→ toate (state se pierde fără ea)
1.2 i18next ──────→ orice component cu text vizibil
1.3 Router ───────→ 3.2-3.5 (pagini noi)

2.1 Date ─────────→ 3.4 (rețete), 3.5 (stats), 4.1-4.4 (onboarding/lecții)
2.2 Utils ────────→ 3.3 (history), 3.5 (stats), 5.3 (planner)
2.3 Hooks ────────→ componente care au nevoie de streak/activeStarter

3.1 Common ───────→ 3.2-3.5, 4.x, 5.x (Modal, Toggle, TipBox)

5.1 Multi-starter → testare end-to-end a tuturor feature-urilor
6.2 Celebrări ────→ 2.1 celebrations data + 6.1 sunet
```

---

## Audit UX/PWA/Design — Completat

- [x] **P1.1** Safe-area padding (viewport-fit=cover, nav, header, main)
- [x] **P1.2** Modal maxHeight 85dvh + safe-area bottom
- [x] **P1.3** Touch targets min 44x44px (nav, modal, theme toggle)
- [x] **P1.4** Body min-height 100dvh
- [x] **P1.5** Temperature input: inputMode="decimal" + tempUnit (°C/°F)
- [x] **P1.6** Recipe tabs: scroll-snap + -webkit-overflow-scrolling
- [x] **P1.7** HTML lang sync cu i18n language
- [x] **P2.8** manifest.json (standalone, theme_color, SVG icon)
- [x] **P2.9** PWA meta tags (theme-color, apple-mobile-web-app)
- [x] **P2.10** Service worker (vite-plugin-pwa + Workbox)
- [x] **P3.11** Inline styles → CSS classes + Tailwind utilities
- [x] **P3.12** SVG Icon system (30+ icons, replacing emojis)
- [x] **P3.13** aria-labels on all icon buttons
- [x] **P3.14** Premium styling (font variables, consistent design)

---

## Note tehnice

### Convenții de urmat
- **Accesare starter:** mereu `getActiveStarter()`, niciodată `state.starters[0]`
- **Streak:** calculat din `starter.history` dates, nu contoare
- **Culori:** `var(--accent)` nu `text-amber-900`
- **Layout:** `max-w-md mx-auto` pe fiecare pagină
- **Text:** `t('key')` din i18next, zero hardcodat
- **Commits:** atomic, un feature per commit

### Pattern de migrare per funcție
1. Citește funcția din HTML
2. Identifică state-ul pe care îl folosește → mapare la Zustand store
3. Identifică textele → mapare la chei i18n
4. Creează componenta React cu CSS variables
5. Integrează în pagină
6. Testează: lint + build + dev + interacțiune manuală

### Riscuri
- **Volum mare de traduceri** (256 chei × 6 limbi) — automatizează extracția din HTML
- **Chart-uri fără librărie** — div/SVG charts sunt fragile; consideră alternativă minimală dacă e necesar
- **Onboarding flow complex** — 3 căi diferite, necesită testare atentă
- **Web Audio** — poate fi problematic pe iOS Safari; testează pe mobil
