import makeAreas from "../src/areas";

describe("Resize feature", () => {
  it("Should throw if resize value is not a number", () => {
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
      id: 10,
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

  it("Should update zone ratios", () => {
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
            { id: 3, type: "zone", ratio: 40 },
            { id: 4, type: "zone", ratio: 40 },
            { id: 5, type: "zone", ratio: 20 },
          ],
        },
      ],
    };

    const areas = makeAreas(testLayout);
    areas.resizeZone(3, 17);

    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 57 });
    expect(areas.getZone(4)).toEqual({ id: 4, type: "zone", ratio: 23 });

    areas.resizeZone(3, -24);
    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 33 });
    expect(areas.getZone(4)).toEqual({ id: 4, type: "zone", ratio: 47 });
  });

  it("Should return new zone ratio", () => {
    const testLayout = {
      id: 1,
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

  it("Should do nothing if resizing the last child of a container", () => {
    const testLayout = {
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 40 },
        { id: 3, type: "zone", ratio: 20 },
      ],
    };

    const areas = makeAreas(testLayout);

    expect(areas.resizeZone(3, 17)).toEqual(20);
    expect(areas.layout).toEqual(testLayout);
  });

  it("Should ensure that the sum of ratios doesn't exceeds 100", () => {
    const testLayout = {
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 40 },
        { id: 3, type: "zone", ratio: 20 },
      ],
    };

    const areas = makeAreas(testLayout);

    expect(areas.resizeZone(1, 62)).toEqual(80);
    expect(areas.resizeZone(1, 10)).toEqual(80);

    expect(areas.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 80 });
    expect(areas.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 0 });
    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 20 });
  });

  it("Should ensure that the sum of ratios is not less than 100", () => {
    const testLayout = {
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 40 },
        { id: 3, type: "zone", ratio: 20 },
      ],
    };

    const areas = makeAreas(testLayout);

    expect(areas.resizeZone(1, -50)).toEqual(0);
    expect(areas.resizeZone(1, -5)).toEqual(0);

    expect(areas.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 0 });
    expect(areas.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 80 });
    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 20 });
  });
});
