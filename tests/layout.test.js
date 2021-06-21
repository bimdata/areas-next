import { validateLayout } from "../src/new-project-from-scratch/layout.js";

describe("layout functions", () => {
  it("Should validate layout", () => {
    let testLayout = {};
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "unknown" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "zone" };
    expect(() => validateLayout(testLayout)).not.toThrow();
    testLayout = { type: "container", direction: "unknown" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "column" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "row" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "row", children: [] };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        {
          type: "zone",
          ratio: 40,
        },
        {
          type: "zone",
          ratio: 50,
        },
      ],
    };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        {
          type: "zone",
          ratio: 33,
        },
        {
          type: "zone",
          ratio: 67,
        },
      ],
    };
    expect(() => validateLayout(testLayout)).not.toThrow();
  });
});
