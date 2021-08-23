import makeAreas from "../src/areas.js";

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
    const areas = makeAreas(testLayout);
    expect(() => areas.swapZones(123, 2)).toThrow();
  });

  it("Should throw if target zone does not exist", () => {
    const areas = makeAreas(testLayout);
    expect(() => areas.swapZones(1, 123)).toThrow();
  });

  it("Should swap sibling zones", () => {
    const areas = makeAreas(testLayout);

    areas.swapZones(1, 2);

    expect(areas.layout).toEqual({
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
    const areas = makeAreas(testLayout);

    areas.swapZones(2, 4);

    expect(areas.layout).toEqual({
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
