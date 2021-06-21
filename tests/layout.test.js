import { validateLayout } from "../src/layout.js";

describe("Layout utils", () => {
  it("Should validate layout", () => {
    // Invalid node
    let testLayout = {};
    expect(() => validateLayout(testLayout)).toThrow();

    // Invalid node type
    testLayout = { type: "unknown" };
    expect(() => validateLayout(testLayout)).toThrow();

    // Invalid container node
    testLayout = { type: "container" };
    expect(() => validateLayout(testLayout)).toThrow();

    // Valid zone node
    testLayout = { type: "zone" };
    expect(() => validateLayout(testLayout)).not.toThrow();

    // Invalid container direction
    testLayout = { type: "container", direction: "unknown" };
    expect(() => validateLayout(testLayout)).toThrow();

    // Container node with no children
    testLayout = { type: "container", direction: "column" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "row" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "row", children: [] };
    expect(() => validateLayout(testLayout)).toThrow();

    // Invalid zone ratios (sum != 100)
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        { type: "zone", ratio: 40 },
        { type: "zone", ratio: 50 },
      ],
    };
    expect(() => validateLayout(testLayout)).toThrow();

    // Valid layout
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        { type: "zone", ratio: 33 },
        { type: "zone", ratio: 67 },
      ],
    };
    expect(() => validateLayout(testLayout)).not.toThrow();
  });
});
