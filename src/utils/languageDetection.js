import { isSupportedLanguage } from "../constants/languages";

const SETTINGS_STORAGE_KEY = "riseFermentSettings";

function normalizeLanguageCode(code) {
  if (typeof code !== "string") return null;

  const cleaned = code.trim().toLowerCase().replace(/_/g, "-");
  if (isSupportedLanguage(cleaned)) return cleaned;

  const base = cleaned.split("-")[0];
  return isSupportedLanguage(base) ? base : null;
}

function readUrlLanguage() {
  if (typeof window === "undefined" || !window.location) return null;
  try {
    const param = new URLSearchParams(window.location.search).get("lang");
    return normalizeLanguageCode(param);
  } catch {
    return null;
  }
}

function readPersistedLanguage() {
  if (typeof localStorage === "undefined") return null;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const persisted = parsed?.state?.language ?? parsed?.language;
    return normalizeLanguageCode(persisted);
  } catch {
    return null;
  }
}

function detectBrowserLanguage() {
  if (typeof navigator === "undefined") return null;

  const candidates = [];
  if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
  if (typeof navigator.language === "string") candidates.push(navigator.language);

  if (typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (typeof locale === "string") candidates.push(locale);
  }

  for (const candidate of candidates) {
    const normalized = normalizeLanguageCode(candidate);
    if (normalized) return normalized;
  }

  return null;
}

export function resolveInitialLanguage(fallback = "en") {
  const normalizedFallback = normalizeLanguageCode(fallback) || "en";
  return (
    readUrlLanguage() || readPersistedLanguage() || detectBrowserLanguage() || normalizedFallback
  );
}

