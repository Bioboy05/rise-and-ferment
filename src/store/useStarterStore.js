import { create } from "zustand";
import { persist } from "zustand/middleware";
import { advanceStarterDay, advanceMilestone, normalizeStarter } from "../utils/starterHelpers";
import {
  VALID_RISE_LEVELS,
  VALID_BUBBLE_ACTIVITIES,
  VALID_AROMAS,
} from "../utils/feedingInsights";
import {
  MAX_NAME_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_STARTERS,
  MAX_HISTORY_ENTRIES,
  MAX_TEMP_C,
  MAX_TEMP_F,
  sanitizeString,
} from "../constants/validation";
import { FIRST_MILESTONE_ID, getMilestoneById } from "../data/milestones";

const isValidId = (id) => typeof id === "string" && id.length > 0 && id.length <= 100;

const createStarter = (id, name = "Pufi", guidedMode = "new") => ({
  id,
  name,
  flourType: "white",
  hydration: "100",
  createdAt: null,
  lastFed: null,
  history: [],
  feedAmount: 50,
  useBran: false,
  personalNotes: "",
  // Milestone model (primary)
  currentMilestoneId: guidedMode === "self-paced" ? "bake-ready" : FIRST_MILESTONE_ID,
  milestoneHistory: [],
  guidedMode,
  previewingMilestoneId: null,
  milestoneCompleted: false,
  lastMilestoneCompletedAt: null,
  currentMicroStepIndex: 0,
  // Legacy fields (kept for compat)
  isNewStarter: guidedMode !== "self-paced",
  currentDay: 1,
  previewingDay: null,
  todayCompleted: false,
  lastCompletedDate: null,
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

        const id = `starter_${crypto.randomUUID()}`;
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
          "feedAmount",
          "useBran",
          "personalNotes",
          "history",
          // Milestone fields
          "currentMilestoneId",
          "milestoneHistory",
          "guidedMode",
          "previewingMilestoneId",
          "milestoneCompleted",
          "lastMilestoneCompletedAt",
          "currentMicroStepIndex",
          // Legacy fields
          "isNewStarter",
          "currentDay",
          "previewingDay",
          "todayCompleted",
          "lastCompletedDate",
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
          if (key === "currentMicroStepIndex") {
            const val = Number(updates[key]);
            if (!Number.isInteger(val) || val < 0 || val > 20) continue;
            safeUpdates[key] = val;
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

        const entryTempUnit = entry.tempUnit === "f" ? "f" : "c";
        const safeEntry = {
          id: typeof entry.id === "string" && entry.id.length > 0 ? entry.id : crypto.randomUUID(),
          time: Number.isFinite(entry.time) ? Math.round(entry.time) : Date.now(),
          amount: Number.isFinite(entry.amount) ? Math.max(1, Math.min(500, Math.round(entry.amount))) : 50,
          withBran: entry.withBran === true,
          temp: (() => {
            if (!Number.isFinite(entry.temp)) return null;
            const maxTemp = entryTempUnit === "f" ? MAX_TEMP_F : MAX_TEMP_C;
            return entry.temp >= 0 && entry.temp <= maxTemp
              ? Math.round(entry.temp * 10) / 10
              : null;
          })(),
          tempUnit: entryTempUnit,
          note: entry.note ? sanitizeString(String(entry.note), MAX_NOTE_LENGTH) : null,
          flourType: sanitizeString(String(entry.flourType || "white"), 30) || "white",
          riseLevel: VALID_RISE_LEVELS.includes(entry.riseLevel) ? entry.riseLevel : null,
          bubbleActivity: VALID_BUBBLE_ACTIVITIES.includes(entry.bubbleActivity) ? entry.bubbleActivity : null,
          aroma: VALID_AROMAS.includes(entry.aroma) ? entry.aroma : null,
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

      completeMilestone: (id, milestoneId, evidence = null) => {
        if (!isValidId(id)) return;

        set((state) => ({
          starters: state.starters.map((starter) => {
            if (starter.id !== id) return starter;
            return advanceMilestone(starter, milestoneId, evidence);
          }),
        }));
      },

      advanceMicroStep: (id) => {
        if (!isValidId(id)) return;

        set((state) => ({
          starters: state.starters.map((starter) => {
            if (starter.id !== id) return starter;
            const milestone = getMilestoneById(starter.currentMilestoneId);
            if (!milestone?.microSteps) return starter;

            const nextIndex = (starter.currentMicroStepIndex ?? 0) + 1;
            if (nextIndex >= milestone.microSteps.length) {
              return { ...starter, currentMicroStepIndex: milestone.microSteps.length - 1 };
            }
            return { ...starter, currentMicroStepIndex: nextIndex };
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
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch {
            // Corrupted blob — degrade to defaults instead of crashing hydration.
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (e) {
            if (e?.name === "QuotaExceededError" || e?.code === 22) {
              const trimmed = JSON.parse(JSON.stringify(value));
              const starters = trimmed?.state?.starters;
              if (Array.isArray(starters)) {
                starters.forEach((s) => {
                  if (Array.isArray(s.history) && s.history.length > 500) {
                    s.history = s.history.slice(-500);
                  }
                });
              }
              try {
                localStorage.setItem(name, JSON.stringify(trimmed));
              } catch {
                console.error("[Storage] Unable to persist state after trimming history");
              }
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
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
