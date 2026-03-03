# Milestone Micro-Steps Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add daily micro-steps within each milestone so users get fresh, unique instructions every day instead of the same text for 3-5 days straight.

**Architecture:** Extend the existing milestone data model with a `microSteps` array. Reuse the orphaned dayGuide i18n content (already translated in all 7 languages). Track the user's current micro-step index in the starter store. The milestone timeline UI stays unchanged — micro-steps appear inside the existing task card.

**Tech Stack:** React 18, Zustand, i18next, Tailwind CSS, CSS Variables

**Research:** See `docs/plans/2026-03-03-sourdough-ux-research.md` for full competitive analysis.

---

## Task 1: Add microSteps to milestone definitions

**Files:**
- Modify: `src/data/milestones.js`

**Step 1: Add microSteps array to each milestone**

Each micro-step has:
- `id` — unique string (`"seed-1"`, `"seed-2"`, etc.)
- `titleKey` — i18n key for the step title
- `contentKey` — i18n key for detailed instructions
- `icon` — icon name for visual variety
- `action` — what the main button does (`"feed"`, `"observe"`, `"learn"`)

Map the existing orphaned dayGuide keys into micro-steps:

```javascript
export const MILESTONES = [
    {
        id: "seed-activation",
        order: 1,
        iconName: "seedling",
        titleKey: "milestoneSeedTitle",
        descKey: "milestoneSeedDesc",
        taskKey: "milestoneSeedTask",
        tipKey: "milestoneSeedTip",
        criteria: { minFeedings: 2 },
        typicalDays: "1–3",
        microSteps: [
            { id: "seed-1", titleKey: "dayGuideTitle1", contentKey: "dayGuideContent1", icon: "wheat", action: "feed" },
            { id: "seed-2", titleKey: "dayGuideTitle2", contentKey: "dayGuideContent2", icon: "clock", action: "observe" },
            { id: "seed-3", titleKey: "dayGuideTitle3", contentKey: "dayGuideContent3", icon: "droplet", action: "feed" },
        ],
    },
    {
        id: "visible-expansion",
        order: 2,
        iconName: "trending-up",
        titleKey: "milestoneExpansionTitle",
        descKey: "milestoneExpansionDesc",
        taskKey: "milestoneExpansionTask",
        tipKey: "milestoneExpansionTip",
        criteria: { minFeedings: 4, consecutiveRises: 2 },
        typicalDays: "3–6",
        microSteps: [
            { id: "expand-1", titleKey: "dayGuideTitle4", contentKey: "dayGuideContent4", icon: "thermometer", action: "feed" },
            { id: "expand-2", titleKey: "dayGuideTitle5", contentKey: "dayGuideContent5", icon: "flask", action: "feed" },
            { id: "expand-3", titleKey: "dayGuideTitle6", contentKey: "dayGuideContent6", icon: "target", action: "feed" },
        ],
    },
    {
        id: "strengthening",
        order: 3,
        iconName: "muscle",
        titleKey: "milestoneStrengthTitle",
        descKey: "milestoneStrengthDesc",
        taskKey: "milestoneStrengthTask",
        tipKey: "milestoneStrengthTip",
        criteria: { minFeedings: 6, consecutiveDoubles: 2 },
        typicalDays: "5–10",
        microSteps: [
            { id: "strength-1", titleKey: "dayGuideTitle8", contentKey: "dayGuideContent8", icon: "bread", action: "feed" },
            { id: "strength-2", titleKey: "dayGuideTitle9", contentKey: "dayGuideContent9", icon: "thermometer", action: "feed" },
            { id: "strength-3", titleKey: "dayGuideTitle10", contentKey: "dayGuideContent10", icon: "clock", action: "feed" },
        ],
    },
    {
        id: "bake-ready",
        order: 4,
        iconName: "loaf",
        titleKey: "milestoneBakeReadyTitle",
        descKey: "milestoneBakeReadyDesc",
        taskKey: "milestoneBakeReadyTask",
        tipKey: "milestoneBakeReadyTip",
        criteria: {
            readinessSignals: [
                "volumeDoubling",
                "visibleBubbles",
                "airyTexture",
                "pleasantAroma",
                "predictableTiming",
            ],
        },
        typicalDays: "7–14+",
        microSteps: [
            { id: "ready-1", titleKey: "dayGuideTitle12", contentKey: "dayGuideContent12", icon: "target", action: "feed" },
            { id: "ready-2", titleKey: "dayGuideTitle13", contentKey: "dayGuideContent13", icon: "star", action: "learn" },
            { id: "ready-3", titleKey: "dayGuideTitle14", contentKey: "dayGuideContent14", icon: "bread", action: "learn" },
        ],
    },
];
```

