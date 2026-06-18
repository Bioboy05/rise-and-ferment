/**
 * Date and time utility functions for Rise & Ferment.
 */

/**
 * Calculate time elapsed since a timestamp.
 * Returns a compact string like "2d 5h", "3h 12m", or "45m".
 * @param {number} timestamp - Unix timestamp in ms
 * @param {number} now - Current time in ms (allows testability)
 * @returns {string|null} Formatted time string, or null if no timestamp
 */
export function getTimeSince(timestamp, now) {
  if (!timestamp) return null;
  const diff = now - timestamp;
  if (diff < 0) return "0m";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Format a date as a localized relative time string using i18n keys.
 * @param {number|Date} date - The date to format
 * @param {Function} t - i18next translation function
 * @returns {string} Human-readable relative time
 */
export function formatTimeAgo(date, t) {
  const now = Date.now();
  const ts = date instanceof Date ? date.getTime() : date;
  const diffMs = now - ts;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return t("justNow");
  if (diffHours < 1) return t("minutesAgo", { m: diffMins });
  if (diffDays < 1) return t("hoursAgo", { h: diffHours });
  if (diffDays === 1) return t("scheduleYesterday");
  return t("scheduleDaysAgo", { n: diffDays });
}

/**
 * Format a Date as an ICS-compatible datetime string (UTC).
 * Format: YYYYMMDDTHHmmSSZ
 * @param {Date} date
 * @returns {string}
 */
export function formatICSDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}
