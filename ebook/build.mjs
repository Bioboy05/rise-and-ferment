#!/usr/bin/env node

/**
 * Ebook PDF Build Script
 * Reads template.html, replaces {{lessonContent_N}} placeholders
 * with parsed lesson content from en.json, and generates an A4 PDF.
 *
 * Usage: node ebook/build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// 1. Parse lesson content from plain text to HTML
// ---------------------------------------------------------------------------

function parseLessonContent(text) {
  const lines = text.split('\n');
  const parts = [];
  let currentList = null; // 'ul' | 'ol' | null
  let listItems = [];

  function flushList() {
    if (currentList && listItems.length) {
      const tag = currentList;
      const items = listItems.map(li => `<li>${li}</li>`).join('\n');
      parts.push(`<${tag}>\n${items}\n</${tag}>`);
    }
    currentList = null;
    listItems = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    // Unordered list item
    if (trimmed.startsWith('- ')) {
      if (currentList !== 'ul') {
        flushList();
        currentList = 'ul';
      }
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Ordered list item (e.g. "1. Step text")
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (currentList !== 'ol') {
        flushList();
        currentList = 'ol';
      }
      listItems.push(olMatch[2]);
      continue;
    }

    // Not a list item — flush any open list
    flushList();

    // Header line (ends with ":")
    if (trimmed.endsWith(':')) {
      parts.push(`<h3>${trimmed.slice(0, -1)}</h3>`);
      continue;
    }

    // Regular paragraph
    parts.push(`<p>${trimmed}</p>`);
  }

  flushList();
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// 2. Load template and locale data
// ---------------------------------------------------------------------------

const templatePath = join(__dirname, 'template.html');
const localePath = join(__dirname, '..', 'src', 'i18n', 'locales', 'en.json');

console.log('Reading template...');
let html = readFileSync(templatePath, 'utf-8');

console.log('Reading en.json locale...');
const localeData = JSON.parse(readFileSync(localePath, 'utf-8'));
const t = localeData.translation || localeData;

// ---------------------------------------------------------------------------
// 3. Replace placeholders with parsed content
// ---------------------------------------------------------------------------

for (let i = 1; i <= 14; i++) {
  const key = `lessonContent${i}`;
  const raw = t[key];
  if (!raw) {
    console.warn(`Warning: ${key} not found in en.json`);
    continue;
  }
  const parsed = parseLessonContent(raw);
  html = html.replace(`{{lessonContent_${i}}}`, parsed);
}

console.log('All 14 lesson placeholders replaced.');

// ---------------------------------------------------------------------------
// 4. Generate PDF with Puppeteer
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

  // Load the HTML with styles resolved relative to ebook/ directory
  const fileUrl = `file:///${templatePath.replace(/\\/g, '/')}`;

  // Write the processed HTML to a temp file so CSS relative paths work
  const tempPath = join(__dirname, '_build_temp.html');
  writeFileSync(tempPath, html, 'utf-8');

  const tempUrl = `file:///${tempPath.replace(/\\/g, '/')}`;
  console.log('Loading HTML...');
  await page.goto(tempUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts to load
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
