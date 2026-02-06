import { create } from "zustand";

const useSettingsStore = create((set) => ({
  theme: "light",
  language: "ro",
  beginnerMode: true,
  soundEnabled: true,

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  setLanguage: (lang) => set({ language: lang }),
  toggleBeginnerMode: () =>
    set((state) => ({ beginnerMode: !state.beginnerMode })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));

export default useSettingsStore;
