import fs from "node:fs";
import path from "node:path";
import { sanitizeLimitedHtml } from "../src/utils/sanitizeHtml.js";
import { advanceStarterDay, calculateStreak, normalizeStarter } from "../src/utils/starterHelpers.js";
import { calculateBreadRecipe } from "../src/utils/calculations.js";

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "i18n", "locales");
const langs = ["en", "ro", "de", "fr", "es", "it"];
const suspiciousRegex = /Ãƒ|Ã‚|Ã¢â‚¬|Ã°Å¸|Ã¯Â¸|â†|âœ|âš|�\u001d|��|�0|�/;
const controlCharsRegex = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

const criticalUiKeys = [
  "tabHome",
  "tabRecipes",
  "tabPlanner",
  "tabHistory",
  "tabLearn",
  "welcome",
  "howToStart",
  "todayTask",
  "feedNow",
  "plannerTitle",
  "settingsTitle",
];

const personas = [
  {
    id: "newMom",
    keys: ["welcome", "howToStart", "todayTask", "feedNow", "notGrowing", "understood"],
  },
  {
    id: "powerBaker",
    keys: ["plannerTitle", "addToCalendar", "exportBtn", "importBtn", "scheduleNoTime", "settingsTitle"],
  },
];

function loadLocale(code) {
  const file = path.join(LOCALES_DIR, `${code}.json`);
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw).translation;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function flattenStrings(value, prefix = "") {
  if (typeof value === "string") return [{ key: prefix, value }];
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, nested]) => {
    const nestedPath = prefix ? `${prefix}.${key}` : key;
    return flattenStrings(nested, nestedPath);
  });
}

const localeData = Object.fromEntries(langs.map((lang) => [lang, loadLocale(lang)]));
const merged = Object.fromEntries(langs.map((lang) => [lang, { ...localeData.en, ...localeData[lang] }]));

for (const lang of langs) {
  for (const key of criticalUiKeys) {
    const value = localeData[lang][key];
    assert(typeof value === "string" && value.length > 0, `${lang}: missing critical UI key '${key}'`);
  }
}

for (const lang of langs) {
  const values = flattenStrings(merged[lang]);
  for (const { key, value } of values) {
    assert(!suspiciousRegex.test(value), `${lang}: suspicious encoding in '${key}'`);
    assert(!controlCharsRegex.test(value), `${lang}: control characters in '${key}'`);
  }
}

for (const persona of personas) {
  for (const lang of langs) {
    for (const key of persona.keys) {
      const value = merged[lang][key];
      assert(typeof value === "string" && value.length > 0, `${lang}/${persona.id}: missing value for '${key}'`);
      assert(!suspiciousRegex.test(value), `${lang}/${persona.id}: suspicious encoding in '${key}'`);
    }
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

let beginnerStarter = normalizeStarter({
  id: "mom",
  name: "Maya",
  isNewStarter: true,
  currentDay: 13,
  todayCompleted: false,
  completedDays: [],
});
beginnerStarter = advanceStarterDay(beginnerStarter, "Mon Jan 01 2024");
assert(beginnerStarter.currentDay === 14, "advanceStarterDay should progress into the final guided day");
assert(beginnerStarter.isNewStarter === true, "advanceStarterDay should not graduate before day 14 is completed");
beginnerStarter = { ...beginnerStarter, todayCompleted: false };
beginnerStarter = advanceStarterDay(beginnerStarter, "Tue Jan 02 2024");
assert(beginnerStarter.currentDay === 14, "advanceStarterDay should keep day capped at 14");
assert(beginnerStarter.isNewStarter === false, "advanceStarterDay should graduate starter after final guided day");

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
