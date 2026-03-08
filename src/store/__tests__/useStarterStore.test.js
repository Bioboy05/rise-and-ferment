import { act } from "@testing-library/react";
import useStarterStore from "../useStarterStore";
import {
  MAX_NAME_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_STARTERS,
} from "../../constants/validation";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal starter object for seeding test state. */
function makeStarter(id, overrides = {}) {
  return {
    id,
    name: overrides.name ?? "Test Starter",
    flourType: "white",
    hydration: "100",
    createdAt: null,
    lastFed: null,
    history: [],
    feedAmount: 50,
    useBran: false,
    personalNotes: "",
    currentMilestoneId: "seed-activation",
    milestoneHistory: [],
    guidedMode: "new",
    previewingMilestoneId: null,
    milestoneCompleted: false,
    lastMilestoneCompletedAt: null,
    currentMicroStepIndex: 0,
    isNewStarter: true,
    currentDay: 1,
    previewingDay: null,
    todayCompleted: false,
    lastCompletedDate: null,
    completedDays: [],
    ...overrides,
  };
}

/** Seed store with given data (merge, preserves actions). */
function seed(data) {
  act(() => {
    useStarterStore.setState(data);
  });
}

/** Read current store state. */
const getState = () => useStarterStore.getState();

// ---------------------------------------------------------------------------
// Reset store before every test to guarantee isolation
// ---------------------------------------------------------------------------
beforeEach(() => {
  seed({
    starters: [makeStarter("starter_1")],
    activeStarterId: "starter_1",
  });
});

// ===========================================================================
// getActiveStarter
// ===========================================================================
describe("getActiveStarter", () => {
  it("returns the starter matching activeStarterId", () => {
    seed({
      starters: [
        makeStarter("s1", { name: "Alpha" }),
        makeStarter("s2", { name: "Beta" }),
      ],
      activeStarterId: "s2",
    });

    const active = getState().getActiveStarter();
    expect(active.id).toBe("s2");
    expect(active.name).toBe("Beta");
  });

  it("falls back to starters[0] when activeStarterId has no match", () => {
    seed({
      starters: [
        makeStarter("s1", { name: "First" }),
        makeStarter("s2", { name: "Second" }),
      ],
      activeStarterId: "nonexistent",
    });

    const active = getState().getActiveStarter();
    expect(active.id).toBe("s1");
  });
});

// ===========================================================================
// setActiveStarter
// ===========================================================================
describe("setActiveStarter", () => {
  beforeEach(() => {
    seed({
      starters: [makeStarter("s1"), makeStarter("s2"), makeStarter("s3")],
      activeStarterId: "s1",
    });
  });

  it("switches active starter when ID exists", () => {
    getState().setActiveStarter("s2");
    expect(getState().activeStarterId).toBe("s2");
  });

  it("no-op when ID does not exist in starters", () => {
    getState().setActiveStarter("nonexistent");
    expect(getState().activeStarterId).toBe("s1");
  });

  it("no-op for empty string", () => {
    getState().setActiveStarter("");
    expect(getState().activeStarterId).toBe("s1");
  });

  it("no-op for non-string values", () => {
    getState().setActiveStarter(42);
    expect(getState().activeStarterId).toBe("s1");

    getState().setActiveStarter(null);
    expect(getState().activeStarterId).toBe("s1");

    getState().setActiveStarter(undefined);
    expect(getState().activeStarterId).toBe("s1");
  });
});

