import { create } from "zustand";

const createStarter = (id, name = "Pufi") => ({
  id,
  name,
  flourType: "white",
  hydration: "100",
  createdAt: null,
  lastFed: null,
  isNewStarter: false,
  currentDay: 1,
  todayCompleted: false,
  lastCompletedDate: null,
  history: [],
});

const useStarterStore = create((set, get) => ({
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
          ? { ...s, history: [...s.history, entry], lastFed: entry.time }
          : s
      ),
    }));
  },
}));

export default useStarterStore;
