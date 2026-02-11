export const SUPPORTED_LANGUAGES = ["ro", "en", "de", "fr", "es", "it"];

export function isSupportedLanguage(code) {
  return typeof code === "string" && SUPPORTED_LANGUAGES.includes(code);
}

