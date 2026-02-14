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
  // Milestone-based celebrations
  {
    id: "milestone-seed",
    emoji: "🌱",
    titleKey: "celebrateSeedTitle",
    descKey: "celebrateSeedDesc",
    condition: (starter) =>
      starter.milestoneHistory?.some((m) => m.id === "seed-activation"),
  },
  {
    id: "milestone-expansion",
    emoji: "📈",
    titleKey: "celebrateExpansionTitle",
    descKey: "celebrateExpansionDesc",
    condition: (starter) =>
      starter.milestoneHistory?.some((m) => m.id === "visible-expansion"),
  },
  {
    id: "milestone-strength",
    emoji: "💪",
    titleKey: "celebrateStrengthTitle",
    descKey: "celebrateStrengthDesc",
    condition: (starter) =>
      starter.milestoneHistory?.some((m) => m.id === "strengthening"),
  },
  {
    id: "milestone-bake-ready",
    emoji: "🍞",
    titleKey: "celebrateBakeReadyTitle",
    descKey: "celebrateBakeReadyDesc",
    condition: (starter) =>
      starter.milestoneHistory?.some((m) => m.id === "bake-ready"),
  },
  // Streak-based celebrations (unchanged)
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
