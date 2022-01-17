import makeCore from "../../src/core/core.js";

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

    const core = makeCore(testLayout);

    expect(() => core.resize(1, "string")).toThrow();
  });

  it("Should throw if zone does not exist", () => {
    const testLayout = {
      id: 10,
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    };

    const core = makeCore(testLayout);

    expect(() => core.resize(core.getZone(123), 30)).toThrow();
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

    const core = makeCore(testLayout);
    core.resize(core.getZone(3), 17);

    expect(core.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 57 });
    expect(core.getZone(4)).toEqual({ id: 4, type: "zone", ratio: 23 });

    core.resize(core.getZone(3), -24);
    expect(core.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 33 });
    expect(core.getZone(4)).toEqual({ id: 4, type: "zone", ratio: 47 });
  });

  it("Should throw when resizing a single zone layout", () => {
    const testLayout = { id: 1, type: "zone" };

    const core = makeCore(testLayout);

    expect(() => core.resize(core.getZone(1), 17)).toThrow();
  });

  it("Should return false if resizing the last child of a container", () => {
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

    const core = makeCore(testLayout);

    expect(core.resize(core.getZone(3), 17)).toEqual(false);
    expect(core.layout).toEqual(testLayout);
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

    const core = makeCore(testLayout);

    core.resize(core.getZone(1), 62);
    expect(core.getZone(1).ratio).toEqual(80);
    core.resize(core.getZone(1), 10);
    expect(core.getZone(1).ratio).toEqual(80);

    expect(core.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 80 });
    expect(core.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 0 });
    expect(core.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 20 });
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

    const core = makeCore(testLayout);

    core.resize(core.getZone(1), -50);
    expect(core.getZone(1).ratio).toEqual(0);
    core.resize(core.getZone(1), -5);
    expect(core.getZone(1).ratio).toEqual(0);

    expect(core.getZone(1)).toEqual({ id: 1, type: "zone", ratio: 0 });
    expect(core.getZone(2)).toEqual({ id: 2, type: "zone", ratio: 80 });
    expect(core.getZone(3)).toEqual({ id: 3, type: "zone", ratio: 20 });
  });
});
