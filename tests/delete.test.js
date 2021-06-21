import makeAreas from "../src/new-project-from-scratch/areas";

describe("Delete feature", () => {
  it("Should delete first zone", () => {
    const areas = makeAreas({
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
    areas.deleteZone(30);
    expect(areas.layout).toEqual({
      type: "container",
      direction: "row",
      children: [
        { id: 31, type: "zone", ratio: 70 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
  });

  it("Should delete middle zone", () => {
    const areas = makeAreas({
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
    areas.deleteZone(31);
    expect(areas.layout).toEqual({
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 55 },
        { id: 32, type: "zone", ratio: 45 },
      ],
    });
  });

  it("Should delete last zone", () => {
    const areas = makeAreas({
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
    areas.deleteZone(32);
    expect(areas.layout).toEqual({
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 60 },
      ],
    });
  });

  // it("Should delete zone on ", () => {
  //   const testLayout = {
  //     id: 21,
  //     type: "container",
  //     direction: "row",
  //     ratio: 60,
  //     children: [
  //       {
  //         id: 30,
  //         type: "zone",
  //         ratio: 40,
  //       },
  //       {
  //         id: 31,
  //         type: "zone",
  //         ratio: 30,
  //       },
  //       {
  //         id: 32,
  //         type: "zone",
  //         ratio: 30,
  //       },
  //     ],
  //   };
  //   const areas = makeAreas(testLayout);
  //   areas.deleteZone(31);
  //   expect(areas.layout).equal();
  // });
});