**Note:** Day 7 (`dayGuideTitle7` — "The Moment of Truth") and Day 11 (`dayGuideTitle11` — "Flour Experiments") are skipped because their content overlaps with milestone-level descriptions. The 12 selected dayGuides map cleanly to 3 per milestone.

**Step 2: Add helper functions**

```javascript
/**
 * Get the current micro-step for a milestone by index.
 * @param {string} milestoneId
 * @param {number} stepIndex — 0-based
 * @returns {Object|null}
 */
export function getMicroStep(milestoneId, stepIndex) {
    const milestone = getMilestoneById(milestoneId);
    if (!milestone?.microSteps) return null;
    return milestone.microSteps[stepIndex] ?? null;
}

/**
 * Get the total number of micro-steps for a milestone.
 * @param {string} milestoneId
 * @returns {number}
 */
export function getMicroStepCount(milestoneId) {
    const milestone = getMilestoneById(milestoneId);
    return milestone?.microSteps?.length ?? 0;
}
```

**Step 3: Commit**

```bash
git add src/data/milestones.js
git commit -m "feat: add microSteps to milestone definitions

Reuse orphaned dayGuide i18n keys (already translated in 7 languages)
as daily micro-steps within each milestone. 3 steps per milestone,
12 total. Adds getMicroStep() and getMicroStepCount() helpers."
```

---

## Task 2: Add micro-step tracking to starter store

**Files:**
- Modify: `src/store/useStarterStore.js`
- Modify: `src/utils/starterHelpers.js`

**Step 1: Add `currentMicroStepIndex` to starter shape**

In `createStarter()`, add after `lastMilestoneCompletedAt`:

```javascript
currentMicroStepIndex: 0,  // 0-based index into current milestone's microSteps array
```

**Step 2: Add to allowed keys whitelist**

In `updateStarter()`, add `"currentMicroStepIndex"` to the allowed keys array.

**Step 3: Add sanitization for the new field**

In the sanitization block of `updateStarter()`, add:

```javascript
if (key === "currentMicroStepIndex") {
    const val = Number(updates[key]);
    if (!Number.isInteger(val) || val < 0 || val > 20) return;
    sanitized[key] = val;
}
```

**Step 4: Add `advanceMicroStep` action to the store**

```javascript
advanceMicroStep: (id) => {
    if (!isValidId(id)) return;

    set((state) => ({
        starters: state.starters.map((starter) => {
            if (starter.id !== id) return starter;
            const milestone = getMilestoneById(starter.currentMilestoneId);
            if (!milestone?.microSteps) return starter;

            const nextIndex = (starter.currentMicroStepIndex ?? 0) + 1;
            // If past last micro-step, stay at last (milestone completion is separate)
            if (nextIndex >= milestone.microSteps.length) {
                return { ...starter, currentMicroStepIndex: milestone.microSteps.length - 1 };
            }
            return { ...starter, currentMicroStepIndex: nextIndex };
        }),
    }));
},
```

**Step 5: Reset micro-step index on milestone advance**

In `src/utils/starterHelpers.js`, in the `advanceMilestone()` function, add to the returned object:

```javascript
currentMicroStepIndex: 0,  // Reset to first step of new milestone
```

**Step 6: Add to `normalizeStarter()` for migration**

In the normalize function, add fallback:

```javascript
if (typeof starter.currentMicroStepIndex !== "number") {
    starter.currentMicroStepIndex = 0;
}
```

**Step 7: Commit**

```bash
git add src/store/useStarterStore.js src/utils/starterHelpers.js
git commit -m "feat: add currentMicroStepIndex to starter state

Track which micro-step the user is on within a milestone.
Reset to 0 on milestone advance. Add advanceMicroStep action.
Includes sanitization and migration normalization."
```

---

## Task 3: Update HomePage to render micro-steps

**Files:**
- Modify: `src/pages/HomePage.jsx`

**Step 1: Import new helpers**

Add to existing imports from milestones.js:

```javascript
import { getMilestoneById, getMicroStep, getMicroStepCount, MILESTONES } from "../data/milestones";
```

**Step 2: Compute current micro-step**

After the existing `currentMilestone` computation (around line 40), add:

