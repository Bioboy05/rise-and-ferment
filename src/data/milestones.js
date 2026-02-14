/**
 * Milestone definitions for sourdough starter guided mode.
 *
 * Replaces the old fixed 14-day pipeline with observable, behavior-based
 * milestones aligned with guidance from The Perfect Loaf, King Arthur Baking,
 * The Clever Carrot, and Pantry Mama.
 *
 * Each milestone has:
 * - id: unique string identifier (used in store and i18n)
 * - order: numeric sort order
 * - emoji: displayed in timeline UI
 * - titleKey / descKey / taskKey / tipKey: i18n keys
 * - criteria: metadata describing what needs to happen (for reference/display)
 * - typicalDays: human-readable typical timeline (not enforced)
 */

export const MILESTONES = [
    {
        id: "seed-activation",
        order: 1,
        emoji: "🌱",
        titleKey: "milestoneSeedTitle",
        descKey: "milestoneSeedDesc",
        taskKey: "milestoneSeedTask",
        tipKey: "milestoneSeedTip",
        criteria: { minFeedings: 2 },
        typicalDays: "1–3",
    },
    {
        id: "visible-expansion",
        order: 2,
        emoji: "📈",
        titleKey: "milestoneExpansionTitle",
        descKey: "milestoneExpansionDesc",
        taskKey: "milestoneExpansionTask",
        tipKey: "milestoneExpansionTip",
        criteria: { minFeedings: 4, consecutiveRises: 2 },
        typicalDays: "3–6",
    },
    {
        id: "strengthening",
        order: 3,
        emoji: "💪",
        titleKey: "milestoneStrengthTitle",
        descKey: "milestoneStrengthDesc",
        taskKey: "milestoneStrengthTask",
        tipKey: "milestoneStrengthTip",
        criteria: { minFeedings: 6, consecutiveDoubles: 2 },
        typicalDays: "5–10",
    },
    {
        id: "bake-ready",
        order: 4,
        emoji: "🍞",
        titleKey: "milestoneBakeReadyTitle",
        descKey: "milestoneBakeReadyDesc",
        taskKey: "milestoneBakeReadyTask",
        tipKey: "milestoneBakeReadyTip",
        criteria: { floatTestPassed: true },
        typicalDays: "7–14+",
    },
];

/** Set of valid milestone IDs for quick validation. */
export const MILESTONE_IDS = new Set(MILESTONES.map((m) => m.id));

/** The first milestone for new starters. */
export const FIRST_MILESTONE_ID = MILESTONES[0].id;

/** The final milestone — reaching this transitions to self-paced mode. */
export const FINAL_MILESTONE_ID = MILESTONES[MILESTONES.length - 1].id;

/** Valid guided mode values. */
export const GUIDED_MODES = ["new", "reactivation", "self-paced"];

/**
 * Get a milestone definition by its ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getMilestoneById(id) {
    return MILESTONES.find((m) => m.id === id);
}

/**
 * Get the next milestone after the given one, or null if at the end.
 * @param {string} currentId
 * @returns {Object|null}
 */
export function getNextMilestone(currentId) {
    const current = MILESTONES.find((m) => m.id === currentId);
    if (!current) return MILESTONES[0] || null;
    return MILESTONES.find((m) => m.order === current.order + 1) || null;
}

/**
 * Map a legacy currentDay value to a milestone ID.
 * Used for migrating old data formats.
 *
 * @param {number} day - Legacy day number (1-14)
 * @param {boolean} isNewStarter - Legacy isNewStarter flag
 * @returns {{ milestoneId: string, guidedMode: string }}
 */
export function migrateFromDay(day, isNewStarter) {
    if (!isNewStarter) {
        return { milestoneId: "bake-ready", guidedMode: "self-paced" };
    }
    if (day <= 2) {
        return { milestoneId: "seed-activation", guidedMode: "new" };
    }
    if (day <= 5) {
        return { milestoneId: "visible-expansion", guidedMode: "new" };
    }
    if (day <= 7) {
        return { milestoneId: "strengthening", guidedMode: "new" };
    }
    // Day 8+ in old system = close to ready
    return { milestoneId: "bake-ready", guidedMode: "new" };
}
