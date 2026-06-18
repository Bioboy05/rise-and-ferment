/**
 * Weight unit conversion + formatting.
 * Grams are the canonical storage unit; display can be grams or ounces.
 */

const GRAMS_PER_OUNCE = 28.3495;

/**
 * Convert a gram value to the display value for the chosen unit.
 * @param {number} grams
 * @param {"g"|"oz"} unit
 * @returns {string} display number (oz rounded to 1 decimal, g to integer)
 */
export function gramsToDisplay(grams, unit) {
  const value = Number(grams) || 0;
  if (unit === "oz") {
    const oz = value / GRAMS_PER_OUNCE;
    return Number.isInteger(oz) ? String(oz) : oz.toFixed(1);
  }
  return String(Math.round(value));
}

/** Short label for the unit. */
export function weightUnitLabel(unit) {
  return unit === "oz" ? "oz" : "g";
}

/** Full formatted weight, e.g. "50 g" or "1.8 oz". */
export function formatWeight(grams, unit) {
  return `${gramsToDisplay(grams, unit)} ${weightUnitLabel(unit)}`;
}
