import makeAreas from "../src/areas";

describe("Get parent feature", () => {
  it("Should throw if zone is null or undefined", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const areas = makeAreas(zone1);

    expect(() => areas.getParent()).toThrow();
    expect(() => areas.getParent(null)).toThrow();
  });

  it("Should throw if zone does not exist", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const areas = makeAreas(zone1);

    expect(() => areas.getParent({ id: 2, type: "zone" })).toThrow();
  });

  it("Should return null on a root zone layout", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const areas = makeAreas(zone1);

    expect(areas.getParent(1)).toEqual(null);
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

    const areas = makeAreas(testLayout);

    expect(areas.getParent(areas.getZone(1))).toEqual(testLayout);
    expect(areas.getParent(areas.getZone(2))).toEqual(testLayout);
    expect(areas.getParent(areas.getZone(3))).toEqual(container);
    expect(areas.getParent(areas.getZone(4))).toEqual(container);
    expect(areas.getParent(areas.getParent(areas.getZone(3)))).toEqual(
      testLayout
    );
    expect(areas.getParent({})).toEqual(null);
  });
});
