/**
 * Data export/import and calendar (ICS) generation utilities.
 */

import { formatICSDate } from "./dateHelpers";

const CURRENT_BACKUP_VERSION = "2.0";

/**
 * Export app state to a downloadable JSON file.
 * @param {{ starters: Array, activeStarterId: string }} starterState
 * @param {Object} settingsState
 */
export function exportData(starterState, settingsState) {
  const data = {
    version: "2.0",
    exportedAt: new Date().toISOString(),
    starters: starterState.starters,
    activeStarterId: starterState.activeStarterId,
    settings: {
      onboardingComplete: settingsState.onboardingComplete,
      theme: settingsState.theme,
      language: settingsState.language,
      beginnerMode: settingsState.beginnerMode,
      soundEnabled: settingsState.soundEnabled,
      tempUnit: settingsState.tempUnit,
      weightUnit: settingsState.weightUnit,
      sessions: settingsState.sessions,
      notifications: settingsState.notifications,
      scheduledBakes: settingsState.scheduledBakes,
      calcLoaves: settingsState.calcLoaves,
      bakeNotes: settingsState.bakeNotes,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const active = starterState.starters.find((s) => s.id === starterState.activeStarterId);
  const name = active?.name || starterState.starters[0]?.name || "starter";

  const a = document.createElement("a");
  a.href = url;
  a.download = `rise-ferment-backup-${name}-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Validate and parse an imported JSON backup file.
 * Returns parsed data or throws with a descriptive message.
 *
 * @param {File} file - The uploaded file
 * @returns {Promise<Object>} Parsed and validated backup data
 */
export async function importData(file) {
  if (!file || !file.name.endsWith(".json")) {
    throw new Error("Invalid file type");
  }

  // Limit file size to 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large");
  }

  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON");
  }

  // Validate structure
  if (!data || typeof data !== "object") {
    throw new Error("Invalid backup format");
  }

  if (!Array.isArray(data.starters) || data.starters.length === 0) {
    throw new Error("No starters found in backup");
  }

  // Version check (non-blocking -- normalizeStarter handles missing fields)
  if (data.version && data.version !== CURRENT_BACKUP_VERSION) {
    console.warn(`Backup version ${data.version} differs from current ${CURRENT_BACKUP_VERSION}`);
  }

  // Validate each starter has required fields
  for (const s of data.starters) {
    if (!s.id || !s.name) {
      throw new Error("Invalid starter data");
    }
  }

  return data;
}

/** Escape a value for an ICS text field (RFC 5545 §3.3.11). */
function escapeICS(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Generate a unique iCalendar UID. */
function makeUID() {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${id}@riseandferment.com`;
}

/**
 * Generate an ICS calendar file for a scheduled bake.
 *
 * @param {string} starterName - Name of the starter
 * @param {Date} bakeDate - When the bread should be ready
 * @param {Object} [labels] - Localized event text (falls back to English)
 * @returns {void} Downloads the .ics file
 */
export function generateICS(starterName, bakeDate, labels = {}) {
  const sanitizedName = String(starterName || "Starter").slice(0, 50);
  const start = new Date(bakeDate);
  const feedTime = new Date(start.getTime() - 8 * 60 * 60 * 1000); // 8h before
  const stamp = formatICSDate(new Date());

  const feedSummary = labels.feedSummary || `Feed ${sanitizedName} for baking`;
  const feedDescription =
    labels.feedDescription || "Feed your starter so it reaches peak in time for baking.";
  const readySummary = labels.readySummary || `Bread ready! (${sanitizedName})`;
  const readyDescription =
    labels.readyDescription || "Your bread should be ready. Don't cut it for 1 hour!";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RiseAndFerment//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${makeUID()}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatICSDate(feedTime)}`,
    `DTEND:${formatICSDate(start)}`,
    `SUMMARY:${escapeICS(feedSummary)}`,
    `DESCRIPTION:${escapeICS(feedDescription)}`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:${makeUID()}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(new Date(start.getTime() + 60 * 60 * 1000))}`,
    `SUMMARY:${escapeICS(readySummary)}`,
    `DESCRIPTION:${escapeICS(readyDescription)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `bake-${sanitizedName}-${start.toISOString().slice(0, 10)}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