// ===========================================================================
// addStarter
// ===========================================================================
describe("addStarter", () => {
  it("creates a new starter with the given name", () => {
    getState().addStarter("Sourdough Sam");
    const starters = getState().starters;
    expect(starters).toHaveLength(2);

    const newStarter = starters[1];
    expect(newStarter.name).toBe("Sourdough Sam");
    expect(newStarter.id).toMatch(/^starter_/);
  });

  it("new starter becomes the active starter", () => {
    getState().addStarter("New One");
    const starters = getState().starters;
    const newStarter = starters[starters.length - 1];
    expect(getState().activeStarterId).toBe(newStarter.id);
  });

  it("sanitizes the name by trimming and truncating", () => {
    const longName = "A".repeat(100);
    getState().addStarter(longName);

    const starters = getState().starters;
    const added = starters[starters.length - 1];
    expect(added.name.length).toBeLessThanOrEqual(MAX_NAME_LENGTH);
  });

  it("defaults to 'Pufi' for empty name", () => {
    getState().addStarter("");
    const starters = getState().starters;
    const added = starters[starters.length - 1];
    expect(added.name).toBe("Pufi");
  });

  it("defaults to 'Pufi' for whitespace-only name", () => {
    getState().addStarter("   ");
    const starters = getState().starters;
    const added = starters[starters.length - 1];
    expect(added.name).toBe("Pufi");
  });

  it("respects MAX_STARTERS limit", () => {
    const manyStarters = Array.from({ length: MAX_STARTERS }, (_, i) =>
      makeStarter(`s${i}`, { name: `Starter ${i}` })
    );
    seed({ starters: manyStarters, activeStarterId: "s0" });
    expect(getState().starters).toHaveLength(MAX_STARTERS);

    getState().addStarter("Overflow");
    expect(getState().starters).toHaveLength(MAX_STARTERS);
  });
});

// ===========================================================================
// removeStarter
// ===========================================================================
describe("removeStarter", () => {
  beforeEach(() => {
    seed({
      starters: [
        makeStarter("s1", { name: "Alpha" }),
        makeStarter("s2", { name: "Beta" }),
        makeStarter("s3", { name: "Gamma" }),
      ],
      activeStarterId: "s2",
    });
  });

  it("removes the starter from the array", () => {
    getState().removeStarter("s3");
    const ids = getState().starters.map((s) => s.id);
    expect(ids).toEqual(["s1", "s2"]);
  });

  it("switches active to first remaining if removed was active", () => {
    expect(getState().activeStarterId).toBe("s2");
    getState().removeStarter("s2");
    expect(getState().activeStarterId).toBe("s1");
    expect(getState().starters.map((s) => s.id)).toEqual(["s1", "s3"]);
  });

  it("keeps activeStarterId unchanged if removed was not active", () => {
    getState().removeStarter("s3");
    expect(getState().activeStarterId).toBe("s2");
  });

  it("will not remove the last starter", () => {
    seed({ starters: [makeStarter("only")], activeStarterId: "only" });

    getState().removeStarter("only");
    expect(getState().starters).toHaveLength(1);
    expect(getState().starters[0].id).toBe("only");
  });

  it("no-op for ID that does not exist", () => {
    getState().removeStarter("nonexistent");
    expect(getState().starters).toHaveLength(3);
  });

  it("no-op for invalid IDs", () => {
    getState().removeStarter("");
    expect(getState().starters).toHaveLength(3);

    getState().removeStarter(42);
    expect(getState().starters).toHaveLength(3);

    getState().removeStarter(null);
    expect(getState().starters).toHaveLength(3);
  });
});

