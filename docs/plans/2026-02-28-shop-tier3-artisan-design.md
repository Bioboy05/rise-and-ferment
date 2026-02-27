# Shop Tier 3 — The Artisan Collection

## Date: 2026-02-28

## Summary

Add a third product tier to the shop page targeting passionate sourdough bakers who appreciate craftsmanship, tradition, and quality. Four new products with Amazon UK affiliate links.

## New Products

| Product | Slug | ASIN | Price | Badge |
|---------|------|------|-------|-------|
| Zassenhaus Classic Bread Slicer | bread-slicer | B07PBC64W1 | £100–130 | Heirloom |
| Brod & Taylor Folding Proofer | proofer | B01MQK1204 | £170–200 | Pro |
| Danish Dough Whisk (ORBLUE) | dough-whisk | B06ZXWR7VW | £8–12 | — |
| Oval Banneton Set (Walfos) | oval-banneton | B0B14RZNLG | £15–20 | — |

## Tier Structure

- Tier 1 "starter": Starter Kit — Essential Tools (5 products, unchanged)
- Tier 2 "upgrade": Level Up — Premium Picks (4 products, unchanged)
- Tier 3 "artisan": The Artisan Collection — Craft & Tradition (4 new products)

## Files to Modify

1. `netlify.toml` — 4 new /go/ redirects
2. `src/pages/ShopPage.jsx` — 4 products + 4 SVG icons + artisan tier filter
3. `src/i18n/locales/*.json` — i18n keys for all 6 languages (shopTier3, shopBadgeHeirloom, shopBadgePro, 4× name + desc)

## Badge: "Heirloom"

For heritage products with a story (Zassenhaus, est. 1867).

## Badge: "Pro"

For professional-grade equipment (Brod & Taylor proofer).
