import makeCore from "../../src/core/core.js";

describe("Get parent feature", () => {
  it("Should throw if zone is null or undefined", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const core = makeCore(zone1);

    expect(() => core.getParent()).toThrow();
    expect(() => core.getParent(null)).toThrow();
  });

  it("Should return null if zone does not exist", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const core = makeCore(zone1);

    expect(core.getParent({ id: 2, type: "zone" })).toBe(null);
  });

  it("Should return null on a root zone layout", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const core = makeCore(zone1);

    expect(core.getParent(core.getZone(1))).toEqual(null);
  });

  it("Should return the correct parent on a container layout", () => {
    const zone1 = {
      id: 1,
      type: "zone",
      ratio: 40,
    };

    const zone2 = {
      id: 2,
      type: "zone",
      ratio: 30,
    };

    const zone3 = {
      id: 3,
      type: "zone",
      ratio: 50,
    };

    const zone4 = {
      id: 4,
      type: "zone",
      ratio: 50,
    };

    const container = {
      id: 2,
      ratio: 30,
      type: "container",
      direction: "row",
      children: [zone3, zone4],
    };

    const testLayout = {
      id: 1,
      type: "container",
      direction: "row",
      children: [zone1, zone2, container],
    };

    const core = makeCore(testLayout);

    expect(core.getParent(core.getZone(1))).toEqual(testLayout);
    expect(core.getParent(core.getZone(2))).toEqual(testLayout);
    expect(core.getParent(core.getZone(3))).toEqual(container);
    expect(core.getParent(core.getZone(4))).toEqual(container);
    expect(core.getParent(core.getParent(core.getZone(3)))).toEqual(testLayout);
  });
});