```javascript
const microStepIndex = starter.currentMicroStepIndex ?? 0;
const currentMicroStep = isPreview
    ? getMicroStep(displayMilestoneId, 0)  // Preview always shows first step
    : getMicroStep(starter.currentMilestoneId, microStepIndex);
const totalMicroSteps = getMicroStepCount(displayMilestoneId);
```

**Step 3: Replace the task card content**

In the milestone task card section (around lines 170-197), update to show micro-step content when available:

```jsx
{/* Micro-step progress indicator */}
{currentMilestone?.microSteps && totalMicroSteps > 1 && (
    <div className="flex items-center gap-1.5 mb-3">
        {currentMilestone.microSteps.map((step, idx) => {
            const isCurrent = isPreview ? idx === 0 : idx === microStepIndex;
            const isDone = !isPreview && idx < microStepIndex;
            return (
                <div
                    key={step.id}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                        background: isDone
                            ? 'var(--accent)'
                            : isCurrent
                                ? 'var(--accent)'
                                : 'var(--bg-tertiary)',
                        opacity: isDone ? 0.5 : isCurrent ? 1 : 0.3,
                    }}
                />
            );
        })}
    </div>
)}

{/* Micro-step title */}
{currentMicroStep && (
    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <Icon name={currentMicroStep.icon} size={16} className="inline mr-1.5" />
        {t(currentMicroStep.titleKey)}
    </h4>
)}

{/* Micro-step content (replaces milestone taskKey when available) */}
<p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
    {currentMicroStep ? t(currentMicroStep.contentKey) : t(currentMilestone.taskKey)}
</p>

{/* Milestone tip stays as extra context */}
<p className="text-xs italic mt-2" style={{ color: 'var(--text-tertiary)' }}>
    💡 {t(currentMilestone.tipKey)}
</p>
```

**Step 4: Update the "Complete" button logic**

Replace the existing "Complete Milestone" button with a two-tier system:

```jsx
{!isPreview && (
    <div className="mt-4 flex gap-2">
        {/* "Next Step" button — advances micro-step within milestone */}
        {currentMicroStep && microStepIndex < totalMicroSteps - 1 && (
            <button
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all"
                style={{
                    background: 'var(--accent)',
                    color: 'var(--bg-primary)',
                }}
                onClick={() => advanceMicroStep(starter.id)}
            >
                {t("microStepNext")} →
            </button>
        )}

        {/* "Complete Milestone" button — only at last micro-step or when no micro-steps */}
        {(!currentMicroStep || microStepIndex >= totalMicroSteps - 1) && (
            <button
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all"
                style={{
                    background: isMilestoneAlreadyDone ? 'var(--bg-tertiary)' : 'var(--accent)',
                    color: isMilestoneAlreadyDone ? 'var(--text-tertiary)' : 'var(--bg-primary)',
                }}
                disabled={isMilestoneAlreadyDone}
                onClick={() => handleMilestoneComplete()}
            >
                {isMilestoneAlreadyDone ? t("doneForToday") : t("milestoneCompleteBtn")}
            </button>
        )}
    </div>
)}
```

**Step 5: Get advanceMicroStep from store**

Add to the store destructuring at the top of the component:

```javascript
const advanceMicroStep = useStarterStore((state) => state.advanceMicroStep);
```

**Step 6: Commit**

```bash
git add src/pages/HomePage.jsx
git commit -m "feat: render micro-steps in milestone task card

Show daily micro-step content within the existing milestone card.
Progress dots show which step the user is on. 'Next Step' button
advances within a milestone, 'Complete Milestone' only at the end.
Micro-step titles and content reuse translated dayGuide keys."
```

---

