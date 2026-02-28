# Ebook Monetization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a premium PDF ebook "The Complete Sourdough Handbook" and integrate it into the existing landing page, blog, and email funnel for direct monetization via Gumroad.

**Architecture:** HTML template with premium CSS generates PDF via Puppeteer. Landing page gets a new "Go Premium" section. Netlify redirect routes `/go/ebook` to Gumroad. Email 5 gets a soft pitch paragraph.

**Tech Stack:** HTML/CSS (ebook template), Puppeteer (PDF export), vanilla HTML/CSS/JS (landing page), Netlify redirects, MailerLite (email)

---

### Task 1: Netlify Redirect for Ebook

**Files:**
- Modify: `netlify.toml` (after line 156, before "App SPA routing")

**Step 1: Add redirect**

Insert before the `# App SPA routing` comment:

```toml
# Ebook — Gumroad
[[redirects]]
  from = "/go/ebook"
  to = "https://riseferment.gumroad.com/l/handbook"
  status = 302
  force = true
```

Note: The Gumroad URL is a placeholder. Update when the actual Gumroad product is created.

**Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors

**Step 3: Commit**

```bash
git add netlify.toml
git commit -m "feat: add /go/ebook redirect to Gumroad"
```

---

### Task 2: Write Exclusive Recipe Content

**Files:**
- Create: `ebook/content/recipes.md`

**Step 1: Create ebook content directory**

```bash
mkdir -p ebook/content
```

**Step 2: Write 5 exclusive recipes**

Create `ebook/content/recipes.md` with 5 complete recipes not available in the free app:

1. **Classic Focaccia** — with rosemary & garlic variants
   - Ingredients, timing, step-by-step, tips, variants
2. **Sourdough Pizza Dough** — 24h cold ferment method
   - Ingredients, timing, shaping, baking instructions
3. **Discard Pancakes & Waffles** — zero-waste breakfast
   - Ingredients, mixing method, cooking tips
4. **Sourdough Crackers** — herbs & seeds variations
   - Ingredients, rolling technique, baking
5. **Sourdough Brioche** — enriched dough method
   - Ingredients, kneading, proofing, baking

Each recipe should have: title, yield, prep time, ingredients list, numbered steps, pro tips section.

**Step 3: Write bonus printable content**

Create `ebook/content/printables.md` with 3 printable tools:

1. **Feeding Quick Reference** — cheat sheet table (ratio, water temp, timing by goal)
2. **Flour Comparison Guide** — table comparing rye/white/whole wheat/AP (protein%, flavor, best use, fermentation speed)
3. **My Baking Week** — weekly planner grid (Mon-Sun rows, columns: Feed Time, Peak Time, Bake?, Notes)

**Step 4: Commit**

```bash
git add ebook/
git commit -m "content: exclusive ebook recipes + printable tools"
```

---

### Task 3: Ebook HTML Template + CSS

**Files:**
- Create: `ebook/template.html`
- Create: `ebook/styles.css`

**Step 1: Create ebook HTML template**

`ebook/template.html` — A self-contained HTML file with:
- `<link>` to `styles.css`
- Google Fonts: Caveat + Nunito (same as app)
- Page structure:
  - Cover page (title, subtitle, brand)
  - Table of contents
  - Part 1 header page
  - 14 chapter pages (content pulled from en.json lesson keys)
  - Part 2 header page
  - 5 recipe pages (content from recipes.md)
  - Part 3 header page
  - 3 printable pages (content from printables.md)
  - Back cover (about Rise & Ferment, app link, social links)

Each chapter page should have:
- Chapter number + title (h2)
- Content with section headers (h3), paragraphs, styled lists
- Subtle footer with page number and "Rise & Ferment" branding

**Step 2: Create ebook CSS**

