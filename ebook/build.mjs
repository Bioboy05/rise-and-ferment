#!/usr/bin/env node

/**
 * Ebook PDF Build Script — v2.0
 * Reads markdown chapter files from ebook/content/chapters/,
 * appendix files from ebook/content/, and generates an A4 PDF.
 *
 * Usage: node ebook/build.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// CLI flags (parsed early — LANG is needed before template loading)
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const FLAG_COVER = args.includes('--cover');
const FLAG_PREVIEW = args.includes('--preview');
const FLAG_THUMBNAIL = args.includes('--thumbnail');
const langIdx = args.indexOf('--lang');
const LANG = langIdx !== -1 && args[langIdx + 1] ? args[langIdx + 1] : 'en';

// ---------------------------------------------------------------------------
// 1. Markdown → HTML Parser
// ---------------------------------------------------------------------------

/** Apply inline formatting: **bold**, *italic* */
function inlineFmt(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
}

/** Parse markdown table lines into HTML <table> */
function renderTable(lines) {
  const dataLines = lines.filter(l => !/^\|[\s\-:|]+\|$/.test(l.trim()));
  if (dataLines.length === 0) return '';

  const parseRow = line => line.trim().slice(1, -1).split('|').map(c => c.trim());
  const headers = parseRow(dataLines[0]);
  const rows = dataLines.slice(1).map(parseRow);

  let html = '<table>\n<thead><tr>';
  headers.forEach(h => { html += `<th>${inlineFmt(h)}</th>`; });
  html += '</tr></thead>\n<tbody>\n';
  rows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => { html += `<td>${inlineFmt(cell)}</td>`; });
    html += '</tr>\n';
  });
  html += '</tbody>\n</table>';
  return html;
}

/** Render a Deep Dive blockquote as a styled div */
function renderDeepDive(text) {
  const paras = text.split(/\n\n+/).filter(p => p.trim());

  // Extract title from first paragraph
  const titlePara = paras[0];
  const titleMatch = titlePara.match(/\*\*Deep Dive:\s*(.+?)\*\*/);
  const rawTitle = titleMatch ? titleMatch[1] : 'Deep Dive';
  const title = rawTitle.replace(/^[""\u201C]|[""\u201D]$/g, '');

  // Content after the title line in the first paragraph
  const afterTitle = titlePara.replace(/\*\*Deep Dive:\s*.+?\*\*/, '').trim();
  let bodyParas = paras.slice(1);
  if (afterTitle) bodyParas = [afterTitle, ...bodyParas];

  // Parse body paragraphs
  const bodyHtml = bodyParas.map(p => {
    const trimmed = p.trim();

    // List items
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n')
        .filter(l => l.trim().startsWith('- '))
        .map(l => `<li>${inlineFmt(l.trim().slice(2))}</li>`)
        .join('\n');
      return `<ul>\n${items}\n</ul>`;
    }

    // Table
    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      return renderTable(trimmed.split('\n'));
    }

    // Regular paragraph
    return `<p>${inlineFmt(trimmed.replace(/\n/g, ' '))}</p>`;
  }).join('\n');

  return `<div class="deep-dive">\n<h4>Deep Dive: ${title}</h4>\n${bodyHtml}\n</div>`;
}

/**
 * Parse markdown text into HTML.
 * Skips the first # heading (title is already in the HTML template).
 */