## Task 4: Add i18n keys for micro-step UI elements

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/ro.json`
- Modify: `src/i18n/locales/de.json`
- Modify: `src/i18n/locales/fr.json`
- Modify: `src/i18n/locales/es.json`
- Modify: `src/i18n/locales/it.json`
- Modify: `src/i18n/locales/hu.json`

**Step 1: Add micro-step UI keys to all 7 language files**

These are the NEW keys needed (the dayGuide content keys already exist):

**English:**
```json
"microStepNext": "Next Step",
"microStepProgress": "Step {current} of {total}"
```

**Romanian:**
```json
"microStepNext": "Pasul următor",
"microStepProgress": "Pasul {current} din {total}"
```

**German:**
```json
"microStepNext": "Nächster Schritt",
"microStepProgress": "Schritt {current} von {total}"
```

**French:**
```json
"microStepNext": "Étape suivante",
"microStepProgress": "Étape {current} sur {total}"
```

**Spanish:**
```json
"microStepNext": "Siguiente paso",
"microStepProgress": "Paso {current} de {total}"
```

**Italian:**
```json
"microStepNext": "Passo successivo",
"microStepProgress": "Passo {current} di {total}"
```

**Hungarian:**
```json
"microStepNext": "Következő lépés",
"microStepProgress": "{current}. lépés a {total}-ból"
```

**Step 2: Commit**

```bash
git add src/i18n/locales/
git commit -m "i18n: add micro-step UI labels in all 7 languages"
```

---

## Task 5: Verify and test end-to-end

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Test new starter flow**

1. Clear localStorage (DevTools → Application → Clear)
2. Open app → OnboardingPage should appear
3. Select "Create From Scratch" → Name starter → Start
4. **Verify:** HomePage shows Milestone 1 (Seed Activation) with micro-step 1/3
5. **Verify:** Micro-step title = "The Birth of Your Starter" (dayGuideTitle1)
6. **Verify:** Content shows mixing instructions (dayGuideContent1)
7. **Verify:** Progress dots show 3 dots, first highlighted
8. **Verify:** Button says "Next Step →" (not "Complete Milestone")

**Step 3: Test micro-step advancement**

1. Click "Next Step →"
2. **Verify:** Title changes to "Patience Day" (dayGuideTitle2)
3. **Verify:** Progress dots: first faded, second highlighted, third dim
4. Click "Next Step →" again
5. **Verify:** Title changes to "First Feeding" (dayGuideTitle3)
6. **Verify:** Progress dots: first two faded, third highlighted
7. **Verify:** Button now says "I've reached this milestone!" (no more "Next Step")

**Step 4: Test milestone completion**

1. Click "I've reached this milestone!"
2. **Verify:** Advances to Milestone 2 (Visible Expansion)
3. **Verify:** Micro-step resets to 1/3
4. **Verify:** Title = "The Bacterial Battle" (dayGuideTitle4)
5. **Verify:** Milestone timeline shows checkmark on Milestone 1

**Step 5: Test preview mode**

1. Click on Milestone 3 (Strengthening) in the timeline
2. **Verify:** Preview shows milestone 3 content
3. **Verify:** Shows "Preview" indicator + "Back to current" button
4. **Verify:** No "Next Step" or "Complete" buttons in preview
5. Click "Back to current milestone"
6. **Verify:** Returns to current milestone + current micro-step (not reset)

**Step 6: Test dark mode**

1. Toggle theme to dark
2. **Verify:** Micro-step progress dots use CSS variables correctly
3. **Verify:** All text readable, no hardcoded colors

**Step 7: Test language switching**

1. Switch to Romanian → Verify micro-step title/content in Romanian
2. Switch to German → Verify micro-step title/content in German
3. Switch back to English → Verify English

**Step 8: Test mobile layout**

1. Resize to 375px width
2. **Verify:** Micro-step content doesn't overflow
3. **Verify:** Progress dots are visible
4. **Verify:** Buttons are tappable (min 44px height)

**Step 9: Test multi-starter**

1. Create a second starter
2. Advance it to a different milestone/micro-step
3. Switch between starters
4. **Verify:** Each starter remembers its own micro-step position

**Step 10: Final commit + push**

```bash
git push origin claude/magical-tereshkova
```

---

## Summary of changes

| File | Change |
|------|--------|
| `src/data/milestones.js` | Add `microSteps[]` to each milestone + 2 helper functions |
| `src/store/useStarterStore.js` | Add `currentMicroStepIndex` field, whitelist, sanitization, `advanceMicroStep` action |
| `src/utils/starterHelpers.js` | Reset `currentMicroStepIndex: 0` in `advanceMilestone()`, add to `normalizeStarter()` |
| `src/pages/HomePage.jsx` | Import helpers, compute micro-step, render progress dots + content + two-tier buttons |
| `src/i18n/locales/*.json` (x7) | Add 2 new keys each (`microStepNext`, `microStepProgress`) |

**What stays untouched:**
- Milestone timeline UI (progress bar between milestones)
- Onboarding flow (3 paths)
- Self-paced mode
- Feeding modal
- Stats grid
- Troubleshooting panel
- Motivational system
- `dayGuides.js` and `dailyTasks.js` (remain as data files — their i18n keys are now used)
