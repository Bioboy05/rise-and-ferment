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
 * - iconName: SVG icon name from Icon.jsx
 * - titleKey / descKey / taskKey / tipKey: i18n keys
 * - criteria: metadata describing what needs to happen (for reference/display)
 * - typicalDays: human-readable typical timeline (not enforced)
 */

export const MILESTONES = [
    {
        id: "seed-activation",
        order: 1,
        iconName: "seedling",
        titleKey: "milestoneSeedTitle",
        descKey: "milestoneSeedDesc",
        taskKey: "milestoneSeedTask",
        tipKey: "milestoneSeedTip",
        criteria: { minFeedings: 2 },
        typicalDays: "1–3",
        microSteps: [
            { id: "seed-1", titleKey: "dayGuideTitle1", contentKey: "dayGuideContent1", icon: "wheat", action: "feed" },
            { id: "seed-2", titleKey: "dayGuideTitle2", contentKey: "dayGuideContent2", icon: "clock", action: "observe" },
            { id: "seed-3", titleKey: "dayGuideTitle3", contentKey: "dayGuideContent3", icon: "droplet", action: "feed" },
        ],
    },
    {
        id: "visible-expansion",
        order: 2,
        iconName: "trending-up",
        titleKey: "milestoneExpansionTitle",
        descKey: "milestoneExpansionDesc",
        taskKey: "milestoneExpansionTask",
        tipKey: "milestoneExpansionTip",
        criteria: { minFeedings: 4, consecutiveRises: 2 },
        typicalDays: "3–6",
        microSteps: [
            { id: "expand-1", titleKey: "dayGuideTitle4", contentKey: "dayGuideContent4", icon: "thermometer", action: "feed" },
            { id: "expand-2", titleKey: "dayGuideTitle5", contentKey: "dayGuideContent5", icon: "flask", action: "feed" },
            { id: "expand-3", titleKey: "dayGuideTitle6", contentKey: "dayGuideContent6", icon: "target", action: "feed" },
        ],
    },
    {
        id: "strengthening",
        order: 3,
        iconName: "muscle",
        titleKey: "milestoneStrengthTitle",
        descKey: "milestoneStrengthDesc",
        taskKey: "milestoneStrengthTask",
        tipKey: "milestoneStrengthTip",
        criteria: { minFeedings: 6, consecutiveDoubles: 2 },
        typicalDays: "5–10",
        microSteps: [
            { id: "strength-1", titleKey: "dayGuideTitle8", contentKey: "dayGuideContent8", icon: "bread", action: "feed" },
            { id: "strength-2", titleKey: "dayGuideTitle9", contentKey: "dayGuideContent9", icon: "thermometer", action: "feed" },
            { id: "strength-3", titleKey: "dayGuideTitle10", contentKey: "dayGuideContent10", icon: "clock", action: "feed" },
        ],
    },
    {
        id: "bake-ready",
        order: 4,
        iconName: "loaf",
        titleKey: "milestoneBakeReadyTitle",
        descKey: "milestoneBakeReadyDesc",
        taskKey: "milestoneBakeReadyTask",
        tipKey: "milestoneBakeReadyTip",
        criteria: {
            readinessSignals: [
                "volumeDoubling",
                "visibleBubbles",
                "airyTexture",
                "pleasantAroma",
                "predictableTiming",
            ],
        },
        typicalDays: "7–14+",
        microSteps: [
            { id: "ready-1", titleKey: "dayGuideTitle12", contentKey: "dayGuideContent12", icon: "target", action: "feed" },
            { id: "ready-2", titleKey: "dayGuideTitle13", contentKey: "dayGuideContent13", icon: "star", action: "learn" },
            { id: "ready-3", titleKey: "dayGuideTitle14", contentKey: "dayGuideContent14", icon: "bread", action: "learn" },
        ],
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
 * Get the current micro-step for a milestone by index.
 * @param {string} milestoneId
 * @param {number} stepIndex — 0-based
 * @returns {Object|null}
 */
export function getMicroStep(milestoneId, stepIndex) {
    const milestone = getMilestoneById(milestoneId);
    if (!milestone?.microSteps) return null;
    return milestone.microSteps[stepIndex] ?? null;
}

/**
 * Get the total number of micro-steps for a milestone.
 * @param {string} milestoneId
 * @returns {number}
 */
export function getMicroStepCount(milestoneId) {
    const milestone = getMilestoneById(milestoneId);
    return milestone?.microSteps?.length ?? 0;
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
