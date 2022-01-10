import makeCore from "../../src/core/core.js";

describe("Delete feature", () => {
  it("Should delete first child zone", () => {
    const core = makeCore({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
    core.deleteZone(30);
    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 31, type: "zone", ratio: 70 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
  });

  it("Should delete middle child zone", () => {
    const core = makeCore({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
    core.deleteZone(31);
    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 55 },
        { id: 32, type: "zone", ratio: 45 },
      ],
    });
  });

  it("Should delete last child zone", () => {
    const core = makeCore({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 32, type: "zone", ratio: 30 },
      ],
    });
    core.deleteZone(32);
    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 60 },
      ],
    });
  });

  it("Should delete zone when only 2 child", () => {
    const core = makeCore({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        {
          id: 2,
          type: "container",
          ratio: 30,
          children: [
            { id: 64, type: "zone", ratio: 50 },
            { id: 68, type: "zone", ratio: 50 },
          ],
        },
      ],
    });
    core.deleteZone(64);
    expect(core.layout).toEqual({
      id: 1,
      type: "container",
      direction: "row",
      children: [
        { id: 30, type: "zone", ratio: 40 },
        { id: 31, type: "zone", ratio: 30 },
        { id: 68, type: "zone", ratio: 30 },
      ],
    });
  });
});
