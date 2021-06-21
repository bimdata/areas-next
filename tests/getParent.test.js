import makeAreas from "../src/new-project-from-scratch/areas";

describe("Get parent feature", () => {
  it("Should return null for root", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const areas = makeAreas(zone1);

    expect(areas.getParent(1)).toEqual(null);
  });

  it("Should get parent", () => {
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
      ratio: 30,
      type: "container",
      direction: "row",
      children: [zone3, zone4],
    };

    const testLayout = {
      type: "container",
      direction: "row",
      children: [zone1, zone2, container],
    };

    const areas = makeAreas(testLayout);

    expect(areas.getParent(areas.getZone(1))).toEqual(testLayout);
    expect(areas.getParent(areas.getZone(2))).toEqual(testLayout);
    expect(areas.getParent(areas.getZone(3))).toEqual(container);
    expect(areas.getParent(areas.getZone(4))).toEqual(container);
    expect(areas.getParent({})).toEqual(null);
  });
});
