/**
 * Daily motivational quotes/messages.
 *
 * Organized by type:
 * - greetings: random greeting messages (3)
 * - daily: one per day of starter creation (days 1-7)
 * - streak: triggered at streak milestones (3, 7, 14, 30)
 * - action: triggered by specific user actions
 *
 * All values are i18n keys — the actual translations live in locales/*.json
 */

const dailyQuotes = {
  greetings: [
    "motivationalGreeting1",
    "motivationalGreeting2",
    "motivationalGreeting3",
  ],

  daily: {
    1: "motivationalDay1",
    2: "motivationalDay2",
    3: "motivationalDay3",
    4: "motivationalDay4",
    5: "motivationalDay5",
    6: "motivationalDay6",
    7: "motivationalDay7",
  },

  streak: {
    3: "motivationalStreak3",
    7: "motivationalStreak7",
    14: "motivationalStreak14",
    30: "motivationalStreak30",
  },

  action: {
    feedDone: "motivationalFeedDone",
    starterReady: "motivationalStarterReady",
    afterTrouble: "encourageAfterTrouble",
  },
};

export default dailyQuotes;

/**
 * Get a random greeting key.
 * @returns {string} i18n key
 */
export function getRandomGreeting() {
  const { greetings } = dailyQuotes;
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Get the motivational message for a specific day.
 * @param {number} day - Day number (1-7)
 * @returns {string|null} i18n key, or null if no message for that day
 */
export function getDailyQuote(day) {
  return dailyQuotes.daily[day] || null;
}

/**
 * Get the streak milestone message if applicable.
 * @param {number} streak - Current streak count
 * @returns {string|null} i18n key, or null if not a milestone
 */
export function getStreakQuote(streak) {
  return dailyQuotes.streak[streak] || null;
}