`ebook/styles.css` — Print-optimized CSS:
- A4 page size (`@page { size: A4; margin: 2.5cm 2cm; }`)
- Brand colors: `--cream: #FFFBF5`, `--brown: #8B5A2B`, `--dark: #3D2914`, `--amber: #D4A574`
- Fonts: Caveat for h1/h2, Nunito for body
- Page breaks: `page-break-before: always` on chapter headers
- Cover page: centered, large title, subtle background
- Lists: styled bullets (brown dots), numbered steps (brown circles)
- Tables: clean borders, alternating row colors
- Footer: fixed bottom, small font, page counter via `counter(page)`
- Printable pages: dotted lines for fill-in areas, bordered grid cells

**Step 3: Commit**

```bash
git add ebook/template.html ebook/styles.css
git commit -m "feat: ebook HTML template with premium CSS"
```

---

### Task 4: PDF Build Script

**Files:**
- Create: `ebook/build.mjs`
- Modify: `package.json` (add script + puppeteer dev dep)

**Step 1: Install puppeteer**

```bash
npm install --save-dev puppeteer
```

**Step 2: Create build script**

`ebook/build.mjs`:

```js
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, 'template.html');
const outputPath = path.join(__dirname, 'The-Complete-Sourdough-Handbook.pdf');

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });

await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '2.5cm', bottom: '2.5cm', left: '2cm', right: '2cm' },
  displayHeaderFooter: false,
});

await browser.close();
console.log(`PDF generated: ${outputPath}`);
```

**Step 3: Add npm script**

In `package.json`, add to `"scripts"`:

```json
"build:ebook": "node ebook/build.mjs"
```

**Step 4: Add PDF to .gitignore**

Append to `.gitignore`:

```
# Generated ebook
ebook/*.pdf
```

**Step 5: Test PDF generation**

Run: `npm run build:ebook`
Expected: `ebook/The-Complete-Sourdough-Handbook.pdf` created, opens correctly in PDF viewer

**Step 6: Commit**

```bash
git add ebook/build.mjs package.json package-lock.json .gitignore
git commit -m "feat: ebook PDF build script with Puppeteer"
```

---

### Task 5: Landing Page "Go Premium" Section

**Files:**
- Modify: `index.html` (HTML between tools and lead sections, CSS, i18n keys, JS updater)

**Step 1: Add HTML section**

Insert between `</section>` (end of tools, line ~483) and `<!-- LEAD MAGNET -->` (line ~485):

```html
<!-- EBOOK -->
<section class="ebook" id="ebook"><div class="ctn">
<div class="ebook__c reveal">
<div class="ebook__text">
<p class="sl">Go deeper</p>
<h2 class="st">The Complete Sourdough Handbook</h2>
<p class="ss">Everything you need to master sourdough — from first feed to perfect loaf. 14 chapters, 5 exclusive recipes, printable tools.</p>
<ul class="ebook__inc">
<li><svg width="20" height="20"><use href="#ico-book"/></svg> 14 in-depth chapters on starter science</li>
<li><svg width="20" height="20"><use href="#ico-bread"/></svg> 5 exclusive recipes (focaccia, pizza, brioche...)</li>
<li><svg width="20" height="20"><use href="#ico-fire"/></svg> 3 printable tools & cheat sheets</li>
</ul>
<a href="/go/ebook" class="btn btn--hero" target="_blank" rel="noopener">Get the Handbook — 9.99€ <span class="btn__ar">→</span></a>
</div>
<div class="ebook__vis">
<div class="ebook__book">
<div class="ebook__spine"></div>
<div class="ebook__cover">
<div class="ebook__cover-badge">PDF</div>
<p class="ebook__cover-sub">Rise & Ferment</p>
<h3 class="ebook__cover-t">The Complete Sourdough Handbook</h3>
<p class="ebook__cover-ed">60+ pages</p>
</div>
</div>
</div>
</div>
</div></section>
```

**Step 2: Add CSS**

Add to the `<style>` block (after `.tools__disc` styles):

