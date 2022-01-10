import makeCore from "../../src/core/core.js";

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
    const core = makeCore(testLayout);

    expect(() => core.splitZone(3, 80, "row")).toThrow();
  });

  it('Should throw if direction is neither "row" or "column".', () => {
    const core = makeCore(testLayout);

    expect(() => core.splitZone(1, 80, "direcon")).toThrow();
  });

  it("Should return the newly created zone.", () => {
    const core = makeCore(testLayout);

    expect(core.splitZone(1, 80, "row", true).id).toEqual(3);
  });

  it("Should throw if ratio is not a number.", () => {
    const core = makeCore(testLayout);

    expect(() => core.splitZone(1, "a")).toThrow();
  });

  it("Should throw if ratio is lesser than 0 or greater than 100.", () => {
    const core = makeCore(testLayout);

    expect(() => core.splitZone(1, -1)).toThrow();
    expect(() => core.splitZone(1, 101)).toThrow();
  });

  it("Should split zone at specified ratio. (same direction as the parent container, insert new after)", () => {
    const core = makeCore(testLayout);
    core.splitZone(1, 80, "row", true);

    expect(core.layout).toEqual({
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
    const core = makeCore(testLayout);
    core.splitZone(1, 80, "row", false);

    expect(core.layout).toEqual({
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
    const core = makeCore(testLayout);
    core.splitZone(1, 80, "column", true);

    expect(core.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 80 });
    expect(core.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 60 });
    expect(core.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 20 });

    expect(core.getParent(core.getZone(1))).toEqual({
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
    const core = makeCore(testLayout);
    core.splitZone(1, 80, "column", false);

    expect(core.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 20 });
    expect(core.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 60 });
    expect(core.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 80 });

    expect(core.getParent(core.getZone(1))).toEqual({
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
    const core1 = makeCore({ id: 1, type: "zone" });
    core1.splitZone(1, 80, "row", true);

    expect(core1.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 1, type: "zone", ratio: 80 },
        { id: 2, type: "zone", ratio: 20 },
      ],
    });

    const core2 = makeCore({ id: 1, type: "zone" });
    core2.splitZone(1, 80, "column", true);

    expect(core2.layout).toEqual({
      type: "container",
      direction: "column",
      id: 1,
      children: [
        { id: 1, type: "zone", ratio: 80 },
        { id: 2, type: "zone", ratio: 20 },
      ],
    });

    const core3 = makeCore({ id: 1, type: "zone" });
    core3.splitZone(1, 80, "row", false);

    expect(core3.layout).toEqual({
      type: "container",
      direction: "row",
      id: 1,
      children: [
        { id: 2, type: "zone", ratio: 80 },
        { id: 1, type: "zone", ratio: 20 },
      ],
    });

    const core4 = makeCore({ id: 1, type: "zone" });
    core4.splitZone(1, 80, "column", false);

    expect(core4.layout).toEqual({
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
    const core = makeCore({
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 0 },
        { id: 2, type: "zone", ratio: 100 },
      ],
    });
    core.splitZone(1, 80, "row", false);

    expect(core.layout).toEqual({
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
