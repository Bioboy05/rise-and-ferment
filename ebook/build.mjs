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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const templatePath = join(__dirname, 'template.html');
const chaptersDir = join(__dirname, 'content', 'chapters');
const contentDir = join(__dirname, 'content');

console.log('Reading template...');
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
console.log(`${chapterCount}/14 chapter placeholders replaced.`);

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
// 5. Generate PDF with Puppeteer
// ---------------------------------------------------------------------------

async function generatePDF() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.error(
      'Puppeteer is not installed. Run:\n  npm install --save-dev puppeteer'
    );
    process.exit(1);
  }

  const outputPath = join(__dirname, 'The-Complete-Sourdough-Handbook.pdf');

  console.log('Launching browser...');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Write processed HTML to temp file so CSS relative paths work
  const tempPath = join(__dirname, '_build_temp.html');
  writeFileSync(tempPath, html, 'utf-8');

  const tempUrl = `file:///${tempPath.replace(/\\/g, '/')}`;
  console.log('Loading HTML...');
  await page.goto(tempUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts
  await page.evaluateHandle('document.fonts.ready');

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '25mm',
      right: '20mm',
      bottom: '30mm',
      left: '20mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
      <div style="width:100%;text-align:center;font-size:9px;color:#8B5A2B;font-family:sans-serif;">
        <span class="pageNumber"></span>
      </div>
    `,
  });

  // Clean up temp file
  const { unlinkSync } = await import('fs');
  try { unlinkSync(tempPath); } catch { /* ignore */ }

  await browser.close();

  console.log(`\nPDF generated: ${outputPath}`);
}

generatePDF().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
