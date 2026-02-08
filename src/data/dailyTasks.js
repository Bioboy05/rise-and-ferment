/**
 * Daily tasks for the first 7 days of starter creation.
 *
 * Each day has:
 * - titleKey: i18n key for the day title
 * - taskKey: i18n key for the main task description
 * - actionKey: i18n key for the action button text
 * - action: what the button should do (feed, observe, learn)
 * - contentKey: i18n key for expanded HTML content (sanitize before rendering)
 *
 * onclick handlers from the original HTML (e.g. switchTab('learn')) are replaced
 * with action identifiers that React components interpret.
 */

const dailyTasks = {
  1: {
    titleKey: "dayTask1Title",
    taskKey: "dayTask1",
    actionKey: "dayTask1Action",
    action: "feed",
    contentKey: "dayTask1Content",
  },
  2: {
    titleKey: "dayTask2Title",
    taskKey: "dayTask2",
    actionKey: "dayTask2Action",
    action: "observe",
    contentKey: "dayTask2Content",
  },
  3: {
    titleKey: "dayTask3Title",
    taskKey: "dayTask3",
    actionKey: "dayTask3Action",
    action: "feed",
    contentKey: "dayTask3Content",
  },
  4: {
    titleKey: "dayTask4Title",
    taskKey: "dayTask4",
    actionKey: "dayTask4Action",
    action: "feed",
    contentKey: "dayTask4Content",
  },
  5: {
    titleKey: "dayTask5Title",
    taskKey: "dayTask5",
    actionKey: "dayTask5Action",
    action: "feed",
    contentKey: "dayTask5Content",
  },
  6: {
    titleKey: "dayTask6Title",
    taskKey: "dayTask6",
    actionKey: "dayTask6Action",
    action: "feed",
    contentKey: "dayTask6Content",
  },
  7: {
    titleKey: "dayTask7Title",
    taskKey: "dayTask7",
    actionKey: "dayTask7Action",
    action: "learn",
    contentKey: "dayTask7Content",
  },
};

export default dailyTasks;
