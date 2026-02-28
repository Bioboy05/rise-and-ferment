# The Complete Sourdough Handbook — Ebook Monetization

**Date:** 2026-02-28
**Status:** Approved
**Price:** 9.99€ on Gumroad

## Problem

Rise & Ferment's only revenue is Amazon Associates affiliate links (3-5% commission). The project has 14 premium lessons, 5 recipes, a 5-email funnel, and a growing email list — but no direct product to sell.

## Solution

Create a premium PDF ebook using existing content (14 lessons) + exclusive bonus content (recipes, printables), sold via Gumroad with zero infrastructure cost.

## Ebook Structure

### Part 1 — Starter Mastery (14 chapters)
Reformatted from existing lesson content with premium typography:
- Ch 1: Flour & Water: The Basics
- Ch 2: Temperature: Your Main Control
- Ch 3: Hydration Explained
- Ch 4: Finding the Peak (PMC)
- Ch 5: The Science of Fermentation
- Ch 6: Your First Bread
- Ch 7: Maintenance & Storage
- Ch 8: Troubleshooting Guide
- Ch 9: Water Quality & Timing
- Ch 10: Understanding Flour Types
- Ch 11: Flavor Development
- Ch 12: Shaping & Scoring
- Ch 13: Baking Schedules
- Ch 14: Beyond the Basics

### Part 2 — Exclusive Recipes (5 recipes)
Not available in the free app:
- Classic Focaccia (+ rosemary & garlic variants)
- Sourdough Pizza Dough
- Discard Pancakes & Waffles
- Sourdough Crackers
- Sourdough Brioche

### Part 3 — Bonus Printable Tools
- Feeding Quick Reference (cheat sheet)
- Flour Comparison Guide (table)
- My Baking Week (weekly planner)

## Technical Implementation

### PDF Generation
- HTML template with premium CSS (brand colors: cream/brown/amber)
- Fonts: Caveat (headings) + Nunito (body) — same as app
- Export via Puppeteer/Chrome headless `page.pdf()`
- A4 format, print-ready

### Landing Page Integration
- New "Go Premium" section between Tools and Testimonials
- CSS book mockup (no image asset needed)
- 3 bullet points: what's included
- CTA button: "Get the Handbook — 9.99€" → `/go/ebook`
- i18n in all 6 languages

### Blog Integration
- CTA banner at the end of each blog article
- "This article is a preview from The Complete Sourdough Handbook"
- Small purchase button

### Email Funnel Update
- Email 5 gets soft pitch paragraph + Gumroad link
- Not a hard sell — positioned as "want to go deeper?"

### Netlify Redirect
```toml
[[redirects]]
  from = "/go/ebook"
  to = "https://riseferment.gumroad.com/l/handbook"
  status = 302
  force = true
```

## What We Don't Build
- No Gumroad API integration (Gumroad handles delivery)
- No login/account system
- No ebook translations (English only, initially)
- No custom payment gateway

## Revenue Model
- 500 email subscribers × 3% conversion = 15 sales/month
- 15 × 9.99€ = ~150€/month passive income
- Gumroad fee: ~10% → net ~135€/month
- Scales linearly with email list growth

## Files to Create/Modify
- `ebook/` — HTML template + CSS + build script
- `index.html` — New "Go Premium" section + i18n keys
- `netlify.toml` — `/go/ebook` redirect
- `docs/content/ebook-recipes.md` — Exclusive recipe content
