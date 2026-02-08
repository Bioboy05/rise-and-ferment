import { create } from "zustand";
import { persist } from "zustand/middleware";

const createStarter = (id, name = "Pufi") => ({
  id,
  name,
  flourType: "white",
  hydration: "100",
  createdAt: null,
  lastFed: null,
  isNewStarter: false,
  currentDay: 1,
  previewingDay: null,
  todayCompleted: false,
  lastCompletedDate: null,
  history: [],
  streak: 0,
  feedAmount: 50,
  useBran: false,
  personalNotes: "",
  completedDays: [],
});

const useStarterStore = create(
  persist(
    (set, get) => ({
  starters: [createStarter("starter_1", "Pufi")],
  activeStarterId: "starter_1",

  getActiveStarter: () => {
    const { starters, activeStarterId } = get();
    return starters.find((s) => s.id === activeStarterId) || starters[0];
  },

  setActiveStarter: (id) => set({ activeStarterId: id }),

  addStarter: (name) => {
    const id = "starter_" + Date.now();
    set((state) => ({
      starters: [...state.starters, createStarter(id, name)],
      activeStarterId: id,
    }));
  },

  removeStarter: (id) => {
    set((state) => {
      const filtered = state.starters.filter((s) => s.id !== id);
      if (filtered.length === 0) return state;
      return {
        starters: filtered,
        activeStarterId:
          state.activeStarterId === id ? filtered[0].id : state.activeStarterId,
      };
    });
  },

  updateStarter: (id, updates) => {
    set((state) => ({
      starters: state.starters.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },

  addFeeding: (id, entry) => {
    set((state) => ({
      starters: state.starters.map((s) =>
        s.id === id
          ? {
              ...s,
              history: [...s.history, entry],
              lastFed: entry.time,
              todayCompleted: true,
              lastCompletedDate: new Date().toDateString(),
            }
          : s
      ),
    }));
  },

  completeDay: (id) => {
    set((state) => ({
      starters: state.starters.map((s) => {
        if (s.id !== id) return s;
        const today = new Date().toDateString();
        return {
          ...s,
          todayCompleted: true,
          lastCompletedDate: today,
          currentDay: s.currentDay + 1,
          completedDays: [...s.completedDays, today],
          previewingDay: null,
        };
      }),
    }));
  },
    }),
    {
      name: "riseFermentStarters",
      partialize: (state) => ({
        starters: state.starters,
        activeStarterId: state.activeStarterId,
      }),
    }
  )
);

export default useStarterStore;
