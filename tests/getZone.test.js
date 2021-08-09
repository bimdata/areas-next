import makeAreas from "../src/areas";

describe("Get zone feature", () => {
  it("Should return the correct zone on a root zone layout.", () => {
    const zone1 = {
      id: 1,
      type: "zone",
    };

    const areas = makeAreas(zone1);

    expect(areas.getZone(1)).toEqual(zone1);
  });

  it("Should return the correct zone on a container layout.", () => {
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

    expect(areas.getZone(1)).toEqual(zone1);
    expect(areas.getZone(2)).toEqual(zone2);
    expect(areas.getZone(3)).toEqual(zone3);
    expect(areas.getZone(4)).toEqual(zone4);
  });

  it("Should return null if zone does not exist", () => {
    const testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 50 },
        { id: 2, type: "zone", ratio: 50 },
      ],
    };

    const areas = makeAreas(testLayout);

    expect(areas.getZone(123)).toEqual(null);
  });
});
