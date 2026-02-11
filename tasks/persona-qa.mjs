import fs from "node:fs";
import path from "node:path";
import { sanitizeLimitedHtml } from "../src/utils/sanitizeHtml.js";
import { normalizeStarter, calculateStreak } from "../src/utils/starterHelpers.js";
import { calculateBreadRecipe } from "../src/utils/calculations.js";

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "i18n", "locales");
const langs = ["en", "ro", "de", "fr", "es", "it"];
const suspiciousRegex = /Ã|Â|â€™|â€œ|â€|â€“|â€”|â€¦|ðŸ|ï¸/;

function loadLocale(code) {
  const file = path.join(LOCALES_DIR, `${code}.json`);
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw).translation;
}

const localeData = Object.fromEntries(langs.map((lang) => [lang, loadLocale(lang)]));
const merged = Object.fromEntries(
  langs.map((lang) => [lang, { ...localeData.en, ...localeData[lang] }]),
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const lang of langs) {
  const keys = Object.keys(merged[lang]);
  assert(keys.length === Object.keys(localeData.en).length, `${lang}: merged key count mismatch`);
}

const momKeys = ["welcome", "howToStart", "todayTask", "feedNow", "notGrowing", "understood"];
for (const lang of langs) {
  for (const key of momKeys) {
    const value = merged[lang][key];
    assert(typeof value === "string" && value.length > 0, `${lang}: missing value for ${key}`);
    assert(!suspiciousRegex.test(value), `${lang}: suspicious encoding in ${key}`);
  }
}

const powerKeys = ["plannerTitle", "addToCalendar", "exportBtn", "importBtn", "scheduleNoTime", "settingsTitle"];
for (const lang of langs) {
  for (const key of powerKeys) {
    const value = merged[lang][key];
    assert(typeof value === "string" && value.length > 0, `${lang}: missing value for ${key}`);
    assert(!suspiciousRegex.test(value), `${lang}: suspicious encoding in ${key}`);
  }
}

const cleaned = sanitizeLimitedHtml('<img src=x onerror=alert(1)><strong>Safe</strong>\n<script>alert(1)</script>', {
  convertNewlines: true,
});
assert(!cleaned.includes("<script"), "sanitizeLimitedHtml should remove script tags");
assert(!cleaned.includes("<img"), "sanitizeLimitedHtml should neutralize non-allowlisted tags");
assert(cleaned.includes("<strong>Safe</strong>"), "sanitizeLimitedHtml should preserve strong tag");

const normalized = normalizeStarter({
  id: "x".repeat(500),
  name: " ".repeat(4),
  hydration: "999",
  currentDay: 999,
  previewingDay: -2,
  history: [{ time: "bad", amount: 99999, temp: 999, note: "n".repeat(1000) }],
});
assert(normalized.id.length <= 100, "normalizeStarter should clamp id");
assert(normalized.name === "Pufi", "normalizeStarter should apply default name");
assert(normalized.hydration === "100", "normalizeStarter should enforce hydration allowlist");
assert(normalized.currentDay === 14, "normalizeStarter should cap currentDay");
assert(normalized.previewingDay === null, "normalizeStarter should reject invalid preview day");
assert(normalized.history.length === 1, "normalizeStarter should keep valid history structure");
assert(normalized.history[0].amount === 500, "normalizeStarter should clamp feeding amount");
assert(normalized.history[0].temp === null, "normalizeStarter should clamp invalid temp");

const streak = calculateStreak([
  { time: Date.now() - 1000 * 60 * 60 * 24 * 2 },
  { time: Date.now() - 1000 * 60 * 60 * 24 },
  { time: Date.now() },
]);
assert(streak >= 3, "calculateStreak should count consecutive days");

const recipeMin = calculateBreadRecipe(-4);
const recipeMax = calculateBreadRecipe(99);
assert(recipeMin.starter === 100, "calculateBreadRecipe should clamp lower bound");
assert(recipeMax.starter === 1000, "calculateBreadRecipe should clamp upper bound");

console.log("Persona QA checks passed.");
