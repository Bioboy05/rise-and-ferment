import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "i18n", "locales");

const BAD_SNIPPETS = [
  "Ãƒ",
  "Ã‚",
  "Ã¢â‚¬",
  "Ã°Å¸",
  "Ã¯Â¸",
  "â†",
  "âœ",
  "âš",
  "�\u001d",
  "��",
  "�0",
];

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

const DIRECT_REPLACEMENTS = new Map([
  ["â†", "←"],
  ["â†’", "→"],
  ["â†©", "↩"],
  ["âœ“", "✓"],
  ["âš¡", "⚡"],
  ["âœ¨", "✨"],
  ["�\u001d", "—"],
  ["��", "È"],
  ["�0", "É"],
]);

const CP1252_REVERSE_MAP = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function hasBadMarker(value) {
  return BAD_SNIPPETS.some((snippet) => value.includes(snippet));
}

function scoreText(value) {
  const markerCount = BAD_SNIPPETS.reduce((acc, marker) => {
    let count = 0;
    let idx = value.indexOf(marker);
    while (idx !== -1) {
      count += 1;
      idx = value.indexOf(marker, idx + marker.length);
    }
    return acc + count;
  }, 0);
  const replacementCount = (value.match(/�/g) || []).length;
  const controlCount = (value.match(CONTROL_CHARS) || []).length;
  return markerCount * 3 + replacementCount * 4 + controlCount * 6;
}

function encodeCp1252ToBytes(value) {
  const bytes = [];
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }
    const mapped = CP1252_REVERSE_MAP.get(code);
    if (mapped == null) return null;
    bytes.push(mapped);
  }
  return Uint8Array.from(bytes);
}

function decodeCp1252AsUtf8(value) {
  const bytes = encodeCp1252ToBytes(value);
  if (!bytes) return value;
  return Buffer.from(bytes).toString("utf8");
}

function applyDirectReplacements(value) {
  let next = value;
  for (const [bad, good] of DIRECT_REPLACEMENTS.entries()) {
    if (next.includes(bad)) {
      next = next.split(bad).join(good);
    }
  }
  return next.replace(CONTROL_CHARS, "");
}

function improveString(value) {
  if (!hasBadMarker(value)) return value;

  let current = value;
  let currentScore = scoreText(current);

  for (let i = 0; i < 3; i += 1) {
    const candidate = decodeCp1252AsUtf8(current);
    const candidateScore = scoreText(candidate);
    if (candidateScore >= currentScore) break;
    current = candidate;
    currentScore = candidateScore;
  }

  return applyDirectReplacements(current);
}

function fixDeep(value) {
  if (typeof value === "string") return improveString(value);
  if (Array.isArray(value)) return value.map((item) => fixDeep(item));
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = fixDeep(nested);
    }
    return out;
  }
  return value;
}

function processLocaleFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw);
  const fixed = fixDeep(parsed);
  fs.writeFileSync(filePath, `${JSON.stringify(fixed, null, 2)}\n`, "utf8");
}

for (const entry of fs.readdirSync(LOCALES_DIR)) {
  if (entry.endsWith(".json")) {
    processLocaleFile(path.join(LOCALES_DIR, entry));
  }
}

console.log("Mojibake cleanup complete for locale files.");
