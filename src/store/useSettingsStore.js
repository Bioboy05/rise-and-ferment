import { create } from "zustand";

const useSettingsStore = create((set) => ({
  theme: "light",
  language: "ro",
  beginnerMode: true,
  soundEnabled: true,
  tempUnit: "c",
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

  setLanguage: (lang) => set({ language: lang }),
  toggleBeginnerMode: () =>
    set((state) => ({ beginnerMode: !state.beginnerMode })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setTempUnit: (unit) => set({ tempUnit: unit }),
  incrementSessions: () => set((state) => ({ sessions: state.sessions + 1 })),
}));

export default useSettingsStore;
