import {
  calculateStreak,
  normalizeStarter,
  advanceStarterDay,
} from "../starterHelpers";

// ---------------------------------------------------------------------------
// Helper: create a history entry for a given Date
// ---------------------------------------------------------------------------
function entry(date) {
  return { time: date.getTime() };
}

/** Return a Date for N days before the given anchor (midnight). */
function daysAgo(n, anchor) {
  const d = new Date(anchor);
  d.setDate(d.getDate() - n);
  return d;
}

// ===========================================================================
// calculateStreak
// ===========================================================================
describe("calculateStreak", () => {
  // Fix "today" to 2025-06-15 so tests are deterministic.
  const TODAY = new Date(2025, 5, 15, 12, 0, 0); // June 15, 2025 noon

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for empty history", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 0 for null input", () => {
    expect(calculateStreak(null)).toBe(0);
  });

  it("returns 0 for undefined input", () => {
    expect(calculateStreak(undefined)).toBe(0);
  });

  it("returns 0 for non-array input", () => {
    expect(calculateStreak("not an array")).toBe(0);
  });

  it("returns 1 for a single entry today", () => {
    expect(calculateStreak([entry(TODAY)])).toBe(1);
  });

  it("returns 3 for 3 consecutive days ending today", () => {
    const history = [
      entry(daysAgo(2, TODAY)),
      entry(daysAgo(1, TODAY)),
      entry(TODAY),
    ];
    expect(calculateStreak(history)).toBe(3);
  });

  it("counts from yesterday when today has no entry", () => {
    const history = [
      entry(daysAgo(3, TODAY)),
      entry(daysAgo(2, TODAY)),
      entry(daysAgo(1, TODAY)),
    ];
    // No entry for today: streak starts from yesterday going back
    expect(calculateStreak(history)).toBe(3);
  });

  it("stops at a gap — counts only the most recent consecutive run", () => {
    // Days: today, yesterday, 2 days ago — then a gap — 4 days ago, 5 days ago
    const history = [
      entry(daysAgo(5, TODAY)),
      entry(daysAgo(4, TODAY)),
      // gap at 3 days ago
      entry(daysAgo(2, TODAY)),
      entry(daysAgo(1, TODAY)),
      entry(TODAY),
    ];
    expect(calculateStreak(history)).toBe(3);
  });

  it("returns 0 when all entries are in the distant past (gap from today AND yesterday)", () => {
    const history = [
      entry(daysAgo(10, TODAY)),
      entry(daysAgo(9, TODAY)),
    ];
    expect(calculateStreak(history)).toBe(0);
  });

  it("counts duplicate timestamps on the same day as 1 day", () => {
    const morning = new Date(2025, 5, 15, 8, 0, 0);
    const evening = new Date(2025, 5, 15, 20, 0, 0);
    const history = [
      entry(morning),
      entry(evening),
      entry(daysAgo(1, TODAY)),
    ];
    expect(calculateStreak(history)).toBe(2);
  });

  it("ignores entries with missing time property", () => {
    const history = [
      { noTime: true },
      entry(TODAY),
    ];
    expect(calculateStreak(history)).toBe(1);
  });

  it("ignores entries with non-number time property", () => {
    const history = [
      { time: "not a number" },
      entry(TODAY),
    ];
    expect(calculateStreak(history)).toBe(1);
  });

  it("ignores null entries in the array", () => {
    const history = [
      null,
      entry(TODAY),
    ];
    expect(calculateStreak(history)).toBe(1);
  });

  it("returns 0 when all entries are invalid", () => {
    const history = [
      null,
      { time: "bad" },
      {},
    ];
    expect(calculateStreak(history)).toBe(0);
  });
});

