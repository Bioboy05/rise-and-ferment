/**
 * Data export/import and calendar (ICS) generation utilities.
 */

import { formatICSDate } from "./dateHelpers";

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
      theme: settingsState.theme,
      language: settingsState.language,
      beginnerMode: settingsState.beginnerMode,
      soundEnabled: settingsState.soundEnabled,
      tempUnit: settingsState.tempUnit,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const name = starterState.starters[0]?.name || "starter";

  const a = document.createElement("a");
  a.href = url;
  a.download = `maiaua-mea-backup-${name}-${date}.json`;
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

  // Validate each starter has required fields
  for (const s of data.starters) {
    if (!s.id || !s.name) {
      throw new Error("Invalid starter data");
    }
  }

  return data;
}

/**
 * Generate an ICS calendar file for a scheduled bake.
 *
 * @param {string} starterName - Name of the starter
 * @param {Date} bakeDate - When the bread should be ready
 * @returns {void} Downloads the .ics file
 */
export function generateICS(starterName, bakeDate) {
  const sanitizedName = String(starterName || "Starter").slice(0, 50);
  const start = new Date(bakeDate);
  const feedTime = new Date(start.getTime() - 8 * 60 * 60 * 1000); // 8h before

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RiseAndFerment//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatICSDate(feedTime)}`,
    `DTEND:${formatICSDate(start)}`,
    `SUMMARY:Feed ${sanitizedName} for baking`,
    `DESCRIPTION:Feed your starter so it reaches peak in time for baking.`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(new Date(start.getTime() + 60 * 60 * 1000))}`,
    `SUMMARY:Bread ready! (${sanitizedName})`,
    `DESCRIPTION:Your bread should be ready. Don't cut it for 1 hour!`,
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
