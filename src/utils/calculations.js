/**
 * Bread recipe calculations.
 *
 * Base recipe per loaf (baker's percentages):
 *   Starter: 100g | Flour: 400g | Water: 280g | Salt: 8g
 */

const BASE = { starter: 100, flour: 400, water: 280, salt: 8 };

/**
 * Calculate bread ingredient amounts for a given number of loaves.
 *
 * @param {number} loaves - Number of loaves (1-10)
 * @returns {{ starter: number, flour: number, water: number, salt: number }}
 */
export function calculateBreadRecipe(loaves) {
  const n = Math.max(1, Math.min(10, Math.round(loaves)));
  return {
    starter: BASE.starter * n,
    flour: BASE.flour * n,
    water: BASE.water * n,
    salt: BASE.salt * n,
  };
}
