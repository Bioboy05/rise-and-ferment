/**
 * Starter-related utility functions.
 */

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
  return {
    id: s.id || "starter_1",
    name: s.name || "Pufi",
    flourType: s.flourType || "white",
    hydration: s.hydration || "100",
    createdAt: s.createdAt || null,
    lastFed: s.lastFed || null,
    isNewStarter: s.isNewStarter || false,
    currentDay: s.currentDay || 1,
    previewingDay: s.previewingDay || null,
    todayCompleted: s.todayCompleted || false,
    lastCompletedDate: s.lastCompletedDate || null,
    history: Array.isArray(s.history) ? s.history : [],
    streak: s.streak || 0,
    feedAmount: s.feedAmount || 50,
    useBran: s.useBran || false,
    personalNotes: s.personalNotes || "",
    completedDays: Array.isArray(s.completedDays) ? s.completedDays : [],
  };
}
