import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSupportedLanguage } from "../constants/languages";
import { resolveInitialLanguage } from "../utils/languageDetection";

const VALID_TEMP_UNITS = ["c", "f"];
const VALID_WEIGHT_UNITS = ["g", "oz"];
const VALID_GLASS_PRESETS = ["subtle", "balanced", "wow"];
const DEFAULT_LANGUAGE = resolveInitialLanguage("en");

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

function sanitizeHydratedSettings(rawState) {
  const source = rawState && typeof rawState === "object" ? rawState : {};

  return {
    onboardingComplete: Boolean(source.onboardingComplete),
    theme: source.theme === "dark" ? "dark" : "light",
    language: isSupportedLanguage(source.language) ? source.language : DEFAULT_LANGUAGE,
    beginnerMode: source.beginnerMode !== false,
    soundEnabled: source.soundEnabled !== false,
    glassPreset: VALID_GLASS_PRESETS.includes(source.glassPreset) ? source.glassPreset : "subtle",
    tempUnit: VALID_TEMP_UNITS.includes(source.tempUnit) ? source.tempUnit : "c",
    weightUnit: VALID_WEIGHT_UNITS.includes(source.weightUnit) ? source.weightUnit : "g",
    sessions: clampInteger(source.sessions, 0, 100000, 0),
    notifications: sanitizeNotifications(source.notifications),
    scheduledBakes: Array.isArray(source.scheduledBakes) ? source.scheduledBakes.slice(0, 100) : [],
    calcLoaves: clampInteger(source.calcLoaves, 1, 10, 1),
    bakeNotes: String(source.bakeNotes || "").slice(0, 500),
  };
}

const useSettingsStore = create(
  persist(
    (set) => ({
      onboardingComplete: false,
      theme: "light",
      language: DEFAULT_LANGUAGE,
      beginnerMode: true,
      soundEnabled: true,
      glassPreset: "subtle",
      tempUnit: "c",
      weightUnit: "g",
      sessions: 0,

      notifications: {
        enabled: false,
        urgentEnabled: true,
        urgentHours: 24,
        dailyEnabled: false,
        dailyTime: "09:00",
        pushEnabled: false,
      },

      scheduledBakes: [],
      calcLoaves: 1,
      bakeNotes: "",

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      setLanguage: (lang) => {
        if (isSupportedLanguage(lang)) set({ language: lang });
      },

      toggleBeginnerMode: () => set((state) => ({ beginnerMode: !state.beginnerMode })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setGlassPreset: (preset) => {
        if (VALID_GLASS_PRESETS.includes(preset)) set({ glassPreset: preset });
      },

      setTempUnit: (unit) => {
        if (VALID_TEMP_UNITS.includes(unit)) set({ tempUnit: unit });
      },

      setWeightUnit: (unit) => {
        if (VALID_WEIGHT_UNITS.includes(unit)) set({ weightUnit: unit });
      },

      toggleNotifications: () =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            enabled: !state.notifications.enabled,
          },
        })),

      setCalcLoaves: (loaves) =>
        set({
          calcLoaves: clampInteger(loaves, 1, 10, 1),
        }),

      setBakeNotes: (notes) =>
        set({
          bakeNotes: String(notes || "").slice(0, 500),
        }),

      completeOnboarding: () => set({ onboardingComplete: true }),
      incrementSessions: () => set((state) => ({ sessions: state.sessions + 1 })),

      resetAll: () => {
        localStorage.removeItem("riseFermentSettings");
        localStorage.removeItem("riseFermentStarters");
        window.location.reload();
      },
    }),
    {
      name: "riseFermentSettings",
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        theme: state.theme,
        language: state.language,
        beginnerMode: state.beginnerMode,
        soundEnabled: state.soundEnabled,
        glassPreset: state.glassPreset,
        tempUnit: state.tempUnit,
        weightUnit: state.weightUnit,
        sessions: state.sessions,
        notifications: state.notifications,
        scheduledBakes: state.scheduledBakes,
        calcLoaves: state.calcLoaves,
        bakeNotes: state.bakeNotes,
      }),
      merge: (persistedState, currentState) => {
        const raw = persistedState?.state ?? persistedState;
        const safe = sanitizeHydratedSettings(raw);
        return { ...currentState, ...safe };
      },
    }
  )
);

export default useSettingsStore;