// ===========================================================================
// updateStarter
// ===========================================================================
describe("updateStarter", () => {
  it("applies allowed fields correctly", () => {
    getState().updateStarter("starter_1", { useBran: true, feedAmount: 75 });

    const starter = getState().getActiveStarter();
    expect(starter.useBran).toBe(true);
    expect(starter.feedAmount).toBe(75);
  });

  it("drops keys not in the allowlist", () => {
    const originalId = getState().getActiveStarter().id;

    getState().updateStarter("starter_1", {
      id: "hacked_id",
      __proto__: { evil: true },
      constructor: "bad",
      randomField: 42,
    });

    const updated = getState().getActiveStarter();
    expect(updated.id).toBe(originalId);
  });

  it("sanitizes name by truncating to MAX_NAME_LENGTH", () => {
    const longName = "B".repeat(100);
    getState().updateStarter("starter_1", { name: longName });

    const starter = getState().getActiveStarter();
    expect(starter.name.length).toBeLessThanOrEqual(MAX_NAME_LENGTH);
    expect(starter.name).toBe("B".repeat(MAX_NAME_LENGTH));
  });

  it("defaults name to 'Pufi' when empty string provided", () => {
    getState().updateStarter("starter_1", { name: "" });
    expect(getState().getActiveStarter().name).toBe("Pufi");
  });

  it("sanitizes personalNotes by truncating to MAX_NOTE_LENGTH", () => {
    const longNote = "N".repeat(1000);
    getState().updateStarter("starter_1", { personalNotes: longNote });

    const starter = getState().getActiveStarter();
    expect(starter.personalNotes.length).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
  });

  it("no-op for invalid id", () => {
    const before = getState().starters[0].name;

    getState().updateStarter("", { name: "New Name" });
    expect(getState().starters[0].name).toBe(before);

    getState().updateStarter(null, { name: "New Name" });
    expect(getState().starters[0].name).toBe(before);

    getState().updateStarter(42, { name: "New Name" });
    expect(getState().starters[0].name).toBe(before);
  });

  it("no-op for null updates", () => {
    const before = getState().starters[0].name;
    getState().updateStarter("starter_1", null);
    expect(getState().starters[0].name).toBe(before);
  });

  it("no-op for non-object updates", () => {
    const before = getState().starters[0].name;
    getState().updateStarter("starter_1", "not an object");
    expect(getState().starters[0].name).toBe(before);
  });

  it("no-op when all keys are disallowed (nothing to apply)", () => {
    const before = getState().starters[0].name;
    getState().updateStarter("starter_1", { unknownKey: "value" });
    expect(getState().starters[0].name).toBe(before);
  });

  it("validates currentMicroStepIndex as integer in range 0-20", () => {
    getState().updateStarter("starter_1", { currentMicroStepIndex: 5 });
    expect(getState().getActiveStarter().currentMicroStepIndex).toBe(5);

    // Negative value should be dropped (stays at 5)
    getState().updateStarter("starter_1", { currentMicroStepIndex: -1 });
    expect(getState().getActiveStarter().currentMicroStepIndex).toBe(5);

    // Value > 20 should be dropped (stays at 5)
    getState().updateStarter("starter_1", { currentMicroStepIndex: 25 });
    expect(getState().getActiveStarter().currentMicroStepIndex).toBe(5);
  });
});

