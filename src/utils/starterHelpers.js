/**
 * Starter-related utility functions.
 */

const MAX_NAME_LENGTH = 50;
const MAX_NOTE_LENGTH = 500;
const MAX_HISTORY_ENTRIES = 5000;
const VALID_HYDRATION = new Set(["100", "80", "60"]);
const STARTER_PROGRAM_DAYS = 14;

function sanitizeString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_ENTRIES)
    .map((entry) => ({
      time: typeof entry?.time === "number" ? entry.time : Date.now(),
      amount: typeof entry?.amount === "number" ? Math.max(0, Math.min(500, entry.amount)) : 50,
      withBran: entry?.withBran === true,
      temp: typeof entry?.temp === "number" && entry.temp >= 0 && entry.temp <= 60 ? entry.temp : null,
      note: entry?.note ? sanitizeString(String(entry.note), MAX_NOTE_LENGTH) : null,
      flourType: sanitizeString(String(entry?.flourType || "white"), 30) || "white",
    }))
    .filter((entry) => Number.isFinite(entry.time));
}

/**
 * Calculate the current feeding streak from history entries.
 * Streak = number of consecutive calendar days with at least one feeding,
 * counting backwards from today (or most recent fed day).
 *
 * @param {Array<{time: number}>} history - Array of feeding entries with `time` (ms)
 * @returns {number} Consecutive days streak
 */
export function calculateStreak(history) {
  if (!Array.isArray(history) || history.length === 0) return 0;

  // Collect unique calendar day strings from history
  const daySet = new Set(
    history.map((entry) => {
      if (!entry || typeof entry.time !== "number") return null;
      return new Date(entry.time).toDateString();
    })
  );
  daySet.delete(null);

  if (daySet.size === 0) return 0;

  // Walk backwards from today, counting consecutive days present in set
  const now = new Date();
  let streak = 0;
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // If today isn't in the set, start from yesterday
  if (!daySet.has(day.toDateString())) {
    day.setDate(day.getDate() - 1);
  }

  while (daySet.has(day.toDateString())) {
    streak++;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}

/**
 * Determine the current status of a starter based on feeding history.
 * Returns an object with status key and translated label/subtitle.
 *
 * @param {Object} starter - The starter object
 * @param {Function} t - i18next translation function
 * @returns {{ key: string, label: string, subtitle: string }}
 */
export function getStarterStatus(starter, t) {
  if (!starter.lastFed) {
    return {
      key: "welcome",
      label: t("statusWelcome"),
      subtitle: t("statusWelcomeSub"),
    };
  }

  const hoursSince = (Date.now() - starter.lastFed) / (1000 * 60 * 60);

  // At peak: 4-6 hours after feeding
  if (hoursSince >= 4 && hoursSince <= 6) {
    return {
      key: "pmc",
      label: t("statusPMC"),
      subtitle: t("statusPMCSub"),
    };
  }

  // Just past peak: 6-8 hours
  if (hoursSince > 6 && hoursSince <= 8) {
    return {
      key: "postPeak",
      label: t("statusPostPeak"),
      subtitle: t("statusPostPeakSub"),
    };
  }

  // Still rising: 0-4 hours
  if (hoursSince < 4) {
    const remaining = Math.ceil(4 - hoursSince);
    return {
      key: "growing",
      label: t("statusGrowing"),
      subtitle: t("statusGrowingSub", { h: remaining }),
    };
  }

  // Hungry: more than 8 hours
  return {
    key: "hungry",
    label: t("statusHungry"),
    subtitle: t("statusHungrySub"),
  };
}

/**
 * Normalize a starter object to ensure all expected fields exist.
 * Useful when loading potentially incomplete data from localStorage.
 *
 * @param {Object} s - Raw starter data
 * @returns {Object} Starter with all fields guaranteed
 */
export function normalizeStarter(s) {
  const source = s && typeof s === "object" ? s : {};
  const normalizedHistory = sanitizeHistory(source.history);

  const rawCurrentDay = Number(source.currentDay);
  const currentDay = Number.isFinite(rawCurrentDay)
    ? Math.max(1, Math.min(14, Math.round(rawCurrentDay)))
    : 1;

  const rawPreviewDay = Number(source.previewingDay);
  const previewingDay =
    Number.isFinite(rawPreviewDay) && rawPreviewDay >= 1 && rawPreviewDay <= 14
      ? Math.round(rawPreviewDay)
      : null;

  const hydration = VALID_HYDRATION.has(String(source.hydration)) ? String(source.hydration) : "100";

  return {
    id: sanitizeString(String(source.id || "starter_1"), 100) || "starter_1",
    name: sanitizeString(String(source.name || "Pufi"), MAX_NAME_LENGTH) || "Pufi",
    flourType: sanitizeString(String(source.flourType || "white"), 30) || "white",
    hydration,
    createdAt: Number.isFinite(source.createdAt) ? source.createdAt : null,
    lastFed: Number.isFinite(source.lastFed) ? source.lastFed : null,
    isNewStarter: Boolean(source.isNewStarter),
    currentDay,
    previewingDay,
    todayCompleted: Boolean(source.todayCompleted),
    lastCompletedDate: typeof source.lastCompletedDate === "string" ? source.lastCompletedDate : null,
    history: normalizedHistory,
    streak: Number.isFinite(source.streak) ? Math.max(0, Math.round(source.streak)) : 0,
    feedAmount: Number.isFinite(source.feedAmount) ? Math.max(25, Math.min(200, Math.round(source.feedAmount))) : 50,
    useBran: Boolean(source.useBran),
    personalNotes: sanitizeString(String(source.personalNotes || ""), MAX_NOTE_LENGTH),
    completedDays: Array.isArray(source.completedDays)
      ? source.completedDays.filter((value) => typeof value === "string").slice(-60)
      : [],
  };
}

/**
 * Progress a starter through one guided day completion.
 * Used by state stores and tests so day progression rules stay consistent.
 *
 * @param {Object} starter - Current starter state
 * @param {string} today - Calendar day label
 * @returns {Object} Updated starter state
 */
export function advanceStarterDay(starter, today = new Date().toDateString()) {
  if (!starter || typeof starter !== "object") return starter;
  if (starter.todayCompleted) return starter;

  const currentDay = Number.isFinite(Number(starter.currentDay))
    ? Math.max(1, Math.round(Number(starter.currentDay)))
    : 1;
  const completedDays = Array.isArray(starter.completedDays) ? starter.completedDays : [];
  const reachedProgramEnd = currentDay >= STARTER_PROGRAM_DAYS;

  return {
    ...starter,
    todayCompleted: true,
    lastCompletedDate: today,
    currentDay: Math.min(STARTER_PROGRAM_DAYS, currentDay + 1),
    completedDays: completedDays.includes(today) ? completedDays : [...completedDays, today],
    previewingDay: null,
    // Graduate to regular flow after the final guided day is completed.
    isNewStarter: reachedProgramEnd ? false : Boolean(starter.isNewStarter),
  };
}
