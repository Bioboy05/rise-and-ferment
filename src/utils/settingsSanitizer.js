/**
 * Shared settings sanitization — used by both the Zustand store (hydration)
 * and SettingsPage (import from JSON backup).
 */

import { isSupportedLanguage } from "../constants/languages";
import { resolveInitialLanguage } from "./languageDetection";

const VALID_TEMP_UNITS = ["c", "f"];
const VALID_WEIGHT_UNITS = ["g", "oz"];

function clampInteger(value, min, max, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, Math.round(parsed)));
}

function sanitizeNotifications(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    return {
        enabled: Boolean(source.enabled),
        urgentEnabled: source.urgentEnabled !== false,
        urgentHours: clampInteger(source.urgentHours, 1, 72, 24),
        dailyEnabled: Boolean(source.dailyEnabled),
        dailyTime:
            typeof source.dailyTime === "string" && /^\d{2}:\d{2}$/.test(source.dailyTime)
                ? source.dailyTime
                : "09:00",
        pushEnabled: Boolean(source.pushEnabled),
    };
}

/**
 * Sanitize a raw settings object into a safe, validated shape.
 * Works with both localStorage hydration and JSON import data.
 *
 * @param {unknown} rawState - Raw settings (from localStorage or import file)
 * @returns {Object} Validated settings object
 */
export function sanitizeSettings(rawState) {
    const source = rawState && typeof rawState === "object" ? rawState : {};
    const defaultLanguage = resolveInitialLanguage("en");

    return {
        onboardingComplete: Boolean(source.onboardingComplete),
        theme: source.theme === "light" ? "light" : "dark",
        language: isSupportedLanguage(source.language) ? source.language : defaultLanguage,
        beginnerMode: source.beginnerMode !== false,
        soundEnabled: source.soundEnabled !== false,
        tempUnit: VALID_TEMP_UNITS.includes(source.tempUnit) ? source.tempUnit : "c",
        weightUnit: VALID_WEIGHT_UNITS.includes(source.weightUnit) ? source.weightUnit : "g",
        sessions: clampInteger(source.sessions, 0, 100000, 0),
        notifications: sanitizeNotifications(source.notifications),
        scheduledBakes: Array.isArray(source.scheduledBakes) ? source.scheduledBakes.slice(0, 100) : [],
        calcLoaves: clampInteger(source.calcLoaves, 1, 10, 1),
        bakeNotes: String(source.bakeNotes || "").slice(0, 500),
    };
}