// ===========================================================================
// normalizeStarter
// ===========================================================================
describe("normalizeStarter", () => {
  it("returns a valid starter with defaults for null input", () => {
    const result = normalizeStarter(null);
    expect(result).toMatchObject({
      id: "starter_1",
      name: "Pufi",
      flourType: "white",
      hydration: "100",
      history: [],
      feedAmount: 50,
      useBran: false,
      currentDay: 1,
      todayCompleted: false,
      completedDays: [],
    });
  });

  it("returns a valid starter with defaults for undefined input", () => {
    const result = normalizeStarter(undefined);
    expect(result.id).toBe("starter_1");
    expect(result.name).toBe("Pufi");
  });

  it("returns a valid starter with defaults for empty object", () => {
    const result = normalizeStarter({});
    expect(result.id).toBe("starter_1");
    expect(result.hydration).toBe("100");
    expect(result.feedAmount).toBe(50);
  });

  it("passes through valid data correctly", () => {
    const input = {
      id: "my_starter",
      name: "Bubbles",
      flourType: "rye",
      hydration: "80",
      feedAmount: 75,
      useBran: true,
      personalNotes: "Smells great today",
      currentDay: 7,
      isNewStarter: true,
    };
    const result = normalizeStarter(input);
    expect(result.id).toBe("my_starter");
    expect(result.name).toBe("Bubbles");
    expect(result.flourType).toBe("rye");
    expect(result.hydration).toBe("80");
    expect(result.feedAmount).toBe(75);
    expect(result.useBran).toBe(true);
    expect(result.personalNotes).toBe("Smells great today");
    expect(result.currentDay).toBe(7);
  });

  it("defaults invalid hydration to '100'", () => {
    expect(normalizeStarter({ hydration: "50" }).hydration).toBe("100");
    expect(normalizeStarter({ hydration: 999 }).hydration).toBe("100");
    expect(normalizeStarter({ hydration: null }).hydration).toBe("100");
  });

  it("accepts valid hydration values", () => {
    expect(normalizeStarter({ hydration: "100" }).hydration).toBe("100");
    expect(normalizeStarter({ hydration: "80" }).hydration).toBe("80");
    expect(normalizeStarter({ hydration: "60" }).hydration).toBe("60");
  });

  it("clamps feedAmount to valid range (25-200)", () => {
    expect(normalizeStarter({ feedAmount: 10 }).feedAmount).toBe(25);
    expect(normalizeStarter({ feedAmount: 300 }).feedAmount).toBe(200);
    expect(normalizeStarter({ feedAmount: 100 }).feedAmount).toBe(100);
  });

  it("clamps currentDay to 1-14 range", () => {
    expect(normalizeStarter({ currentDay: 0 }).currentDay).toBe(1);
    expect(normalizeStarter({ currentDay: -5 }).currentDay).toBe(1);
    expect(normalizeStarter({ currentDay: 20 }).currentDay).toBe(14);
    expect(normalizeStarter({ currentDay: 7 }).currentDay).toBe(7);
  });

  it("sanitizes completedDays to only include strings", () => {
    const result = normalizeStarter({
      completedDays: ["Mon Jun 09 2025", 123, null, "Tue Jun 10 2025"],
    });
    expect(result.completedDays).toEqual(["Mon Jun 09 2025", "Tue Jun 10 2025"]);
  });

  it("handles non-object input types gracefully", () => {
    expect(normalizeStarter(42).id).toBe("starter_1");
    expect(normalizeStarter("string").id).toBe("starter_1");
    expect(normalizeStarter(true).id).toBe("starter_1");
  });
});

// ===========================================================================
// advanceStarterDay
// ===========================================================================
describe("advanceStarterDay", () => {
  const baseStarter = {
    currentDay: 3,
    todayCompleted: false,
    completedDays: ["Mon Jun 09 2025", "Tue Jun 10 2025"],
    isNewStarter: true,
    lastCompletedDate: null,
    previewingDay: 5,
  };

  it("increments currentDay and sets todayCompleted to true", () => {
    const result = advanceStarterDay(baseStarter, "Wed Jun 11 2025");
    expect(result.currentDay).toBe(4);
    expect(result.todayCompleted).toBe(true);
    expect(result.lastCompletedDate).toBe("Wed Jun 11 2025");
  });

  it("adds today to completedDays", () => {
    const result = advanceStarterDay(baseStarter, "Wed Jun 11 2025");
    expect(result.completedDays).toContain("Wed Jun 11 2025");
    expect(result.completedDays).toHaveLength(3);
  });

  it("clears previewingDay", () => {
    const result = advanceStarterDay(baseStarter, "Wed Jun 11 2025");
    expect(result.previewingDay).toBeNull();
  });

  it("no-ops when todayCompleted is already true", () => {
    const alreadyDone = { ...baseStarter, todayCompleted: true };
    const result = advanceStarterDay(alreadyDone, "Wed Jun 11 2025");
    expect(result).toBe(alreadyDone); // same reference = no change
  });

  it("does not add duplicate day to completedDays", () => {
    const today = "Tue Jun 10 2025"; // already in completedDays
    const result = advanceStarterDay(baseStarter, today);
    expect(result.completedDays.filter((d) => d === today)).toHaveLength(1);
  });

  it("returns null/undefined input unchanged", () => {
    expect(advanceStarterDay(null)).toBeNull();
    expect(advanceStarterDay(undefined)).toBeUndefined();
  });

  it("graduates starter when reaching program day 14", () => {
    const atEnd = {
      ...baseStarter,
      currentDay: 14,
    };
    const result = advanceStarterDay(atEnd, "Thu Jun 12 2025");
    // currentDay should not exceed STARTER_PROGRAM_DAYS (14)
    expect(result.currentDay).toBe(14);
    // Should graduate: isNewStarter becomes false
    expect(result.isNewStarter).toBe(false);
  });

  it("keeps isNewStarter true before reaching program end", () => {
    const result = advanceStarterDay(baseStarter, "Wed Jun 11 2025");
    expect(result.isNewStarter).toBe(true);
  });

  it("handles starter with missing completedDays array", () => {
    const noCompletedDays = {
      currentDay: 2,
      todayCompleted: false,
      isNewStarter: true,
    };
    const result = advanceStarterDay(noCompletedDays, "Wed Jun 11 2025");
    expect(result.completedDays).toEqual(["Wed Jun 11 2025"]);
    expect(result.currentDay).toBe(3);
  });
});