// ===========================================================================
// addFeeding
// ===========================================================================
describe("addFeeding", () => {
  it("adds entry to the starter's history", () => {
    const entry = { time: Date.now(), amount: 50 };
    getState().addFeeding("starter_1", entry);

    const starter = getState().getActiveStarter();
    expect(starter.history).toHaveLength(1);
    expect(starter.history[0].amount).toBe(50);
  });

  it("sets lastFed to the entry time", () => {
    const feedTime = Date.now() - 1000;
    getState().addFeeding("starter_1", { time: feedTime, amount: 50 });

    const starter = getState().getActiveStarter();
    expect(starter.lastFed).toBe(feedTime);
  });

  it("sanitizes amount by clamping to 1-500 range", () => {
    // Below minimum
    getState().addFeeding("starter_1", { time: Date.now(), amount: 0 });
    expect(getState().getActiveStarter().history[0].amount).toBe(1);

    // Reset for next check
    seed({
      starters: [makeStarter("starter_1")],
      activeStarterId: "starter_1",
    });

    // Above maximum
    getState().addFeeding("starter_1", { time: Date.now(), amount: 999 });
    expect(getState().getActiveStarter().history[0].amount).toBe(500);
  });

  it("defaults amount to 50 when non-finite", () => {
    getState().addFeeding("starter_1", { time: Date.now(), amount: NaN });
    expect(getState().getActiveStarter().history[0].amount).toBe(50);
  });

  it("generates UUID for entry if id is missing", () => {
    getState().addFeeding("starter_1", { time: Date.now(), amount: 50 });
    const entry = getState().getActiveStarter().history[0];
    expect(typeof entry.id).toBe("string");
    expect(entry.id.length).toBeGreaterThan(0);
  });

  it("preserves provided entry id", () => {
    getState().addFeeding("starter_1", {
      id: "custom-id-123",
      time: Date.now(),
      amount: 50,
    });
    expect(getState().getActiveStarter().history[0].id).toBe("custom-id-123");
  });

  it("no-op for invalid starter id", () => {
    getState().addFeeding("nonexistent", { time: Date.now(), amount: 50 });
    expect(getState().getActiveStarter().history).toHaveLength(0);

    getState().addFeeding("", { time: Date.now(), amount: 50 });
    expect(getState().getActiveStarter().history).toHaveLength(0);

    getState().addFeeding(null, { time: Date.now(), amount: 50 });
    expect(getState().getActiveStarter().history).toHaveLength(0);
  });

  it("no-op for null entry", () => {
    getState().addFeeding("starter_1", null);
    expect(getState().getActiveStarter().history).toHaveLength(0);
  });

  it("no-op for non-object entry", () => {
    getState().addFeeding("starter_1", "not an object");
    expect(getState().getActiveStarter().history).toHaveLength(0);
  });

  it("sanitizes note field", () => {
    const longNote = "X".repeat(1000);
    getState().addFeeding("starter_1", {
      time: Date.now(),
      amount: 50,
      note: longNote,
    });

    const entry = getState().getActiveStarter().history[0];
    expect(entry.note.length).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
  });

  it("sanitizes temperature with clamping", () => {
    // Valid temp
    getState().addFeeding("starter_1", {
      time: Date.now(),
      amount: 50,
      temp: 25,
      tempUnit: "c",
    });
    expect(getState().getActiveStarter().history[0].temp).toBe(25);

    // Reset
    seed({
      starters: [makeStarter("starter_1")],
      activeStarterId: "starter_1",
    });

    // Negative temp should be null
    getState().addFeeding("starter_1", {
      time: Date.now(),
      amount: 50,
      temp: -5,
      tempUnit: "c",
    });
    expect(getState().getActiveStarter().history[0].temp).toBeNull();
  });

  it("defaults time to Date.now() when non-finite", () => {
    const before = Date.now();
    getState().addFeeding("starter_1", { amount: 50, time: "invalid" });
    const entryTime = getState().getActiveStarter().history[0].time;
    expect(entryTime).toBeGreaterThanOrEqual(before);
  });

  it("sets todayCompleted to true after feeding", () => {
    getState().addFeeding("starter_1", { time: Date.now(), amount: 50 });
    expect(getState().getActiveStarter().todayCompleted).toBe(true);
  });
});

// ===========================================================================
// completeDay (legacy)
// ===========================================================================
describe("completeDay", () => {
  it("advances currentDay by 1", () => {
    const before = getState().getActiveStarter().currentDay;
    getState().completeDay("starter_1");

    const after = getState().getActiveStarter().currentDay;
    expect(after).toBe(before + 1);
  });

  it("sets todayCompleted to true", () => {
    getState().completeDay("starter_1");
    expect(getState().getActiveStarter().todayCompleted).toBe(true);
  });

  it("no-op when todayCompleted is already true", () => {
    getState().completeDay("starter_1");
    const dayAfterFirst = getState().getActiveStarter().currentDay;

    // Calling again should not advance further
    getState().completeDay("starter_1");
    expect(getState().getActiveStarter().currentDay).toBe(dayAfterFirst);
  });

  it("no-op for invalid id", () => {
    getState().completeDay("");
    expect(getState().getActiveStarter().todayCompleted).toBe(false);
  });
});
