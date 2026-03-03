# Marketing Funnel Redesign — Elena's Kitchen (Approach A)

**Date:** 2026-03-03
**File:** `index.html` (all changes in single file)
**Status:** Approved — ready for implementation

---

## Goal

Redesign the landing page funnel to drive book/ebook sales and brand awareness through Elena's authentic voice, multi-generational health stories, and product-specific psychological triggers.

## New Page Flow

| # | Section | Status | Notes |
|---|---------|--------|-------|
| 1 | Hero | KEEP | No changes |
| 2 | **Elena's Health & Family** | **NEW** | 3 story vignettes with light science |
| 3 | Books | MOVE UP + REWRITE | From #4, new copy with psych triggers |
| 4 | Features | KEEP | No changes |
| 5 | Guide (Lead Magnet) | MOVE UP | From #6, no content changes |
| 6 | Blog | KEEP | No changes |
| 7 | Testimonials | MOVE UP | From #8, no content changes |
| 8 | Problems | MOVE DOWN + SHORTEN | From #2, 4→2 cards, new heading |
| 9 | Tools | KEEP | No changes |
| 10 | ~~Newsletter~~ | **DELETE** | Redundant with Guide + sticky CTA + exit popup |

## New Section: Elena's Health & Family (#2)

### Content (English)

**Subtitle:** Elena's corner
**Title:** More than bread — it's how we care
**Desc:** I'm Elena. I bake for my family every week. Here's what sourdough taught us.

**Vignette 1 — Kids (icon: hands/heart)**
> "My little one watches the bubbles rise every morning. At 4, he already knows: good things take time."
> Science: Studies show children who participate in baking develop patience and fine motor skills earlier.

**Vignette 2 — Grandparents / Digestion (icon: wheat)**
> "When bunica switched to real sourdough, her digestion changed in weeks. She says it reminds her of childhood bread."
> Science: Long fermentation breaks down gluten and phytic acid, making nutrients more bioavailable. (Journal of Agricultural and Food Chemistry, 2019)

**Vignette 3 — Sacred / Slow Living (icon: sun/home)**
> "There's something holy about baking bread with your own hands. The house smells like home. Time slows down."
> No science — just the universal sacredness of bread-making.

### Visual Design
- Warm editorial feel, Elena's name in Caveat font
- Subtle background gradient (lighter than hero)
- 3 vignettes: vertical stack on mobile, 3-column grid on desktop
- Science text: smaller, italic, muted olive color
- Dark mode: proper color inversion

### CSS Class
`.elena` — follows `.prob`/`.feat` pattern:
- `.elena__story` cards with warm border
- `.elena__sci` for science citations
- `[data-theme="dark"] .elena` overrides

### i18n Keys (9 new)
`elenaSub`, `elenaTitle`, `elenaDesc`, `elenaStory1`, `elenaSci1`, `elenaStory2`, `elenaSci2`, `elenaStory3`, `elenaSci3`

## Books Section — Rewritten Copy

### Milo & Maia — Gift-Giving / Inspirational Trigger
- **Badge:** "Perfect Gift" (was "New!")
- **Desc:** "The book that brings families together. Watch your child's eyes light up as Milo discovers that magic happens when you wait. For parents, grandparents, and aunts who believe kids deserve real experiences — not just screens."
- **Chips:** "Ages 3–8" | "Gift-Ready" | "Family Bonding"
- **Urgency line (NEW):** "The gift they'll remember"

### Handbook — FOMO / Complete Utility Trigger
- **Desc:** "Everything you need in one place. No expensive courses, no conflicting YouTube advice, no guessing. 14 chapters of tested knowledge — from first starter to artisan scoring techniques. The only sourdough resource you'll ever need."
- **Chips:** "Replaces €200+ courses" | "5 Recipes" | "Printable Tools"
- **Urgency line (NEW):** "2,400+ bakers chose this"

### i18n Changes
- Update: `bookMiloDesc`, `bookMiloBadge`, `bookMiloChip1-3`, `bookHandbookDesc`, `bookHandbookChip1`
- Add: `bookMiloUrgency`, `bookHandbookUrgency` (2 new keys)

## Problems Section — Shortened

### Changes
- Reduce from 4 cards to 2 (keep "When do I feed?" and "Is my starter alive?")
- New subtitle: "Still not sure?"
- New title: "We've been there too"
- New desc: "These are the two questions every beginner asks."

### i18n Changes
- Update: `probSub`, `probTitle`, `probText`
- Remove: card 3 ("Why isn't it rising?") and card 4 ("How do I fit this?") from HTML only (keep translations for future use)

## Newsletter Section — Deleted

Remove entire `<section class="nl" id="newsletter">` block. Email capture remains via:
1. Lead Magnet form (#guide)
2. Sticky CTA bar (#stickyCta)
3. Exit popup (#exitPopup)

## Translation Scope

11 new i18n keys × 7 languages = 77 translations needed.
~8 updated keys × 7 languages = 56 translations updated.

Languages: en, ro, it, de, fr, es, hu

## Implementation Order

1. Add Elena section CSS
2. Add Elena section HTML (after hero, before features)
3. Move sections in HTML (Books up, Problems down, delete Newsletter)
4. Rewrite Books copy in HTML
5. Shorten Problems section in HTML
6. Add all new i18n keys to LANDING_I18N for all 7 languages
7. Update existing i18n keys
8. Add urgency line elements to Books cards
9. Verify both themes, mobile, 0 errors
10. Commit + push
