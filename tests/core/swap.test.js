import makeCore from "../../src/core/core.js";

describe("Swap feature", () => {
  let testLayout = null;

  beforeEach(() => {
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 35 },
        { id: 2, type: "zone", ratio: 45 },
        {
          type: "container",
          direction: "column",
          ratio: 20,
          children: [
            { id: 3, type: "zone", ratio: 50 },
            { id: 4, type: "zone", ratio: 50 },
          ],
        },
      ],
    };
  });

  it("Should throw if src zone does not exist", () => {
    const core = makeCore(testLayout);
    expect(() => core.swapZones(123, 2)).toThrow();
  });

  it("Should throw if target zone does not exist", () => {
    const core = makeCore(testLayout);
    expect(() => core.swapZones(1, 123)).toThrow();
  });

  it("Should swap sibling zones", () => {
    const core = makeCore(testLayout);

    core.swapZones(1, 2);

    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 2, type: "zone", ratio: 35 },
        { id: 1, type: "zone", ratio: 45 },
        {
          id: 2,
          type: "container",
          direction: "column",
          ratio: 20,
          children: [
            { id: 3, type: "zone", ratio: 50 },
            { id: 4, type: "zone", ratio: 50 },
          ],
        },
      ],
    });
  });

  it("Should swap zones on different levels", () => {
    const core = makeCore(testLayout);

    core.swapZones(2, 4);

    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 35 },
        { id: 4, type: "zone", ratio: 45 },
        {
          id: 2,
          type: "container",
          direction: "column",
          ratio: 20,
          children: [
            { id: 3, type: "zone", ratio: 50 },
            { id: 2, type: "zone", ratio: 50 },
          ],
        },
      ],
    });
  });
});
