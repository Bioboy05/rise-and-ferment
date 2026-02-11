const ALLOWED_TAGS = ["strong", "em", "b", "i", "u", "br"];

function escapeHtml(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizes user-facing HTML snippets from translations.
 * Keeps only a tiny allowlist of formatting tags and strips all attributes.
 */
export function sanitizeLimitedHtml(value, { convertNewlines = false } = {}) {
  const text = String(value ?? "");
  let safe = escapeHtml(text);

  if (convertNewlines) {
    safe = safe.replace(/\r?\n/g, "<br>");
  }

  const tagPattern = ALLOWED_TAGS.join("|");
  const openTagRegex = new RegExp(`&lt;(${tagPattern})&gt;`, "gi");
  const closeTagRegex = new RegExp(`&lt;\\/(${tagPattern})&gt;`, "gi");
  const selfClosingBrRegex = /&lt;br\s*\/&gt;/gi;

  safe = safe.replace(openTagRegex, "<$1>");
  safe = safe.replace(closeTagRegex, "</$1>");
  safe = safe.replace(selfClosingBrRegex, "<br>");

  return safe;
}

