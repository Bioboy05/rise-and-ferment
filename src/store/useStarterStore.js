import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Security: input sanitization helpers ---
const MAX_NAME_LENGTH = 50;
const MAX_NOTE_LENGTH = 500;
const MAX_STARTERS = 10;
const MAX_HISTORY_ENTRIES = 5000;

const sanitizeString = (val, maxLen) => {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
};

const isValidId = (id) => typeof id === "string" && id.length > 0 && id.length <= 100;

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
    const safeName = sanitizeString(name, MAX_NAME_LENGTH) || "Pufi";
    const { starters } = get();
    if (starters.length >= MAX_STARTERS) return;
    const id = "starter_" + Date.now();
    set({
      starters: [...starters, createStarter(id, safeName)],
      activeStarterId: id,
    });
  },

  removeStarter: (id) => {
    if (!isValidId(id)) return;
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
    if (!isValidId(id) || typeof updates !== "object" || updates === null) return;
    // Whitelist: only allow known starter fields to be updated
    const allowedKeys = [
      "name",
      "flourType",
      "hydration",
      "createdAt",
      "lastFed",
      "isNewStarter",
      "currentDay",
      "previewingDay",
      "todayCompleted",
      "lastCompletedDate",
      "feedAmount",
      "useBran",
      "personalNotes",
      "history",
      "streak",
      "completedDays",
    ];
    const safe = {};
    for (const key of allowedKeys) {
      if (!(key in updates)) continue;
      if (key === "name") safe.name = sanitizeString(updates.name, MAX_NAME_LENGTH) || undefined;
      else if (key === "personalNotes") safe.personalNotes = sanitizeString(updates.personalNotes, MAX_NOTE_LENGTH);
      else if (key === "flourType") safe.flourType = sanitizeString(updates.flourType, 30) || "white";
      else safe[key] = updates[key];
    }
    if (Object.keys(safe).length === 0) return;
    set((state) => ({
      starters: state.starters.map((s) =>
        s.id === id ? { ...s, ...safe } : s
      ),
    }));
  },

  addFeeding: (id, entry) => {
    if (!isValidId(id) || typeof entry !== "object" || entry === null) return;
    // Validate and sanitize feeding entry
    const safeEntry = {
      time: typeof entry.time === "number" ? entry.time : Date.now(),
      amount: typeof entry.amount === "number" ? Math.max(0, Math.min(500, entry.amount)) : 50,
      withBran: entry.withBran === true,
      temp: typeof entry.temp === "number" && entry.temp >= 0 && entry.temp <= 60 ? entry.temp : null,
      note: entry.note ? sanitizeString(String(entry.note), MAX_NOTE_LENGTH) : null,
      flourType: sanitizeString(String(entry.flourType || "white"), 30),
    };
    set((state) => ({
      starters: state.starters.map((s) => {
        if (s.id !== id) return s;
        // Prevent history from growing without bound
        const history = s.history.length >= MAX_HISTORY_ENTRIES
          ? [...s.history.slice(-MAX_HISTORY_ENTRIES + 1), safeEntry]
          : [...s.history, safeEntry];
        return {
          ...s,
          history,
          lastFed: safeEntry.time,
          todayCompleted: true,
          lastCompletedDate: new Date().toDateString(),
        };
      }),
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
