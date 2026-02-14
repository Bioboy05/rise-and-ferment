/**
 * Starter-related utility functions.
 */

import {
  MAX_NAME_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_HISTORY_ENTRIES,
  STARTER_PROGRAM_DAYS,
  sanitizeString,
} from "../constants/validation";

import {
  MILESTONE_IDS,
  FIRST_MILESTONE_ID,
  FINAL_MILESTONE_ID,
  GUIDED_MODES,
  getNextMilestone,
  migrateFromDay,
} from "../data/milestones";

const VALID_HYDRATION = new Set(["100", "80", "60"]);

const MAX_MILESTONE_HISTORY = 60;

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

function sanitizeMilestoneHistory(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        MILESTONE_IDS.has(entry.id) &&
        Number.isFinite(entry.reachedAt)
    )
    .slice(-MAX_MILESTONE_HISTORY)
    .map((entry) => ({
      id: entry.id,
      reachedAt: entry.reachedAt,
      evidence: typeof entry.evidence === "string" ? entry.evidence.slice(0, 200) : null,
    }));
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
 * Normalize a starter object to ensure all expected fields exist.
 * Handles both new milestone-based data and legacy day-based data.
 * When legacy data is detected (has currentDay but no currentMilestoneId),
 * it is automatically migrated to the milestone model.
 *
 * @param {Object} s - Raw starter data
 * @returns {Object} Starter with all fields guaranteed
 */
export function normalizeStarter(s) {
  const source = s && typeof s === "object" ? s : {};
  const normalizedHistory = sanitizeHistory(source.history);

  const hydration = VALID_HYDRATION.has(String(source.hydration)) ? String(source.hydration) : "100";

  // --- Milestone fields (new) ---
  let currentMilestoneId = MILESTONE_IDS.has(source.currentMilestoneId)
    ? source.currentMilestoneId
    : null;

  let guidedMode = GUIDED_MODES.includes(source.guidedMode)
    ? source.guidedMode
    : null;

  let milestoneHistory = sanitizeMilestoneHistory(source.milestoneHistory);

  // --- Legacy fields (kept for backward compat + display) ---
  const rawCurrentDay = Number(source.currentDay);
  const currentDay = Number.isFinite(rawCurrentDay)
    ? Math.max(1, Math.min(14, Math.round(rawCurrentDay)))
    : 1;

  const rawPreviewDay = Number(source.previewingDay);
  const previewingDay =
    Number.isFinite(rawPreviewDay) && rawPreviewDay >= 1 && rawPreviewDay <= 14
      ? Math.round(rawPreviewDay)
      : null;

  const isNewStarter = Boolean(source.isNewStarter);

  // --- Auto-migrate legacy data to milestone model ---
  if (!currentMilestoneId) {
    const migration = migrateFromDay(currentDay, isNewStarter);
    currentMilestoneId = migration.milestoneId;
    guidedMode = guidedMode || migration.guidedMode;
  }

  if (!guidedMode) {
    guidedMode = isNewStarter ? "new" : "self-paced";
  }

  const previewingMilestoneId = MILESTONE_IDS.has(source.previewingMilestoneId)
    ? source.previewingMilestoneId
    : null;

  return {
    id: sanitizeString(String(source.id || "starter_1"), 100) || "starter_1",
    name: sanitizeString(String(source.name || "Pufi"), MAX_NAME_LENGTH) || "Pufi",
    flourType: sanitizeString(String(source.flourType || "white"), 30) || "white",
    hydration,
    createdAt: Number.isFinite(source.createdAt) ? source.createdAt : null,
    lastFed: Number.isFinite(source.lastFed) ? source.lastFed : null,
    history: normalizedHistory,
    streak: Number.isFinite(source.streak) ? Math.max(0, Math.round(source.streak)) : 0,
    feedAmount: Number.isFinite(source.feedAmount) ? Math.max(25, Math.min(200, Math.round(source.feedAmount))) : 50,
    useBran: Boolean(source.useBran),
    personalNotes: sanitizeString(String(source.personalNotes || ""), MAX_NOTE_LENGTH),

    // Milestone model (primary)
    currentMilestoneId,
    milestoneHistory,
    guidedMode,
    previewingMilestoneId,
    milestoneCompleted: Boolean(source.milestoneCompleted),
    lastMilestoneCompletedAt: Number.isFinite(source.lastMilestoneCompletedAt)
      ? source.lastMilestoneCompletedAt
      : null,

    // Legacy fields (kept for display/migration compatibility)
    isNewStarter: guidedMode !== "self-paced",
    currentDay,
    previewingDay,
    todayCompleted: Boolean(source.todayCompleted),
    lastCompletedDate: typeof source.lastCompletedDate === "string" ? source.lastCompletedDate : null,
    completedDays: Array.isArray(source.completedDays)
      ? source.completedDays.filter((value) => typeof value === "string").slice(-60)
      : [],
  };
}

/**
 * Advance a starter to the next milestone.
 * If the final milestone ("bake-ready") is completed, transitions to self-paced mode.
 *
 * @param {Object} starter - Current starter state
 * @param {string} milestoneId - The milestone being completed
 * @param {string} [evidence] - Optional evidence string (e.g., "float test passed")
 * @returns {Object} Updated starter state
 */
export function advanceMilestone(starter, milestoneId, evidence = null) {
  if (!starter || typeof starter !== "object") return starter;
  if (!MILESTONE_IDS.has(milestoneId)) return starter;

  const now = Date.now();
  const milestoneHistory = Array.isArray(starter.milestoneHistory)
    ? [...starter.milestoneHistory]
    : [];

  // Don't add duplicate entries for the same milestone
  if (!milestoneHistory.some((entry) => entry.id === milestoneId)) {
    milestoneHistory.push({
      id: milestoneId,
      reachedAt: now,
      evidence: evidence ? String(evidence).slice(0, 200) : null,
    });
  }

  const next = getNextMilestone(milestoneId);
  const isFinalMilestone = milestoneId === FINAL_MILESTONE_ID;

  return {
    ...starter,
    currentMilestoneId: next ? next.id : milestoneId,
    milestoneHistory: milestoneHistory.slice(-MAX_MILESTONE_HISTORY),
    milestoneCompleted: true,
    lastMilestoneCompletedAt: now,
    previewingMilestoneId: null,
    // Graduate to self-paced when the final milestone is completed
    guidedMode: isFinalMilestone ? "self-paced" : starter.guidedMode,
    isNewStarter: isFinalMilestone ? false : starter.guidedMode !== "self-paced",
  };
}

/**
 * Legacy: Progress a starter through one guided day completion.
 * Kept for backward compatibility during migration period.
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