function parseMarkdown(text) {
  const lines = text.split('\n');
  const output = [];
  let i = 0;
  let firstHeadingSkipped = false;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // --- Empty line ---
    if (!trimmed) { i++; continue; }

    // --- # Heading (top-level) ---
    if (/^# /.test(trimmed) && !/^## /.test(trimmed)) {
      if (!firstHeadingSkipped) {
        firstHeadingSkipped = true;
        i++;
        continue; // skip — title is in template
      }
      output.push(`<h2>${inlineFmt(trimmed.slice(2))}</h2>`);
      i++;
      continue;
    }

    // --- ## Heading ---
    if (/^## /.test(trimmed) && !/^### /.test(trimmed)) {
      output.push(`<h2>${inlineFmt(trimmed.slice(3))}</h2>`);
      i++;
      continue;
    }

    // --- ### Heading ---
    if (/^### /.test(trimmed)) {
      output.push(`<h3>${inlineFmt(trimmed.slice(4))}</h3>`);
      i++;
      continue;
    }

    // --- Horizontal rule ---
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      output.push('<hr>');
      i++;
      continue;
    }

    // --- Blockquote ---
    if (trimmed.startsWith('> ') || trimmed === '>') {
      const bqLines = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (l.startsWith('> ') || l === '>') {
          bqLines.push(l === '>' ? '' : l.slice(2));
          i++;
        } else {
          break;
        }
      }
      const bqText = bqLines.join('\n');

      if (/^\*\*Deep Dive/.test(bqText)) {
        output.push(renderDeepDive(bqText));
      } else {
        // Regular blockquote
        const paragraphs = bqText.split(/\n\n+/).filter(p => p.trim());
        const inner = paragraphs
          .map(p => `<p>${inlineFmt(p.trim().replace(/\n/g, ' '))}</p>`)
          .join('\n');
        output.push(`<blockquote>\n${inner}\n</blockquote>`);
      }
      continue;
    }

    // --- Table ---
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      output.push(renderTable(tableLines));
      continue;
    }

    // --- Unordered list ---
    if (trimmed.startsWith('- ')) {
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (l.startsWith('- ')) {
          items.push(l.slice(2));
          i++;
        } else if (l === '') {
          // Peek ahead — if next non-empty line is also a list item, continue
          let peek = i + 1;
          while (peek < lines.length && !lines[peek].trim()) peek++;
          if (peek < lines.length && lines[peek].trim().startsWith('- ')) {
            i = peek;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      const html = items.map(item => `<li>${inlineFmt(item)}</li>`).join('\n');
      output.push(`<ul>\n${html}\n</ul>`);
      continue;
    }

    // --- Ordered list ---
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        const m = l.match(/^\d+\.\s+(.+)/);
        if (m) {
          items.push(m[1]);
          i++;
        } else if (l === '') {
          let peek = i + 1;
          while (peek < lines.length && !lines[peek].trim()) peek++;
          if (peek < lines.length && /^\d+\.\s+/.test(lines[peek].trim())) {
            i = peek;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      const html = items.map(item => `<li>${inlineFmt(item)}</li>`).join('\n');
      output.push(`<ol>\n${html}\n</ol>`);
      continue;
    }

    // --- Regular paragraph ---
    output.push(`<p>${inlineFmt(trimmed)}</p>`);
    i++;
  }

  return output.join('\n');
}

// ---------------------------------------------------------------------------
// 2. Load template
// ---------------------------------------------------------------------------

const templateFile = LANG === 'en' ? 'template.html' : `template-${LANG}.html`;
const templatePath = join(__dirname, templateFile);
const chaptersDir = LANG === 'en'
  ? join(__dirname, 'content', 'chapters')
  : join(__dirname, 'content', LANG, 'chapters');
const contentDir = LANG === 'en'
  ? join(__dirname, 'content')
  : join(__dirname, 'content', LANG);

console.log(`Building ${LANG.toUpperCase()} edition...`);
console.log(`Reading template: ${templateFile}`);
let html = readFileSync(templatePath, 'utf-8');

// ---------------------------------------------------------------------------
// 3. Replace chapter placeholders with parsed markdown
// ---------------------------------------------------------------------------

const chapterFiles = [
  '01-flour-and-water.md',
  '02-temperature-control.md',
  '03-hydration-explained.md',
  '04-finding-the-peak.md',
  '05-science-of-fermentation.md',
  '06-your-first-bread.md',
  '07-maintenance-and-storage.md',
  '08-troubleshooting-guide.md',
  '09-water-quality-and-timing.md',
  '10-understanding-flour-types.md',
  '11-flavor-development.md',
  '12-shaping-and-scoring.md',
  '13-baking-schedules.md',
  '14-beyond-the-basics.md',
  '15-trending-techniques.md',
];

let chapterCount = 0;
for (let i = 0; i < chapterFiles.length; i++) {
  const filePath = join(chaptersDir, chapterFiles[i]);
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ ${chapterFiles[i]} not found`);
    continue;
  }
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = parseMarkdown(raw);
  html = html.replace(`{{chapterContent_${i + 1}}}`, parsed);
  chapterCount++;
}
console.log(`${chapterCount}/15 chapter placeholders replaced.`);

// ---------------------------------------------------------------------------
// 4. Replace appendix placeholders
// ---------------------------------------------------------------------------

const appendixMap = {
  '{{quickStartContent}}': 'quick-start.md',
  '{{glossaryContent}}': 'glossary.md',
  '{{faqContent}}': 'faq.md',
  '{{seasonalCalendarContent}}': 'seasonal-calendar.md',
};

let appendixCount = 0;
for (const [placeholder, filename] of Object.entries(appendixMap)) {
  const filePath = join(contentDir, filename);
  if (!existsSync(filePath)) {
    console.warn(`  ⚠ ${filename} not found`);
    continue;
  }
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = parseMarkdown(raw);
  html = html.replace(placeholder, parsed);
  appendixCount++;
}
console.log(`${appendixCount}/4 appendix placeholders replaced.`);

// ---------------------------------------------------------------------------
// 5. Launch Puppeteer & generate outputs
// ---------------------------------------------------------------------------

async function loadPuppeteer() {
  try {
    return await import('puppeteer');
  } catch {
    console.error(
      'Puppeteer is not installed. Run:\n  npm install --save-dev puppeteer'
    );
    process.exit(1);
  }
}

async function launchPage(puppeteer, htmlContent) {
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const tempPath = join(__dirname, '_build_temp.html');
  writeFileSync(tempPath, htmlContent, 'utf-8');
  const tempUrl = `file:///${tempPath.replace(/\\/g, '/')}`;
  await page.goto(tempUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  return { browser, page, tempPath };
}

function cleanup(tempPath) {
  try { const { unlinkSync } = require('fs'); unlinkSync(tempPath); } catch { /* ignore */ }
}

// --- Cover image (1600x2560 PNG) ---
async function generateCover(puppeteer) {
  console.log('Generating cover image...');
  const { browser, page, tempPath } = await launchPage(puppeteer, html);

  // Set viewport to cover aspect ratio (1600x2560 = 5:8)
  await page.setViewport({ width: 1600, height: 2560, deviceScaleFactor: 1 });

  // Screenshot just the cover section
  const coverEl = await page.$('.cover');
  if (!coverEl) {
    console.error('Cover section not found in template');
    await browser.close();
    cleanup(tempPath);
    return;
  }

  const suffix = LANG === 'en' ? '' : `-${LANG}`;
  const coverPath = join(__dirname, `cover-gumroad${suffix}.png`);
  await coverEl.screenshot({ path: coverPath, type: 'png' });

  cleanup(tempPath);
  await browser.close();
  console.log(`Cover image generated: ${coverPath}`);
}

// --- Thumbnail image (600x600 square PNG for Gumroad Discover/Library) ---
async function generateThumbnail(puppeteer) {
  console.log('Generating thumbnail image...');
  const { browser, page, tempPath } = await launchPage(puppeteer, html);

  // 600x600 square viewport
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });

  // Build square thumbnail content (language-aware, all hardcoded build-time strings)
  const thumbText = LANG === 'ro' ? {
    brand: 'Maiaua Mea',
    title: 'Ghidul Complet al Maielei',
    subtitle: 'De la Prima Hrănire la Pâinea Perfectă',
    stats: '160+ Pagini · 15 Aprofundări · 5 Rețete',
  } : {
    brand: 'Rise & Ferment',
    title: 'The Complete Sourdough Handbook',
    subtitle: 'From First Feed to Perfect Loaf',
    stats: '150+ Pages · 15 Deep Dives · 5 Recipes',
  };

  await page.evaluate((t) => {
    // Build-time only: Puppeteer thumbnail generation with hardcoded strings
    document.body.textContent = '';
    const div = document.createElement('div');
    div.style.cssText = `
      width: 600px; height: 600px;
      background: linear-gradient(135deg, #FFFBF5 0%, #F5E6D3 50%, #E8D5C0 100%);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 40px;
      box-sizing: border-box; font-family: 'Caveat', cursive;
    `;

    const els = [
      { tag: 'div', text: t.brand, style: 'font-size:16px;color:#8B5A2B;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;font-family:Nunito,sans-serif' },
      { tag: 'div', text: t.title, style: 'font-size:42px;color:#3D2914;line-height:1.15;margin-bottom:16px;font-weight:bold' },
      { tag: 'div', text: '', style: 'width:60px;height:2px;background:#D4A574;margin:0 auto 16px' },
      { tag: 'div', text: t.subtitle, style: 'font-size:15px;color:#8B5A2B;font-family:Nunito,sans-serif' },
      { tag: 'div', text: t.stats, style: 'margin-top:24px;font-size:13px;color:#A0845C;font-family:Nunito,sans-serif' },
    ];
    for (const { tag, text, style } of els) {
      const el = document.createElement(tag);
      el.textContent = text;
      el.style.cssText = style;
      div.appendChild(el);
    }

    document.body.appendChild(div);
    document.body.style.margin = '0';
  }, thumbText);

  const suffix = LANG === 'en' ? '' : `-${LANG}`;
  const thumbPath = join(__dirname, `thumbnail-gumroad${suffix}.png`);
  await page.screenshot({ path: thumbPath, type: 'png', clip: { x: 0, y: 0, width: 600, height: 600 } });

  cleanup(tempPath);
  await browser.close();
  console.log(`Thumbnail generated: ${thumbPath}`);
}

