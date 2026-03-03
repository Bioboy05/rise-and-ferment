/**
 * Shared validation constants and sanitization helpers.
 * Single source of truth — imported by stores, helpers, and components.
 */

export const MAX_NAME_LENGTH = 50;
export const MAX_NOTE_LENGTH = 500;
export const MAX_HISTORY_ENTRIES = 5000;
export const MAX_STARTERS = 10;
export const STARTER_PROGRAM_DAYS = 14;
export const MAX_TEMP_C = 50;
export const MAX_TEMP_F = 122;

/**
 * Trim and truncate a string to the given max length.
 * Returns an empty string for non-string inputs.
 */
export function sanitizeString(value, maxLength) {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
}
