import makeCore from "../../src/core/core.js";

describe("Get Nodes feature", () => {
  it("Should return a singleton array for single zone layout", () => {
    const testLayout = { id: 1, type: "zone" };
    const core = makeCore(testLayout);
    expect(core.getNodes()).toEqual([testLayout]);
  });

  it("Should return the list of all nodes", () => {
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
    const nodes = core.getNodes();

    expect(nodes.length).toEqual(6);
    expect(nodes).toEqual(
      expect.arrayContaining([
        testLayout,
        zone1,
        zone2,
        container,
        zone3,
        zone4,
      ])
    );
  });
});
