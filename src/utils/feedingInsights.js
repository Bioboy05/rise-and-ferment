/**
 * Feeding Insights Engine
 *
 * Analyzes the last N feeding observations to generate personalized
 * recommendations and readiness assessments for the user's starter.
 *
 * Observation fields per feeding:
 * - riseLevel: "none" | "slight" | "doubled" | "tripled"
 * - bubbleActivity: "none" | "few" | "many" | "honeycomb"
 * - aroma: "none" | "floury" | "mild" | "tangy" | "sour" | "unpleasant"
 *
 * All fields are optional — users can skip observations.
 */

/** Number of recent feedings to analyze for insights. */
const WINDOW = 5;

/** Numeric scores for each observation level (higher = healthier). */
const RISE_SCORES = { none: 0, slight: 1, doubled: 3, tripled: 4 };
const BUBBLE_SCORES = { none: 0, few: 1, many: 3, honeycomb: 4 };
const AROMA_SCORES = { none: 0, floury: 1, mild: 2, tangy: 3, sour: 2, unpleasant: -1 };

/**
 * Score a single feeding observation (0-12 max, -1 possible for unpleasant).
 * Returns null if no observations were recorded.
 */
function scoreSingle(entry) {
    if (!entry) return null;
    const { riseLevel, bubbleActivity, aroma } = entry;
    if (!riseLevel && !bubbleActivity && !aroma) return null;

    return (
        (RISE_SCORES[riseLevel] ?? 0) +
        (BUBBLE_SCORES[bubbleActivity] ?? 0) +
        (AROMA_SCORES[aroma] ?? 0)
    );
}

/**
 * Generate insights from recent feeding history.
 *
 * @param {Array<Object>} history - Full feeding history array
 * @returns {{ score: number|null, level: string, insightKey: string, tips: string[] }}
 *   - score: average health score (0-12), null if no observations
 *   - level: "thriving" | "growing" | "struggling" | "early" | "unknown"
 *   - insightKey: i18n key for the main insight message
 *   - tips: array of i18n keys for actionable recommendations
 */
export function getStarterInsights(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return { score: null, level: "early", insightKey: "insightEarly", tips: [] };
    }

    // Take the most recent entries with observations
    const recent = history
        .slice(-WINDOW)
        .filter((e) => e.riseLevel || e.bubbleActivity || e.aroma);

    if (recent.length === 0) {
        return { score: null, level: "unknown", insightKey: "insightNoObservations", tips: ["tipStartObserving"] };
    }

    const scores = recent.map(scoreSingle).filter((s) => s !== null);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Analyze patterns
    const lastEntry = recent[recent.length - 1];
    const tips = [];

    // Rise analysis
    if (lastEntry.riseLevel === "none" || lastEntry.riseLevel === "slight") {
        tips.push("tipWarmSpot");
        if (lastEntry.aroma !== "unpleasant") {
            tips.push("tipWholeGrainBoost");
        }
    }

    // Bubble analysis
    if (lastEntry.bubbleActivity === "none" || lastEntry.bubbleActivity === "few") {
        tips.push("tipConsistentFeeding");
    }

    // Aroma analysis
    if (lastEntry.aroma === "unpleasant") {
        tips.push("tipUnpleasantAromaNormal");
    } else if (lastEntry.aroma === "sour") {
        tips.push("tipOverFermented");
    }

    // Determine overall level
    let level;
    let insightKey;

    if (avgScore >= 9) {
        level = "thriving";
        insightKey = "insightThriving";
    } else if (avgScore >= 5) {
        level = "growing";
        insightKey = "insightGrowing";
        if (tips.length === 0) tips.push("tipKeepGoing");
    } else if (avgScore >= 0) {
        level = "struggling";
        insightKey = "insightStruggling";
        if (tips.length === 0) tips.push("tipPatience");
    } else {
        level = "early";
        insightKey = "insightEarlyStage";
        tips.push("tipEarlyDaysNormal");
    }

    // Check for readiness signals (for bake-ready milestone)
    const hasDoubling = recent.some((e) => e.riseLevel === "doubled" || e.riseLevel === "tripled");
    const hasBubbles = recent.some((e) => e.bubbleActivity === "many" || e.bubbleActivity === "honeycomb");
    const hasTangy = recent.some((e) => e.aroma === "tangy" || e.aroma === "mild");

    if (hasDoubling && hasBubbles && hasTangy && avgScore >= 8) {
        insightKey = "insightReadyToBake";
        level = "thriving";
    }

    return { score: Math.round(avgScore * 10) / 10, level, insightKey, tips: tips.slice(0, 3) };
}

/** Valid observation values (for validation in store). */
export const VALID_RISE_LEVELS = ["none", "slight", "doubled", "tripled"];
export const VALID_BUBBLE_ACTIVITIES = ["none", "few", "many", "honeycomb"];
export const VALID_AROMAS = ["none", "floury", "mild", "tangy", "sour", "unpleasant"];
