import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSupportedLanguage } from "../constants/languages";
import { resolveInitialLanguage } from "../utils/languageDetection";
import { sanitizeSettings } from "../utils/settingsSanitizer";

const DEFAULT_LANGUAGE = resolveInitialLanguage("en");

const VALID_TEMP_UNITS = ["c", "f"];
const VALID_WEIGHT_UNITS = ["g", "oz"];

function clampInteger(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}

const useSettingsStore = create(
  persist(
    (set) => ({
      onboardingComplete: false,
      theme: "dark",
      language: DEFAULT_LANGUAGE,
      beginnerMode: true,
      soundEnabled: true,
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
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      setLanguage: (lang) => {
        if (isSupportedLanguage(lang)) set({ language: lang });
      },

      toggleBeginnerMode: () => set((state) => ({ beginnerMode: !state.beginnerMode })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

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
        const safe = sanitizeSettings(raw);
        return { ...currentState, ...safe };
      },
    }
  )
);

export default useSettingsStore;
