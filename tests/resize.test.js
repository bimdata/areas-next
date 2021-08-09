import makeAreas from "../src/areas";

describe("Resize feature", () => {
  it("Should throw if resize is not a number", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    };

    const areas = makeAreas(testLayout);

    expect(() => areas.resizeZone(1, "string")).toThrow();
  });

  it("Should return false if zone does not exist", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    };

    const areas = makeAreas(testLayout);
    expect(areas.resizeZone(123, 30)).toBeFalsy();

    expect(areas.layout).toEqual(testLayout);
  });

  it("Should update zone ratios when resizing", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 30 },
        {
          type: "container",
          direction: "row",
          ratio: 30,
          children: [
            { id: 3, type: "zone", ratio: 50 },
            { id: 4, type: "zone", ratio: 50 },
          ],
        },
      ],
    };

    const areas = makeAreas(testLayout);
    areas.resizeZone(3, 17);

    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 67 });
    expect(areas.getZone(4)).toEqual({ id: 4, type: "zone", ratio: 33 });

    areas.resizeZone(3, -24);
    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 43 });
    expect(areas.getZone(4)).toEqual({ id: 4, type: "zone", ratio: 57 });
  });

  it("Should return new area ratio when resizing", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 30 },
        {
          type: "container",
          direction: "row",
          ratio: 30,
          children: [
            { id: 3, type: "zone", ratio: 50 },
            { id: 4, type: "zone", ratio: 50 },
          ],
        },
      ],
    };

    const areas = makeAreas(testLayout);

    expect(areas.resizeZone(3, 17)).toEqual(67);
    expect(areas.resizeZone(3, -24)).toEqual(43);
  });

  it("Should return 100 when resizing a single zone layout", () => {
    const testLayout = { id: 1, type: "zone" };

    const areas = makeAreas(testLayout);

    expect(areas.resizeZone(1, 17)).toEqual(100);
    expect(areas.resizeZone(1, -24)).toEqual(100);
  });
});
