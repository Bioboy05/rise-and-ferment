import { create } from "zustand";
import { persist } from "zustand/middleware";
import { advanceStarterDay, normalizeStarter } from "../utils/starterHelpers";

const MAX_NAME_LENGTH = 50;
const MAX_NOTE_LENGTH = 500;
const MAX_STARTERS = 10;
const MAX_HISTORY_ENTRIES = 5000;

const sanitizeString = (value, maxLength) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
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

function sanitizeHydratedState(rawState) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const fallback = createStarter("starter_1", "Pufi");

  const normalized = Array.isArray(source.starters)
    ? source.starters.slice(0, MAX_STARTERS).map(normalizeStarter)
    : [];

  const seenIds = new Set();
  const starters = normalized.filter((starter) => {
    if (!isValidId(starter.id) || seenIds.has(starter.id)) return false;
    seenIds.add(starter.id);
    return true;
  });

  const safeStarters = starters.length > 0 ? starters : [fallback];
  const safeActiveStarterId = safeStarters.some((starter) => starter.id === source.activeStarterId)
    ? source.activeStarterId
    : safeStarters[0].id;

  return {
    starters: safeStarters,
    activeStarterId: safeActiveStarterId,
  };
}

const useStarterStore = create(
  persist(
    (set, get) => ({
      starters: [createStarter("starter_1", "Pufi")],
      activeStarterId: "starter_1",

      getActiveStarter: () => {
        const { starters, activeStarterId } = get();
        return starters.find((starter) => starter.id === activeStarterId) || starters[0];
      },

      setActiveStarter: (id) => {
        if (!isValidId(id)) return;
        set((state) => {
          if (!state.starters.some((starter) => starter.id === id)) return state;
          return { activeStarterId: id };
        });
      },

      addStarter: (name) => {
        const safeName = sanitizeString(name, MAX_NAME_LENGTH) || "Pufi";
        const { starters } = get();
        if (starters.length >= MAX_STARTERS) return;

        const id = `starter_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        set({
          starters: [...starters, createStarter(id, safeName)],
          activeStarterId: id,
        });
      },

      removeStarter: (id) => {
        if (!isValidId(id)) return;
        set((state) => {
          const filtered = state.starters.filter((starter) => starter.id !== id);
          if (filtered.length === 0) return state;

          return {
            starters: filtered,
            activeStarterId: state.activeStarterId === id ? filtered[0].id : state.activeStarterId,
          };
        });
      },

      updateStarter: (id, updates) => {
        if (!isValidId(id) || typeof updates !== "object" || updates === null) return;

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

        const safeUpdates = {};
        for (const key of allowedKeys) {
          if (!(key in updates)) continue;
          if (key === "name") {
            safeUpdates.name = sanitizeString(String(updates.name), MAX_NAME_LENGTH) || "Pufi";
            continue;
          }
          if (key === "personalNotes") {
            safeUpdates.personalNotes = sanitizeString(String(updates.personalNotes), MAX_NOTE_LENGTH);
            continue;
          }
          if (key === "flourType") {
            safeUpdates.flourType = sanitizeString(String(updates.flourType), 30) || "white";
            continue;
          }
          safeUpdates[key] = updates[key];
        }

        if (Object.keys(safeUpdates).length === 0) return;

        set((state) => ({
          starters: state.starters.map((starter) =>
            starter.id === id ? normalizeStarter({ ...starter, ...safeUpdates }) : starter
          ),
        }));
      },

      addFeeding: (id, entry) => {
        if (!isValidId(id) || typeof entry !== "object" || entry === null) return;

        const safeEntry = {
          time: Number.isFinite(entry.time) ? Math.round(entry.time) : Date.now(),
          amount: Number.isFinite(entry.amount) ? Math.max(0, Math.min(500, Math.round(entry.amount))) : 50,
          withBran: entry.withBran === true,
          temp:
            Number.isFinite(entry.temp) && entry.temp >= 0 && entry.temp <= 60
              ? Math.round(entry.temp * 10) / 10
              : null,
          note: entry.note ? sanitizeString(String(entry.note), MAX_NOTE_LENGTH) : null,
          flourType: sanitizeString(String(entry.flourType || "white"), 30) || "white",
        };

        set((state) => ({
          starters: state.starters.map((starter) => {
            if (starter.id !== id) return starter;

            const history =
              starter.history.length >= MAX_HISTORY_ENTRIES
                ? [...starter.history.slice(-MAX_HISTORY_ENTRIES + 1), safeEntry]
                : [...starter.history, safeEntry];

            return {
              ...starter,
              history,
              lastFed: safeEntry.time,
              todayCompleted: true,
              lastCompletedDate: new Date().toDateString(),
            };
          }),
        }));
      },

      completeDay: (id) => {
        if (!isValidId(id)) return;

        set((state) => ({
          starters: state.starters.map((starter) => {
            if (starter.id !== id) return starter;
            return advanceStarterDay(starter, new Date().toDateString());
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
      merge: (persistedState, currentState) => {
        const raw = persistedState?.state ?? persistedState;
        const safe = sanitizeHydratedState(raw);
        return { ...currentState, ...safe };
      },
    }
  )
);

export default useStarterStore;
