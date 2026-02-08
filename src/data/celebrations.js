/**
 * Celebration milestones triggered at key achievements.
 *
 * Each milestone has:
 * - id: unique identifier (used as localStorage key for one-time display)
 * - emoji: displayed in the celebration overlay
 * - titleKey / descKey: i18n keys for the celebration text
 * - condition: function that checks if milestone is reached
 */

const celebrations = [
  {
    id: "day7",
    emoji: "🎉",
    titleKey: "congratsTitle",
    descKey: "congratsDesc",
    condition: (starter) => starter.currentDay >= 7,
  },
  {
    id: "firstBread",
    emoji: "🍞",
    titleKey: "celebrateFirstBreadTitle",
    descKey: "celebrateFirstBreadDesc",
    condition: (starter) =>
      starter.history.length >= 7 && starter.currentDay >= 7,
  },
  {
    id: "streak7",
    emoji: "💕",
    titleKey: "celebrateStreak7Title",
    descKey: "celebrateStreak7Desc",
    condition: (_starter, streak) => streak >= 7,
  },
  {
    id: "streak30",
    emoji: "👑",
    titleKey: "celebrateStreak30Title",
    descKey: "celebrateStreak30Desc",
    condition: (_starter, streak) => streak >= 30,
  },
];

export default celebrations;

/**
 * Check which milestones are newly reached (not yet celebrated).
 *
 * @param {Object} starter - Active starter object
 * @param {number} streak - Current streak
 * @param {Set<string>} celebrated - Set of already-celebrated milestone IDs
 * @returns {Object|null} First uncelebrated milestone, or null
 */
export function checkMilestones(starter, streak, celebrated) {
  for (const milestone of celebrations) {
    if (celebrated.has(milestone.id)) continue;
    if (milestone.condition(starter, streak)) {
      return milestone;
    }
  }
  return null;
}