```css
/* EBOOK */
.ebook{padding:var(--gap) 0;background:linear-gradient(180deg,var(--cream) 0%,var(--cream-warm) 100%)}
.ebook__c{display:grid;grid-template-columns:1fr auto;gap:clamp(40px,6vw,80px);align-items:center}
.ebook__text .sl{margin-bottom:8px}.ebook__text .st{margin-bottom:16px}.ebook__text .ss{margin-bottom:28px;max-width:500px}
.ebook__inc{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
.ebook__inc li{display:flex;align-items:center;gap:10px;font-size:.95rem;font-weight:600;color:var(--rye)}
.ebook__inc svg{color:var(--crust);flex-shrink:0}
.ebook__book{width:220px;height:300px;perspective:800px}
.ebook__cover{width:100%;height:100%;background:linear-gradient(135deg,var(--crust),var(--crust-deep));border-radius:4px 16px 16px 4px;padding:32px 24px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;box-shadow:8px 8px 30px rgba(61,41,20,.3);transform:rotateY(-8deg);transition:transform .4s}
.ebook__cover:hover{transform:rotateY(0deg)}
.ebook__spine{position:absolute;left:0;top:0;bottom:0;width:16px;background:linear-gradient(90deg,var(--crust-deep),var(--crust));border-radius:4px 0 0 4px;box-shadow:inset -2px 0 4px rgba(0,0,0,.2)}
.ebook__cover-badge{background:var(--honey);color:var(--crust-deep);font-size:.65rem;font-weight:800;padding:3px 10px;border-radius:100px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px}
.ebook__cover-sub{font-size:.8rem;color:var(--cream);opacity:.7;margin-bottom:8px}
.ebook__cover-t{font-family:var(--font-display);font-size:1.3rem;color:var(--cream);line-height:1.2;margin-bottom:16px}
.ebook__cover-ed{font-size:.75rem;color:var(--cream);opacity:.5}
[data-theme="dark"] .ebook{background:linear-gradient(180deg,var(--bg-dark) 0%,#1E1A15 100%)}
@media(max-width:768px){.ebook__c{grid-template-columns:1fr;text-align:center}.ebook__inc{align-items:center}.ebook__vis{display:flex;justify-content:center}.ebook__book{width:180px;height:250px}}
```

**Step 3: Add i18n keys**

Add to all 6 language objects in the `LANDING_I18N` object inside `<script>`:

English:
```js
ebookSub: 'Go deeper',
ebookTitle: 'The Complete Sourdough Handbook',
ebookDesc: 'Everything you need to master sourdough — from first feed to perfect loaf. 14 chapters, 5 exclusive recipes, printable tools.',
ebookInc1: '14 in-depth chapters on starter science',
ebookInc2: '5 exclusive recipes (focaccia, pizza, brioche...)',
ebookInc3: '3 printable tools & cheat sheets',
ebookCta: 'Get the Handbook — 9.99€',
```

Romanian:
```js
ebookSub: 'Mergi mai departe',
ebookTitle: 'Manualul Complet de Maia',
ebookDesc: 'Tot ce ai nevoie pentru a stăpâni pâinea cu maia — de la prima hrănire la pâinea perfectă. 14 capitole, 5 rețete exclusive, instrumente printabile.',
ebookInc1: '14 capitole detaliate despre știința maielei',
ebookInc2: '5 rețete exclusive (focaccia, pizza, brioche...)',
ebookInc3: '3 instrumente printabile și fișe de referință',
ebookCta: 'Ia Manualul — 9.99€',
```

Italian:
```js
ebookSub: 'Vai più a fondo',
ebookTitle: 'Il Manuale Completo del Lievito Madre',
ebookDesc: 'Tutto ciò che serve per padroneggiare il pane con lievito madre — dal primo rinfresco alla pagnotta perfetta. 14 capitoli, 5 ricette esclusive, strumenti stampabili.',
ebookInc1: '14 capitoli approfonditi sulla scienza del lievito',
ebookInc2: '5 ricette esclusive (focaccia, pizza, brioche...)',
ebookInc3: '3 strumenti stampabili e schede di riferimento',
ebookCta: 'Ottieni il Manuale — 9,99€',
```

