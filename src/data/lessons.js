/**
 * Sourdough starter lessons.
 *
 * Each lesson uses i18n keys for title/short/content.
 * The `contentKey` points to an i18n key containing HTML content —
 * components should sanitize with DOMPurify before rendering.
 *
 * When the full HTML lesson content is added to i18n files (Phase 3+),
 * each lesson's contentKey will map to the complete lesson text.
 * For now, we define the structure and metadata.
 */

const lessons = [
  {
    id: 1,
    icon: "🌾",
    titleKey: "lessonTitle1",
    shortKey: "lessonShort1",
    contentKey: "lessonContent1",
  },
  {
    id: 2,
    icon: "🌡️",
    titleKey: "lessonTitle2",
    shortKey: "lessonShort2",
    contentKey: "lessonContent2",
  },
  {
    id: 3,
    icon: "💧",
    titleKey: "lessonTitle3",
    shortKey: "lessonShort3",
    contentKey: "lessonContent3",
  },
  {
    id: 4,
    icon: "🎯",
    titleKey: "lessonTitle4",
    shortKey: "lessonShort4",
    contentKey: "lessonContent4",
  },
  {
    id: 5,
    icon: "🔬",
    titleKey: "lessonTitle5",
    shortKey: "lessonShort5",
    contentKey: "lessonContent5",
  },
  {
    id: 6,
    icon: "🍞",
    titleKey: "lessonTitle6",
    shortKey: "lessonShort6",
    contentKey: "lessonContent6",
  },
  {
    id: 7,
    icon: "❄️",
    titleKey: "lessonTitle7",
    shortKey: "lessonShort7",
    contentKey: "lessonContent7",
  },
  {
    id: 8,
    icon: "⚗️",
    titleKey: "lessonTitle8",
    shortKey: "lessonShort8",
    contentKey: "lessonContent8",
  },
  {
    id: 9,
    icon: "🧪",
    titleKey: "lessonTitle9",
    shortKey: "lessonShort9",
    contentKey: "lessonContent9",
  },
  {
    id: 10,
    icon: "🏠",
    titleKey: "lessonTitle10",
    shortKey: "lessonShort10",
    contentKey: "lessonContent10",
  },
  {
    id: 11,
    icon: "🌿",
    titleKey: "lessonTitle11",
    shortKey: "lessonShort11",
    contentKey: "lessonContent11",
  },
  {
    id: 12,
    icon: "📏",
    titleKey: "lessonTitle12",
    shortKey: "lessonShort12",
    contentKey: "lessonContent12",
  },
  {
    id: 13,
    icon: "🔄",
    titleKey: "lessonTitle13",
    shortKey: "lessonShort13",
    contentKey: "lessonContent13",
  },
  {
    id: 14,
    icon: "🎓",
    titleKey: "lessonTitle14",
    shortKey: "lessonShort14",
    contentKey: "lessonContent14",
  },
];

export default lessons;
