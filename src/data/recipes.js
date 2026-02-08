/**
 * Sourdough recipes organized by category.
 *
 * Each recipe references i18n keys for all user-visible text.
 * Numeric values (time, servings) are language-independent.
 *
 * Categories:
 *   "bread"    — Sourdough breads
 *   "discard"  — Recipes using discard starter
 *   "other"    — Other sourdough-based recipes
 */

const recipes = [
  // --- Breads ---
  {
    id: "classic-sourdough",
    category: "bread",
    titleKey: "recipeClassicTitle",
    descKey: "recipeClassicDesc",
    difficulty: 2,
    timeMinutes: 1440,
    servings: 1,
    icon: "🍞",
    gradient: ["#8B5A2B", "#D2691E"],
    ingredientsKeys: [
      "recipeClassicIng1",
      "recipeClassicIng2",
      "recipeClassicIng3",
      "recipeClassicIng4",
    ],
    stepsKeys: [
      "recipeClassicStep1",
      "recipeClassicStep2",
      "recipeClassicStep3",
      "recipeClassicStep4",
      "recipeClassicStep5",
      "recipeClassicStep6",
      "recipeClassicStep7",
    ],
    tipKey: "recipeClassicTip",
  },
  {
    id: "whole-wheat",
    category: "bread",
    titleKey: "recipeWholeWheatTitle",
    descKey: "recipeWholeWheatDesc",
    difficulty: 2,
    timeMinutes: 1440,
    servings: 1,
    icon: "🌾",
    gradient: ["#5D4037", "#8D6E63"],
    ingredientsKeys: [
      "recipeWholeWheatIng1",
      "recipeWholeWheatIng2",
      "recipeWholeWheatIng3",
      "recipeWholeWheatIng4",
      "recipeWholeWheatIng5",
    ],
    stepsKeys: [
      "recipeWholeWheatStep1",
      "recipeWholeWheatStep2",
      "recipeWholeWheatStep3",
      "recipeWholeWheatStep4",
      "recipeWholeWheatStep5",
    ],
    tipKey: "recipeWholeWheatTip",
  },
  {
    id: "rye-bread",
    category: "bread",
    titleKey: "recipeRyeTitle",
    descKey: "recipeRyeDesc",
    difficulty: 3,
    timeMinutes: 1200,
    servings: 1,
    icon: "🌿",
    gradient: ["#3E2723", "#5D4037"],
    ingredientsKeys: [
      "recipeRyeIng1",
      "recipeRyeIng2",
      "recipeRyeIng3",
      "recipeRyeIng4",
      "recipeRyeIng5",
    ],
    stepsKeys: [
      "recipeRyeStep1",
      "recipeRyeStep2",
      "recipeRyeStep3",
      "recipeRyeStep4",
    ],
    tipKey: "recipeRyeTip",
  },
  {
    id: "focaccia",
    category: "bread",
    titleKey: "recipeFocacciaTitle",
    descKey: "recipeFocacciaDesc",
    difficulty: 1,
    timeMinutes: 720,
    servings: 6,
    icon: "🫒",
    gradient: ["#558B2F", "#7CB342"],
    ingredientsKeys: [
      "recipeFocacciaIng1",
      "recipeFocacciaIng2",
      "recipeFocacciaIng3",
      "recipeFocacciaIng4",
      "recipeFocacciaIng5",
    ],
    stepsKeys: [
      "recipeFocacciaStep1",
      "recipeFocacciaStep2",
      "recipeFocacciaStep3",
      "recipeFocacciaStep4",
    ],
    tipKey: "recipeFocacciaTip",
  },
  {
    id: "ciabatta",
    category: "bread",
    titleKey: "recipeCiabattaTitle",
    descKey: "recipeCiabattaDesc",
    difficulty: 3,
    timeMinutes: 1080,
    servings: 2,
    icon: "🥖",
    gradient: ["#BF8B2E", "#D4A84B"],
    ingredientsKeys: [
      "recipeCiabattaIng1",
      "recipeCiabattaIng2",
      "recipeCiabattaIng3",
      "recipeCiabattaIng4",
    ],
    stepsKeys: [
      "recipeCiabattaStep1",
      "recipeCiabattaStep2",
      "recipeCiabattaStep3",
      "recipeCiabattaStep4",
      "recipeCiabattaStep5",
    ],
    tipKey: "recipeCiabattaTip",
  },

  // --- Discard recipes ---
  {
    id: "discard-pancakes",
    category: "discard",
    titleKey: "recipePancakesTitle",
    descKey: "recipePancakesDesc",
    difficulty: 1,
    timeMinutes: 20,
    servings: 8,
    icon: "🥞",
    gradient: ["#F9A825", "#FFB74D"],
    ingredientsKeys: [
      "recipePancakesIng1",
      "recipePancakesIng2",
      "recipePancakesIng3",
      "recipePancakesIng4",
      "recipePancakesIng5",
    ],
    stepsKeys: [
      "recipePancakesStep1",
      "recipePancakesStep2",
      "recipePancakesStep3",
    ],
    tipKey: "recipePancakesTip",
  },
  {
    id: "discard-crackers",
    category: "discard",
    titleKey: "recipeCrackersTitle",
    descKey: "recipeCrackersDesc",
    difficulty: 1,
    timeMinutes: 30,
    servings: 20,
    icon: "🍪",
    gradient: ["#A1887F", "#BCAAA4"],
    ingredientsKeys: [
      "recipeCrackersIng1",
      "recipeCrackersIng2",
      "recipeCrackersIng3",
      "recipeCrackersIng4",
    ],
    stepsKeys: [
      "recipeCrackersStep1",
      "recipeCrackersStep2",
      "recipeCrackersStep3",
    ],
    tipKey: "recipeCrackersTip",
  },
  {
    id: "discard-pizza",
    category: "discard",
    titleKey: "recipePizzaTitle",
    descKey: "recipePizzaDesc",
    difficulty: 2,
    timeMinutes: 480,
    servings: 2,
    icon: "🍕",
    gradient: ["#D32F2F", "#EF5350"],
    ingredientsKeys: [
      "recipePizzaIng1",
      "recipePizzaIng2",
      "recipePizzaIng3",
      "recipePizzaIng4",
      "recipePizzaIng5",
    ],
    stepsKeys: [
      "recipePizzaStep1",
      "recipePizzaStep2",
      "recipePizzaStep3",
      "recipePizzaStep4",
    ],
    tipKey: "recipePizzaTip",
  },
  {
    id: "discard-banana-bread",
    category: "discard",
    titleKey: "recipeBananaBreadTitle",
    descKey: "recipeBananaBreadDesc",
    difficulty: 1,
    timeMinutes: 60,
    servings: 8,
    icon: "🍌",
    gradient: ["#FFA726", "#FFB74D"],
    ingredientsKeys: [
      "recipeBananaBreadIng1",
      "recipeBananaBreadIng2",
      "recipeBananaBreadIng3",
      "recipeBananaBreadIng4",
      "recipeBananaBreadIng5",
    ],
    stepsKeys: [
      "recipeBananaBreadStep1",
      "recipeBananaBreadStep2",
      "recipeBananaBreadStep3",
    ],
    tipKey: "recipeBananaBreadTip",
  },
  {
    id: "discard-waffles",
    category: "discard",
    titleKey: "recipeWafflesTitle",
    descKey: "recipeWafflesDesc",
    difficulty: 1,
    timeMinutes: 25,
    servings: 6,
    icon: "🧇",
    gradient: ["#F57F17", "#FFB300"],
    ingredientsKeys: [
      "recipeWafflesIng1",
      "recipeWafflesIng2",
      "recipeWafflesIng3",
      "recipeWafflesIng4",
    ],
    stepsKeys: [
      "recipeWafflesStep1",
      "recipeWafflesStep2",
      "recipeWafflesStep3",
    ],
    tipKey: "recipeWafflesTip",
  },

  // --- Other recipes ---
  {
    id: "brioche",
    category: "other",
    titleKey: "recipeBriocheTitle",
    descKey: "recipeBriocheDesc",
    difficulty: 3,
    timeMinutes: 960,
    servings: 1,
    icon: "🧈",
    gradient: ["#E65100", "#FF8F00"],
    ingredientsKeys: [
      "recipeBriocheIng1",
      "recipeBriocheIng2",
      "recipeBriocheIng3",
      "recipeBriocheIng4",
      "recipeBriocheIng5",
    ],
    stepsKeys: [
      "recipeBriocheStep1",
      "recipeBriocheStep2",
      "recipeBriocheStep3",
      "recipeBriocheStep4",
    ],
    tipKey: "recipeBriocheTip",
  },
  {
    id: "bagels",
    category: "other",
    titleKey: "recipeBagelsTitle",
    descKey: "recipeBagelsDesc",
    difficulty: 3,
    timeMinutes: 1080,
    servings: 8,
    icon: "🥯",
    gradient: ["#6D4C41", "#8D6E63"],
    ingredientsKeys: [
      "recipeBagelsIng1",
      "recipeBagelsIng2",
      "recipeBagelsIng3",
      "recipeBagelsIng4",
      "recipeBagelsIng5",
    ],
    stepsKeys: [
      "recipeBagelsStep1",
      "recipeBagelsStep2",
      "recipeBagelsStep3",
      "recipeBagelsStep4",
      "recipeBagelsStep5",
    ],
    tipKey: "recipeBagelsTip",
  },
  {
    id: "cinnamon-rolls",
    category: "other",
    titleKey: "recipeCinnamonTitle",
    descKey: "recipeCinnamonDesc",
    difficulty: 2,
    timeMinutes: 720,
    servings: 12,
    icon: "🌀",
    gradient: ["#4E342E", "#795548"],
    ingredientsKeys: [
      "recipeCinnamonIng1",
      "recipeCinnamonIng2",
      "recipeCinnamonIng3",
      "recipeCinnamonIng4",
    ],
    stepsKeys: [
      "recipeCinnamonStep1",
      "recipeCinnamonStep2",
      "recipeCinnamonStep3",
      "recipeCinnamonStep4",
    ],
    tipKey: "recipeCinnamonTip",
  },
  {
    id: "english-muffins",
    category: "other",
    titleKey: "recipeMuffinsTitle",
    descKey: "recipeMuffinsDesc",
    difficulty: 2,
    timeMinutes: 720,
    servings: 8,
    icon: "🫓",
    gradient: ["#FF8F00", "#FFB300"],
    ingredientsKeys: [
      "recipeMuffinsIng1",
      "recipeMuffinsIng2",
      "recipeMuffinsIng3",
      "recipeMuffinsIng4",
    ],
    stepsKeys: [
      "recipeMuffinsStep1",
      "recipeMuffinsStep2",
      "recipeMuffinsStep3",
    ],
    tipKey: "recipeMuffinsTip",
  },
  {
    id: "pretzels",
    category: "other",
    titleKey: "recipePretzelsTitle",
    descKey: "recipePretzelsDesc",
    difficulty: 2,
    timeMinutes: 600,
    servings: 8,
    icon: "🥨",
    gradient: ["#795548", "#A1887F"],
    ingredientsKeys: [
      "recipePretzelsIng1",
      "recipePretzelsIng2",
      "recipePretzelsIng3",
      "recipePretzelsIng4",
      "recipePretzelsIng5",
    ],
    stepsKeys: [
      "recipePretzelsStep1",
      "recipePretzelsStep2",
      "recipePretzelsStep3",
      "recipePretzelsStep4",
    ],
    tipKey: "recipePretzelsTip",
  },
];

export default recipes;

/**
 * Helper: get recipes filtered by category.
 * @param {string} category - "bread" | "discard" | "other"
 * @returns {Array}
 */
export function getRecipesByCategory(category) {
  return recipes.filter((r) => r.category === category);
}

/**
 * Recipe categories with i18n keys for display.
 */
export const recipeCategories = [
  { id: "bread", labelKey: "recipeCategoryBread", icon: "🍞" },
  { id: "discard", labelKey: "recipeCategoryDiscard", icon: "♻️" },
  { id: "other", labelKey: "recipeCategoryOther", icon: "🧁" },
];