German:
```js
ebookSub: 'Tiefer eintauchen',
ebookTitle: 'Das komplette Sauerteig-Handbuch',
ebookDesc: 'Alles, was du brauchst, um Sauerteig zu meistern — vom ersten Füttern bis zum perfekten Laib. 14 Kapitel, 5 exklusive Rezepte, druckbare Tools.',
ebookInc1: '14 ausführliche Kapitel über Sauerteig-Wissenschaft',
ebookInc2: '5 exklusive Rezepte (Focaccia, Pizza, Brioche...)',
ebookInc3: '3 druckbare Tools & Spickzettel',
ebookCta: 'Handbuch holen — 9,99€',
```

French:
```js
ebookSub: 'Aller plus loin',
ebookTitle: 'Le Manuel Complet du Levain',
ebookDesc: 'Tout ce qu\'il faut pour maîtriser le pain au levain — du premier nourrissage au pain parfait. 14 chapitres, 5 recettes exclusives, outils imprimables.',
ebookInc1: '14 chapitres approfondis sur la science du levain',
ebookInc2: '5 recettes exclusives (focaccia, pizza, brioche...)',
ebookInc3: '3 outils imprimables et fiches de référence',
ebookCta: 'Obtenir le Manuel — 9,99€',
```

Spanish:
```js
ebookSub: 'Profundiza más',
ebookTitle: 'El Manual Completo de Masa Madre',
ebookDesc: 'Todo lo que necesitas para dominar el pan de masa madre — desde la primera alimentación hasta la hogaza perfecta. 14 capítulos, 5 recetas exclusivas, herramientas imprimibles.',
ebookInc1: '14 capítulos detallados sobre la ciencia de la masa madre',
ebookInc2: '5 recetas exclusivas (focaccia, pizza, brioche...)',
ebookInc3: '3 herramientas imprimibles y hojas de referencia',
ebookCta: 'Obtener el Manual — 9,99€',
```

**Step 4: Add JS updater**

In the `setLang` function, add after the tools section (after line ~1688) and before `// Lead magnet`:

```js
// Ebook section
setText('.ebook__text .sl', L.ebookSub);
setText('.ebook__text .st', L.ebookTitle);
setText('.ebook__text .ss', L.ebookDesc);
const ebookInc = document.querySelectorAll('.ebook__inc li');
if (ebookInc[0]) setHtml(null, `<svg width="20" height="20"><use href="#ico-book"/></svg> ${L.ebookInc1}`, ebookInc[0]);
if (ebookInc[1]) setHtml(null, `<svg width="20" height="20"><use href="#ico-bread"/></svg> ${L.ebookInc2}`, ebookInc[1]);
if (ebookInc[2]) setHtml(null, `<svg width="20" height="20"><use href="#ico-fire"/></svg> ${L.ebookInc3}`, ebookInc[2]);
setHtml('.ebook .btn--hero', `${L.ebookCta} <span class="btn__ar">→</span>`);
```

Note: The `setHtml` helper may need the 3-arg form. Check how existing helpers work in the codebase before implementing. Adapt as needed.

**Step 5: Verify build**

