import { expect, it } from "vitest";
import { ascii } from "../ascii/text";
import { interval } from "../components/Timeline";
it("converts presentation punctuation and preserves unfamiliar characters as escape sequences", () => {
  expect(ascii("2034–2045 · ≈27 → α")).toBe("2034-2045 . ~27 -> \\u03b1");
  expect(ascii("≥95% ≤20%")).toBe(">=95% <=20%");
});
it("shows bounded and beyond-horizon windows without inventing an arrival", () => {
  expect(
    interval({ label: "2034–2045", start: 2034, end: 2045 }, 2100, 30),
  ).toHaveLength(30);
  expect(
    interval(
      {
        label: "After 2100 or absent",
        start: 2100,
        end: null,
        nonArrival: true,
      },
      2100,
      30,
    ),
  ).toBe(".".repeat(29) + ">");
  expect(
    interval({ label: "2060+", start: 2060, end: null }, 2100, 30),
  ).toMatch(/\[=+>$/);
});
