import makeAreas from "../src/areas.js";

describe("Split feature", () => {
  let testLayout = null;

  beforeEach(() => {
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    };
  });

  it("Should throw if zone does not exist.", () => {
    const areas = makeAreas(testLayout);

    expect(() => areas.splitZone(3, 80, "row")).toThrow();
  });

  it('Should throw if direction is neither "row" or "column".', () => {
    const areas = makeAreas(testLayout);

    expect(() => areas.splitZone(1, 80, "direcon")).toThrow();
  });

  it("Should return the newly created zone.", () => {
    const areas = makeAreas(testLayout);

    expect(areas.splitZone(1, 80, "row", true).id).toEqual(3);
  });

  it("Should throw if ratio is not a number.", () => {
    const areas = makeAreas(testLayout);

    expect(() => areas.splitZone(1, "a")).toThrow();
  });

  it("Should throw if ratio is lesser than 0 or greater than 100.", () => {
    const areas = makeAreas(testLayout);

    expect(() => areas.splitZone(1, -1)).toThrow();
    expect(() => areas.splitZone(1, 101)).toThrow();
  });

  it("Should split zone at specified ratio. (same direction as the parent container, insert new after)", () => {
    const areas = makeAreas(testLayout);
    areas.splitZone(1, 80, "row", true);

    expect(areas.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 1, type: "zone", ratio: 32 },
        { id: 3, type: "zone", ratio: 8 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    });
  });

  it("Should split zone at specified ratio. (same direction as the parent container, insert new before)", () => {
    const areas = makeAreas(testLayout);
    areas.splitZone(1, 80, "row", false);

    expect(areas.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 3, type: "zone", ratio: 32 },
        { id: 1, type: "zone", ratio: 8 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    });
  });

  it("Should split zone at specified ratio. (different direction of the container, a new container must be created, insert new after)", () => {
    const areas = makeAreas(testLayout);
    areas.splitZone(1, 80, "column", true);

    expect(areas.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 80 });
    expect(areas.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 60 });
    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 20 });

    expect(areas.getParent(areas.getZone(1))).toEqual({
      type: "container",
      direction: "column",
      ratio: 40,
      id: 2,
      children: [
        { id: 1, type: "zone", ratio: 80 },
        { id: 3, type: "zone", ratio: 20 },
      ],
    });
  });

  it("Should split zone at specified ratio. (different direction of the container, a new container must be created, insert new before)", () => {
    const areas = makeAreas(testLayout);
    areas.splitZone(1, 80, "column", false);

    expect(areas.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 20 });
    expect(areas.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 60 });
    expect(areas.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 80 });

    expect(areas.getParent(areas.getZone(1))).toEqual({
      type: "container",
      direction: "column",
      ratio: 40,
      id: 2,
      children: [
        { id: 3, type: "zone", ratio: 80 },
        { id: 1, type: "zone", ratio: 20 },
      ],
    });
  });

  it("Should split in single zone layout. (new container with direction and child position)", () => {
    const areas1 = makeAreas({ id: 1, type: "zone" });
    areas1.splitZone(1, 80, "row", true);

    expect(areas1.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 1, type: "zone", ratio: 80 },
        { id: 2, type: "zone", ratio: 20 },
      ],
    });

    const areas2 = makeAreas({ id: 1, type: "zone" });
    areas2.splitZone(1, 80, "column", true);

    expect(areas2.layout).toEqual({
      type: "container",
      direction: "column",
      id: 1,
      children: [
        { id: 1, type: "zone", ratio: 80 },
        { id: 2, type: "zone", ratio: 20 },
      ],
    });

    const areas3 = makeAreas({ id: 1, type: "zone" });
    areas3.splitZone(1, 80, "row", false);

    expect(areas3.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 2, type: "zone", ratio: 80 },
        { id: 1, type: "zone", ratio: 20 },
      ],
    });

    const areas4 = makeAreas({ id: 1, type: "zone" });
    areas4.splitZone(1, 80, "column", false);

    expect(areas4.layout).toEqual({
      type: "container",
      direction: "column",
      id: 1,
      children: [
        { id: 2, type: "zone", ratio: 80 },
        { id: 1, type: "zone", ratio: 20 },
      ],
    });
  });

  it("Should correctly split a zone with a ratio of 0.", () => {
    const areas = makeAreas({
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 0 },
        { id: 2, type: "zone", ratio: 100 },
      ],
    });
    areas.splitZone(1, 80, "row", false);

    expect(areas.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 3, type: "zone", ratio: 0 },
        { id: 1, type: "zone", ratio: 0 },
        { id: 2, type: "zone", ratio: 100 },
      ],
    });
  });
});
