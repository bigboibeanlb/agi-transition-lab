import { describe, expect, it } from "vitest";
import {
  ageAt,
  ageWindow,
  applyHypothesis,
  MILESTONES,
  parseHypothesis,
  SCENARIOS,
  VERIFICATION_REQUIREMENTS,
} from "./framework";
describe("Original research integrity", () => {
  it("preserves all 36 exact supplied forecast labels", () => {
    const expected = [
      ["Late 2026–2028", "2027–2031", "2032–2040 or unresolved longer"],
      ["2027–2030", "2029–2035", "2035–2050 or absent"],
      ["2028–2033", "2034–2045", "2050–2075 or absent"],
      ["2030–2036", "2038–2052", "2060–2090 or absent"],
      ["2031–2038", "2040–2060", "2070–2100+ or absent"],
      ["2032–2040", "2045–2065", "2075–2100+ or absent"],
      ["2034–2045", "2050–2075", "After 2100 or absent"],
      ["2038–2050", "2060–2100 conditional", "After 2100 or absent"],
      ["2030–2038", "2038–2055", "2060+ or absent"],
      ["2030–2040", "2040–2060", "2060+ or absent"],
      ["2035–2048", "2048–2075", "After 2075 or absent"],
      ["2040–2055", "2055–2090", "After 2100 or absent"],
    ];
    expect(
      MILESTONES.map((m) => SCENARIOS.map((s) => m.windows[s.id].label)),
    ).toEqual(expected);
  });
  it("represents non-arrival, open and conditional windows independently", () => {
    expect(
      MILESTONES.find((m) => m.id === "late-3")!.windows.central.conditional,
    ).toBe(true);
    expect(
      MILESTONES.find((m) => m.id === "mid-3")!.windows.slow,
    ).toMatchObject({ start: 2100, end: null, open: true, nonArrival: true });
    expect(MILESTONES[0].windows.slow.nonArrival).toBeUndefined();
    expect(VERIFICATION_REQUIREMENTS).toHaveLength(12);
  });
  it("computes illustrative ages without suppressing uncertainty", () => {
    expect([2042, 2057, 2072, 2077].map((y) => ageAt(y, 19, 2026))).toEqual([
      35, 50, 65, 70,
    ]);
    expect(
      ageWindow(
        MILESTONES.find((m) => m.id === "agi")!.windows.central,
        19,
        2026,
      ),
    ).toBe("Age ≈27–38");
    expect(
      ageWindow(MILESTONES.find((m) => m.id === "e3")!.windows.slow, 19, 2026),
    ).toBe("Age ≈93+ · or absent");
  });
});
describe("Hypothetical imports", () => {
  const imported = {
    schemaVersion: 1,
    kind: "user-hypothesis",
    title: "Test possibility",
    windows: {
      agi: {
        central: { label: "2040–2050 hypothetical", start: 2040, end: 2050 },
      },
    },
  };
  it("applies sparse user edits without mutating originals or other scenarios", () => {
    const original = JSON.stringify(MILESTONES);
    const parsed = parseHypothesis(JSON.stringify(imported));
    const edited = applyHypothesis(parsed).find((m) => m.id === "agi")!;
    expect(edited.windows.central.start).toBe(2040);
    expect(edited.windows.fast.label).toBe("2028–2033");
    expect(JSON.stringify(MILESTONES)).toBe(original);
    expect(
      applyHypothesis(null).find((m) => m.id === "agi")!.windows.central.start,
    ).toBe(2034);
  });
  it.each([
    { ...imported, kind: "original" },
    { ...imported, windows: { unknown: {} } },
    {
      ...imported,
      windows: { agi: { central: { label: "Bad", start: 2050, end: 2040 } } },
    },
    {
      ...imported,
      windows: {
        agi: {
          central: { label: "Bad", start: 2040, end: null, nonArrival: "yes" },
        },
      },
    },
    {
      ...imported,
      windows: { agi: { central: { label: "Bad", start: 0, end: 2050 } } },
    },
  ])("rejects malformed or out-of-scope changes: %j", (bad) =>
    expect(() => parseHypothesis(JSON.stringify(bad))).toThrow(),
  );
});
