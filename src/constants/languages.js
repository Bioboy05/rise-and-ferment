export const SUPPORTED_LANGUAGES = ["ro", "en", "de", "fr", "es", "it"];

export const LANGUAGES = [
  { code: "ro", flag: "\u{1F1F7}\u{1F1F4}" },
  { code: "en", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "de", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "fr", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "es", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "it", flag: "\u{1F1EE}\u{1F1F9}" },
];

export function isSupportedLanguage(code) {
  return typeof code === "string" && SUPPORTED_LANGUAGES.includes(code);
}

