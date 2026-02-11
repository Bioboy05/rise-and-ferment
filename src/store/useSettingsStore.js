import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSupportedLanguage } from "../constants/languages";

const VALID_TEMP_UNITS = ["c", "f"];
const VALID_WEIGHT_UNITS = ["g", "oz"];

const useSettingsStore = create(
  persist(
    (set) => ({
  onboardingComplete: false,
  theme: "light",
  language: "ro",
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
      theme: state.theme === "light" ? "dark" : "light",
    })),

  setLanguage: (lang) => {
    if (isSupportedLanguage(lang)) set({ language: lang });
  },
  toggleBeginnerMode: () =>
    set((state) => ({ beginnerMode: !state.beginnerMode })),
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
      calcLoaves: Math.max(1, Math.min(10, Math.round(Number(loaves) || 1))),
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
    }
  )
);

export default useSettingsStore;