Run: `npm run build`
Expected: Clean build

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: landing page Go Premium ebook section with i18n"
```

---

### Task 6: Blog Article CTA Banner

**Files:**
- Modify: `index.html` (CSS for banner + JS to inject banner into article view)

**Step 1: Add banner CSS**

Add to `<style>` block (after ebook styles):

```css
/* EBOOK BLOG CTA */
.a-ebook{text-align:center;padding:32px;background:linear-gradient(135deg,var(--cream-warm),var(--parchment));border-radius:20px;margin-top:40px;border:1.5px solid rgba(139,90,43,.1)}
.a-ebook__t{font-family:var(--font-display);font-size:1.2rem;color:var(--crust-deep);margin-bottom:8px}
.a-ebook__d{font-size:.9rem;color:var(--rye);margin-bottom:16px}
.a-ebook .btn--p{font-size:.9rem;padding:12px 24px}
```

**Step 2: Add i18n keys for blog CTA**

Add to all 6 language objects:

English:
```js
blogEbookTitle: 'Want the complete guide?',
blogEbookDesc: 'This article is a preview from The Complete Sourdough Handbook — 14 chapters, 5 exclusive recipes, and printable tools.',
blogEbookCta: 'Get the Handbook — 9.99€',
```

(Same pattern for ro, it, de, fr, es — translate the 3 keys)

**Step 3: Inject banner into article render**

In the `showArticle(id)` function, after the article content is rendered, append the ebook CTA banner:

```js
// After article content is inserted
const articleContent = document.querySelector('.article-content'); // or wherever content goes
if (articleContent) {
  const L = LANDING_I18N[lang];
  const ebookBanner = document.createElement('div');
  ebookBanner.className = 'a-ebook';
  ebookBanner.innerHTML = `<h3 class="a-ebook__t">${L.blogEbookTitle}</h3><p class="a-ebook__d">${L.blogEbookDesc}</p><a href="/go/ebook" class="btn btn--p" target="_blank" rel="noopener">${L.blogEbookCta} <span class="btn__ar">→</span></a>`;
  articleContent.appendChild(ebookBanner);
}
```

Note: Find the exact element selector by reading the `showArticle` function. Adapt the injection point accordingly.

**Step 4: Verify in browser**

Open landing page → click any blog article → scroll to bottom → CTA banner should appear

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: ebook CTA banner in blog articles"
```

---

### Task 7: Email Funnel Update (Documentation)

**Files:**
- Modify: `docs/email-funnel-content.md` (add ebook pitch to Email 5)

**Step 1: Update Email 5 content**

In `docs/email-funnel-content.md`, add a new paragraph before the P.S. in Email 5 (between line ~191 and ~195):

```markdown
**Ready to take your baking to the next level?**

I've put everything I know into The Complete Sourdough Handbook — 14 chapters of science-backed techniques, 5 exclusive recipes you won't find in the app (including my favourite focaccia), and printable cheat sheets you can stick on your fridge.

It's the guide I wish existed when I started: https://riseandferment.com/go/ebook
```

The existing P.S. about the FWSY book stays — it complements rather than competes.

**Step 2: Commit**

```bash
git add docs/email-funnel-content.md
git commit -m "content: add ebook soft pitch to Email 5 funnel"
```

**Step 3: Manual action (not code)**

After committing, the user needs to manually update Email 5 in MailerLite with the new paragraph. This is a copy-paste task in the MailerLite dashboard.

---

### Task 8: Final Build + Deploy

**Step 1: Full build verification**

Run: `npm run build`
Expected: Clean build, no errors

**Step 2: Push all changes**

```bash
git push
```

**Step 3: Deploy to Netlify**

```bash
npx netlify-cli deploy --prod
```

Expected: Deploy succeeds, site live at https://riseandferment.com

**Step 4: Verify live site**

Check these pages:
- Landing page → scroll to "Go Premium" section between Tools and Testimonials
- Click any blog article → scroll to bottom → ebook CTA banner visible
- Click "Get the Handbook" button → redirects to Gumroad (placeholder for now)
- Test `/go/ebook` directly → should redirect

---

## Execution Order Summary

| # | Task | Effort | Dependencies |
|---|------|--------|--------------|
| 1 | Netlify redirect | 2 min | None |
| 2 | Recipe + printable content | 30 min | None |
| 3 | Ebook HTML template + CSS | 45 min | Task 2 |
| 4 | PDF build script | 15 min | Task 3 |
| 5 | Landing page section | 30 min | Task 1 |
| 6 | Blog CTA banner | 15 min | Task 5 |
| 7 | Email funnel update | 5 min | None |
| 8 | Build + deploy | 5 min | All above |

**Parallelizable:** Tasks 1, 2, 7 can run in parallel. Tasks 3-4 are sequential. Tasks 5-6 are sequential.
