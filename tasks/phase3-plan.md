# Plan: Faza 3 — Pagini și componente de bază

## Context
Fazele 1-2 sunt complete. Avem infrastructura (routing, i18n, stores) și datele (utils, hooks, 6 data files). Acum construim cele 4 pagini reale (Settings, History, Recipes, Stats) și 3 componente comune (Modal, Toggle, TipBox) care înlocuiesc placeholder-urile "Coming soon".

**Descoperire importantă:** Recipe-specific i18n keys (recipeClassicTitle, etc.) NU există încă — trebuie adăugate ~190 chei în en.json + ro.json. de/fr/es/it vor folosi fallback la engleză.

## Ordine de implementare (6 pași cu commit după fiecare)

### Pas 1: Componente comune + refactor FeedingModal
**Fișiere noi:** `src/components/common/Modal.jsx`, `Toggle.jsx`, `TipBox.jsx`
**Fișier modificat:** `src/components/feeding/FeedingModal.jsx` — refactor to use Modal + Toggle

- **Modal.jsx** — Props: `isOpen`, `onClose`, `title`, `children`. Pattern extras din FeedingModal: overlay fix, z-1000, click-outside, 85vh, borderRadius "24px 24px 16px 16px"
- **Toggle.jsx** — Props: `checked`, `onChange`, `label`, `description`. Pattern extras din FeedingModal bran toggle: 48x28px, knob 22px
- **TipBox.jsx** — Props: `type` (info/warning/success/danger), `children`. Colored info boxes

Refactor FeedingModal → folosește `<Modal>` + `<Toggle>`. Rezultat vizual identic.

**Verify:** Build passes + FeedingModal funcționează identic (overlay, close, toggle bran)
**Commit:** `feat: add Modal, Toggle, TipBox common components`

---

### Pas 2: i18n — Adaugă cheile lipsă (en.json + ro.json)
**Fișiere modificate:** `src/i18n/locales/en.json`, `ro.json`

Chei noi (~190):
- History (3): `historyEmpty`, `feedingDetails`, `averageInterval`
- Stats (2): `noStats`, `chartNoData`
- Recipe UI (8): `recipeCategoryBread/Discard/Other`, `recipeDifficulty`, `recipeTime`, `recipeServings`, `recipeIngredients`, `recipeSteps`, `recipeTip`, `recipeMinutes`, `recipeHours`
- Recipe content (~178): titluri, descrieri, ingrediente, pași, tips pentru toate 15 rețetele (din recipes.js)

**Decizie:** Doar en.json + ro.json. de/fr/es/it rămân cu fallback la engleză.

**Verify:** Build passes
**Commit:** `i18n: add recipe, history, stats keys for en and ro`

---

### Pas 3: SettingsPage
**Fișiere modificate:** `src/pages/SettingsPage.jsx`, `src/store/useSettingsStore.js`

8 secțiuni în carduri:
1. **My Starter** — Nume editabil (input + updateStarter), hidratare (3 opțiuni)
2. **Appearance** — Theme Toggle + Language picker (6 flags)
3. **Mode** — Beginner mode Toggle
4. **Sound** — Sound Toggle
5. **Units** — Temp C/F selector
6. **Notifications** — Feeding reminder Toggle (placeholder)
7. **Backup** — Export + Import buttons (folosește exportHelpers)
8. **Reset** — Buton cu confirm dialog

Store additions: `resetAll()` pe useSettingsStore.

**Verify:** Toggle theme → data-theme se schimbă. Switch language → text se actualizează. Export → descarcă JSON. Reset → cleared + reload.
**Commit:** `feat: implement SettingsPage with all sections`

---

### Pas 4: HistoryPage
**Fișier modificat:** `src/pages/HistoryPage.jsx`

Structura:
- **Mini stats bar** (top): Total feedings + Avg temperature
- **Feeding list** (reverse chronological, grouped by date):
  - Each entry: time (formatTimeAgo), amount, temp, bran indicator, note
  - Date group headers
  - Left accent border (3px solid accent)
- **Empty state**: Emoji + t('historyEmpty')

**Verify:** Empty state visible cu starter nou. Adaugă feeding → entry apare cu date corecte.
**Commit:** `feat: implement HistoryPage with feeding list and stats`

---

### Pas 5: RecipesPage + RecipeModal
**Fișier nou:** `src/components/recipes/RecipeModal.jsx`
**Fișier modificat:** `src/pages/RecipesPage.jsx`

RecipesPage:
- **Category tabs**: Bread / Discard / Other (3 butoane, activeCategory state)
- **Recipe cards grid**: gradient bg, icon, title, difficulty stars, time
- Click card → deschide RecipeModal

RecipeModal (folosește Modal):
- Recipe icon + description
- Meta: difficulty + time + servings
- Ingredients list (bulleted)
- Steps list (numbered cu accent circles)
- Tip (TipBox info)

**Verify:** 3 tabs filtrează corect. Card click → modal cu ingrediente/pași/tip. Close funcționează.
**Commit:** `feat: implement RecipesPage with category tabs and RecipeModal`

---

### Pas 6: StatsPage
**Fișier modificat:** `src/pages/StatsPage.jsx`

Structura:
- **Quick stats grid** (2x2): Total feedings, Streak, Avg temp, Starter age
- **Activity bar chart** (14 zile): CSS divs cu height proporțională
- **Temperature chart**: SVG minimal cu polyline
- **Weekly pattern**: 7 boxes heatmap (Sun-Sat)
- **Empty state**: t('noStats') dacă history gol

Charts fără librărie externă — pure CSS + SVG inline.

**Verify:** Empty state cu starter nou. Cu date → 4 stat cards + charts render corect.
**Commit:** `feat: implement StatsPage with charts and statistics`

---

## Fișiere totale

| Acțiune | Fișier |
|---------|--------|
| Nou | `src/components/common/Modal.jsx` |
| Nou | `src/components/common/Toggle.jsx` |
| Nou | `src/components/common/TipBox.jsx` |
| Nou | `src/components/recipes/RecipeModal.jsx` |
| Modificat | `src/components/feeding/FeedingModal.jsx` |
| Modificat | `src/pages/SettingsPage.jsx` |
| Modificat | `src/pages/HistoryPage.jsx` |
| Modificat | `src/pages/RecipesPage.jsx` |
| Modificat | `src/pages/StatsPage.jsx` |
| Modificat | `src/store/useSettingsStore.js` |
| Modificat | `src/i18n/locales/en.json` |
| Modificat | `src/i18n/locales/ro.json` |

## Verificare finală
1. `npx vite build` — zero erori
2. Toate 5 paginile funcționale (nu mai e "Coming soon" nicăieri)
3. Theme toggle funcționează din Settings
4. Language switch actualizează totul
5. Export/Import date funcționează
6. Rețetele se afișează corect cu modal
7. Charts render cu date existente
