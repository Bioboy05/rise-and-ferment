## Milestone-native blueprint for Rise & Ferment

### 1. Why full milestone model
- Replace fixed 14-day pipeline with observable milestones (e.g., "bubbling consistency", "first reliable rise", "bake-ready signal") so users with slower/faster starters still get relevant guidance and the UX matches best-practice sources (Perfect Loaf, Clever Carrot, King Arthur, Pantry Mama).
- Keeps `currentDay`/14 logic for optics/daily quotes when needed, but milestones control gating, completion, celebrations, onboarding state, and downstream scheduling.

### 2. Domain model changes
| Field | Role | New representation |
| --- | --- | --- |
| `isNewStarter` | Indicates active guided path | Retain but rename to `guidedMilestoneMode` (enum: `new`, `reactivation`, `self-paced`). |
| `currentDay` | Legacy step counter | Replace with `currentMilestoneId` and `milestoneHistory` array of `{ id, reachedAt, evidence }`. |
| `todayCompleted` | Prevent double completion | Replace with `milestoneCompleted` flag scoped per milestone and a timestamp for last milestone completion. |
| `completedDays` | UI history list | Replace with `milestoneLog` plus subset for `milestoneDots` rendering when day labels still displayed. |
| `previewingDay` | UI preview | Replace with `previewingMilestoneId` + `previewTag`. |
| `history`/`streak` | Feeding data | Unchanged but milestone logic references streak + feed timestamps for readiness checks (per blog guidance). |

Normalization and advance helpers (`src/utils/starterHelpers.js`) must validate IDs, map legacy `currentDay` into milestone IDs, and treat values beyond the final milestone as `guidedMilestoneMode = self-paced`.

### 3. Milestones definitions (example)
1. `seed-activation` – first pleasant bubbles, late day 1–2. Criteria: two feedings plus proof of initial fermentation (bubble count, mild sour smell).
2. `visible-expansion` – consistent 25-75% rise 4–6h after feeding. Tie to `starter.history` entries for 2 consecutive feeds showing the rise signature.
3. `strengthening` – repeated reliable rise/doubling behavior for at least two rounds (mirrors existing 7–14-day window). Could use float test entry as evidence.
4. `bake-ready` – readiness signal (double in 4–6h plus float test pass OR strong smell/texture). Once reached, switch to `guidedMilestoneMode: self-paced`.

Each milestone gets new copy/lesson data keyed by milestone ID instead of numeric day. Content may reuse lines from `lessons.js`, reorganized into `milestones.js`.

### 4. Feature-by-feature impact

- **Store & helpers** (`src/utils/starterHelpers.js`, `src/store/useStarterStore.js`):
  - Add milestone metadata file describing criteria, assets, next milestone pointers.
  - Implement `advanceMilestone(starter, milestoneId)` replacing `advanceStarterDay`.
  - Persist `milestoneHistory` (max 60 entries) and allow migration from `currentDay` + `completedDays`.

- **Home page & DayGuide/DailyTask** (`src/pages/HomePage.jsx`, `src/components/starter/DayGuide.jsx`, `src/components/starter/DailyTaskCard.jsx`):
  - Replace day dots with milestone timeline (icons, completion states). Use new milestone data to drive `dayGuide`/task text via IDs.
  - `DailyTaskCard` should map to milestone actions (e.g., \"Observe rise\", \"Float test\"), still limited to first few milestones for new starters.
  - `progressText`, `motivationalKey`, and modal copy shift to milestones (e.g., "Seed activation" vs "Day 3").

- **Onboarding** (`src/pages/OnboardingPage.jsx`):
  - `path` options now feed into `guidedMilestoneMode`. For `existing`, ask health/rescue, compute starting milestone (maybe re-enter `visible-expansion` or `reactivation` steps).
  - `handleFinish` should initialize `currentMilestoneId` (map path selections to milestone) instead of forcing `currentDay`.

- **Celebrations** (`src/data/celebrations.js` + `src/App.jsx`):
  - Translate milestone IDs into celebrations (e.g., `milestone.id === "visible-expansion"` triggers same overlay previously on day 7). Keep streak-based ones but ensure detection uses new fields.

- **Planner, History, Stats, Recipes**:
  - Planner references `daysPlusX`; these remain but can become optional (the new system is agnostic to day count). History/Stats unaffected.
  - Stats copy referencing \"Activity (last 14 days)\" stays but can optionally mention milestone achievements; not required for blueprint.

- **Import/export** (`src/utils/exportHelpers.js`, `src/pages/SettingsPage.jsx`):
  - Bump backup version (≥ 2.1) and migrate `currentDay` → milestone schema during import.
  - When exporting, include new milestone fields and maybe `milestoneMetadataVersion`.

- **i18n/locales**:
  - Replace `dayGuideTitle{1..14}`, `motivationalDay{1..7}` etc., with milestone keys (e.g., `milestoneSeedTitle`). Remove `activityChart` text referencing 14 days if desired though not necessary.
  - Add new strings for existing path/rescue flows referencing milestones rather than days.

- **Troubleshooting** (`src/data/troubleshooting.js`):
  - `normal` timeline entries change to milestone names (no fixed day numbers).

### 5. "Am deja o maia?" flow
- Use `existingHealth` quiz to determine starting milestone:
  - `active`: set `currentMilestoneId = bake-ready` if proof (floating test) exists, or jump to `strengthening`.
  - `hungry`/`neglected`: start `guidedMilestoneMode = reactivation`, backlog of hands-on tasks (feed twice a day, monitor bubble count).
  - `fridge`: rewarm steps (pull out, feed, wait for swell) before unlocking first milestone.
- Provide milestone-specific advice cards (upload evidence) and surface the same milestone timeline on Home so the user sees where their existing starter sits.
- Celebrate returning starter when `milestoneHistory` registers `bake-ready` so the UI still triggers confetti even without going through day 1-14.

### 6. Milestone rollout plan
1. **Prep data**: define `milestones.js` with IDs, titles, descriptions, icons, criteria metadata; add translation keys.
2. **Store/API refactor**: update normalize/advance helpers, persist new fields; add migration helper for old backups.
3. **Home/Guide UI**: swap day components for milestone timeline; update `DailyTaskCard`.
4. **Onboarding/resets**: map path selection to new milestone mode; adjust `handleFinish`.
5. **Events & celebrations**: retarget overlays to milestone IDs, ensure confetti trigger still works.
6. **Docs & copy**: update `scripts` referencing day numbers, localizations, `README/marketing copy` referencing 14-day fixed timeline.

### 7. Testing, risks, and rollbacks
- Tests: manual smoke on onboarding (create/adopt/existing paths), milestone completion flow, confetti triggers.
- Risk: existing users with stored `currentDay` data must not lose progress; confirm migration logic preserves names and history.
- Rollback: keep compatibility layer—if milestone metadata version mismatched, fall back to old `currentDay` gating without losing data.

### 8. External blogs as validation
1. **The Perfect Loaf** — ready state defined by consistent doubling/behavior; timeline ~1 week but flexible (source: multiple articles).
2. **The Clever Carrot** — timeline advertised 7+ days; emphasizes behaviour (bubbles, rise) over calendar.
3. **King Arthur Baking** — instructions repeatedly note \"watch for doubling & float test\"; timeline can extend beyond 10 days.
4. **The Pantry Mama** — notes some starters need 14+ days or even 3-4 weeks; success defined by bloom/float test, not day count.

Use these sources to justify milestone gating and reframe UI copy away from \"Day X\" enumerations.
