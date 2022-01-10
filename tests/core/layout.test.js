import makeCore from "../../src/core/core.js";
import { validateLayout } from "../../src/core/layout.js";
import { makeObjectIterable } from "../../src/core/utils.js";

describe("Validate layout", () => {
  it("Should throw if layout is an empty object", () => {
    const testLayout = {};
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should throw if layout as an invalid type", () => {
    const testLayout = { type: "unknown" };
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should throw if is a layout container without direction", () => {
    const testLayout = { type: "container" };
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should throw if layout is a container with an invalid direction", () => {
    const testLayout = { type: "container", direction: "unknown" };
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should throw if layout is a container with no children", () => {
    let testLayout = { type: "container", direction: "column" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "row" };
    expect(() => validateLayout(testLayout)).toThrow();
    testLayout = { type: "container", direction: "row", children: [] };
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should throw if layout is a container with invalid child ratios", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        // Sum of child ratios < 100
        { type: "zone", ratio: 40 },
        { type: "zone", ratio: 50 },
      ],
    };
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should return layout if called with a valid zone layout", () => {
    const testLayout = makeObjectIterable({ type: "zone" });
    expect(validateLayout(testLayout)).toEqual(testLayout);
  });

  it("Should return layout if called with a valid container layout", () => {
    const testLayout = makeObjectIterable({
      type: "container",
      direction: "row",
      children: [
        { type: "zone", ratio: 33 },
        { type: "zone", ratio: 67 },
      ],
    });
    expect(validateLayout(testLayout)).toEqual(testLayout);
  });

  it("Should throw if two ids are the same.", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { type: "zone", ratio: 33, id: 1 },
        { type: "zone", ratio: 67, id: 1 },
      ],
    };
    expect(() => validateLayout(testLayout)).toThrow();
  });

  it("Should set missing zone ids in layout", () => {
    const testLayout = {
      id: 10,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 33 },
        { type: "zone", ratio: 67 },
      ],
    };

    const core = makeCore(testLayout);

    expect(core.layout).toEqual({
      id: 10,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 33 },
        { id: 2, type: "zone", ratio: 67 },
      ],
    });
  });

  it("Should set missing container ids in layout", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 33 },
        { id: 2, type: "zone", ratio: 67 },
      ],
    };

    const core = makeCore(testLayout);

    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 33 },
        { id: 2, type: "zone", ratio: 67 },
      ],
    });
  });
});