// --- Preview PDF (subset: cover + TOC + ch1 partial + "get full handbook" page) ---
async function generatePreview(puppeteer) {
  console.log('Generating preview PDF...');

  // Inject a "Get the full handbook" page at the end and hide most content
  const previewStyle = `
    <style>
      /* Hide everything after chapter 1 */
      article[id]:not(#cover-wrapper):not(#toc-wrapper):not(#introduction):not(#quick-start):not(#chapter-1) { display: none !important; }
      .part-divider:not(:first-of-type) { display: none !important; }
      section.back-cover { display: none !important; }

      /* Add "preview" watermark */
      body::before {
        content: 'PREVIEW';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 120pt;
        color: rgba(139, 90, 43, 0.06);
        font-weight: 900;
        pointer-events: none;
        z-index: 9999;
      }

      /* "Get the full handbook" CTA page */
      .preview-cta {
        page-break-before: always;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40mm 20mm;
      }
      .preview-cta h2 {
        font-family: 'Playfair Display', serif;
        font-size: 28pt;
        color: #3D2914;
        margin-bottom: 16pt;
      }
      .preview-cta p {
        font-size: 13pt;
        color: #6B4F3A;
        line-height: 1.7;
        max-width: 400px;
        margin-bottom: 12pt;
      }
      .preview-cta .cta-link {
        display: inline-block;
        margin-top: 20pt;
        padding: 14pt 36pt;
        background: #8B5A2B;
        color: #FFFBF5;
        font-size: 14pt;
        font-weight: 700;
        border-radius: 8pt;
        text-decoration: none;
      }
    </style>
  `;

  const ctaText = LANG === 'ro' ? {
    heading: 'Îți place previzualizarea?',
    body: 'Aceasta este doar începutul. Ghidul complet conține 15 capitole detaliate, 15 secțiuni exclusive de Aprofundare, 5 rețete testate, 5 instrumente printabile, un glosar complet, FAQ și calendar sezonier.',
    price: '160+ pagini de cunoștințe experte pentru doar &euro;7,99',
    cta: 'Obține Ghidul Complet',
    link: 'https://fermenter26.gumroad.com/l/ghid-maia',
  } : {
    heading: 'Enjoying the preview?',
    body: 'This is just the beginning. The full handbook contains 15 in-depth chapters, 15 exclusive Deep Dive sections, 5 tested recipes, 5 printable tools, a complete glossary, FAQ, and seasonal baking guide.',
    price: '150+ pages of expert knowledge for just &euro;9.99',
    cta: 'Get the Complete Handbook',
    link: 'https://fermenter26.gumroad.com/l/handbook',
  };

  const ctaPage = `
    <div class="preview-cta">
      <h2>${ctaText.heading}</h2>
      <p>${ctaText.body}</p>
      <p><strong>${ctaText.price}</strong></p>
      <a class="cta-link" href="${ctaText.link}">${ctaText.cta}</a>
    </div>
  `;

  // Insert preview style before </head> and CTA before </body>
  let previewHtml = html
    .replace('</head>', `${previewStyle}\n</head>`)
    .replace('</body>', `${ctaPage}\n</body>`);

  const { browser, page, tempPath } = await launchPage(puppeteer, previewHtml);

  const previewNames = { en: 'Sourdough-Handbook-Preview.pdf', ro: 'Ghid-Maia-Previzualizare.pdf' };
  const previewPath = join(__dirname, previewNames[LANG] || previewNames.en);
  await page.pdf({
    path: previewPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '25mm', right: '20mm', bottom: '25mm', left: '20mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
      <div style="width:100%;text-align:center;font-size:9px;color:#8B5A2B;font-family:sans-serif;">
        <span class="pageNumber"></span> &mdash; PREVIEW
      </div>
    `,
  });

  cleanup(tempPath);
  await browser.close();
  console.log(`Preview PDF generated: ${previewPath}`);
}

// --- Extract page numbers from a PDF buffer by matching TOC titles ---
async function extractPageNumbers(pdfBuffer, page) {
  const { PDFParse } = require('pdf-parse');

  // Get TOC anchor targets from the loaded page DOM
  const tocTargets = await page.evaluate(() => {
    const entries = [];
    document.querySelectorAll('.toc-list a[href^="#"]').forEach(link => {
      entries.push({
        id: link.getAttribute('href').substring(1),
        text: link.textContent.trim(),
      });
    });
    return entries;
  });

  // Extract text per page using PDFParse class
  const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
  const result = await parser.getText();
  await parser.destroy();

  // Find the TOC pages to skip (they list all titles as text)
  // The TOC heading is "Contents" (EN) or "Cuprins" (RO)
  let tocEndPage = 0;
  for (const pg of result.pages) {
    const trimmed = pg.text.trim();
    if (trimmed.startsWith('Contents') || trimmed.startsWith('Cuprins')) {
      // TOC spans this page + the next (continuation)
      tocEndPage = Math.max(tocEndPage, pg.num + 1);
    }
  }

  // Build search keys for each TOC target
  const entries = tocTargets.map(({ id, text }) => {
    const shortKey = text
      .replace(/\s+/g, ' ')
      .replace(/^(Chapter|Capitolul)\s+\d+:\s*/i, '')
      .replace(/^(Recipe|Rețeta|Reteta)\s+\d+:\s*/i, '')
      .replace(/^(Appendix|Anexă|Anexa)\s+\w+:\s*/i, '')
      .replace(/^(Printable|Imprimabil)\s+\d+:\s*/i, '')
      .trim();
    return { id, shortKey };
  });

  // Also skip part divider pages (they mention section titles in subtitles)
  const contentPages = result.pages.filter(pg => {
    if (pg.num <= tocEndPage) return false;
    const start = pg.text.trim().slice(0, 30);
    // Part dividers start with spaced "P A R T" (EN/RO)
    if (/^P\s+A\s+R\s+T/.test(start)) return false;
    return true;
  });
  const pageMap = {};

  // Pass 1: exact substring match (most reliable)
  for (const { id, shortKey } of entries) {
    for (const pg of contentPages) {
      if (pg.text.replace(/\s+/g, ' ').includes(shortKey)) {
        pageMap[id] = pg.num;
        break;
      }
    }
  }

  // Pass 2: fallbacks for entries not found in pass 1
  for (const { id, shortKey } of entries) {
    if (pageMap[id]) continue;
    // Try first part before em-dash (e.g. "My Baking Week" from "My Baking Week — Weekly Planner")
    const beforeDash = shortKey.split(/\s*[—–]\s*/)[0].trim();
    // Try collapsed matching (handles spaced-out headings like "Q U I C K-S T A R T")
    const collapsed = shortKey.replace(/[\s\-—–]/g, '').toLowerCase();

    for (const pg of contentPages) {
      const norm = pg.text.replace(/\s+/g, ' ');
      if ((beforeDash !== shortKey && norm.includes(beforeDash))
        || pg.text.replace(/[\s\-—–]/g, '').toLowerCase().includes(collapsed)) {
        pageMap[id] = pg.num;
        break;
      }
    }
  }

  return pageMap;
}

// --- Full PDF (two-pass: discover page numbers, then inject into TOC) ---
async function generatePDF(puppeteer) {
  const pdfNames = {
    en: 'The-Complete-Sourdough-Handbook.pdf',
    ro: 'Ghidul-Complet-al-Maielei.pdf',
  };
  const outputPath = join(__dirname, pdfNames[LANG] || pdfNames.en);
  console.log(`Generating full PDF (${LANG})...`);

  const { browser, page, tempPath } = await launchPage(puppeteer, html);

  const pdfOptions = {
    format: 'A4',
    printBackground: true,
    margin: { top: '25mm', right: '20mm', bottom: '25mm', left: '20mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
      <div style="width:100%;text-align:center;font-size:9px;color:#8B5A2B;font-family:sans-serif;">
        <span class="pageNumber"></span>
      </div>
    `,
  };

  // --- Pass 1: generate PDF buffer to discover page numbers ---
  console.log('  Pass 1: discovering page numbers...');
  const firstPassBuffer = await page.pdf(pdfOptions);

  // --- Extract page numbers from first-pass PDF ---
  const pageMap = await extractPageNumbers(firstPassBuffer, page);
  const found = Object.keys(pageMap).length;
  console.log(`  Found ${found} TOC page numbers`);
  for (const [id, num] of Object.entries(pageMap)) {
    console.log(`    ${id} → p.${num}`);
  }

  // --- Inject page numbers into .toc-page spans ---
  await page.evaluate((map) => {
    document.querySelectorAll('.toc-list a[href^="#"]').forEach(link => {
      const id = link.getAttribute('href').substring(1);
      const span = link.closest('.toc-entry')?.querySelector('.toc-page');
      if (span && map[id]) {
        span.textContent = map[id];
      }
    });
  }, pageMap);

  // --- Pass 2: generate final PDF with page numbers ---
  console.log('  Pass 2: generating final PDF with page numbers...');
  await page.pdf({ ...pdfOptions, path: outputPath });

  cleanup(tempPath);
  await browser.close();
  console.log(`PDF generated: ${outputPath}`);
}

// --- Main ---
async function main() {
  console.log('Launching browser...');
  const puppeteer = await loadPuppeteer();

  if (FLAG_COVER) {
    await generateCover(puppeteer);
  }

  if (FLAG_THUMBNAIL) {
    await generateThumbnail(puppeteer);
  }

  if (FLAG_PREVIEW) {
    await generatePreview(puppeteer);
  }

  if (!FLAG_COVER && !FLAG_PREVIEW && !FLAG_THUMBNAIL) {
    await generatePDF(puppeteer);
  }
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
