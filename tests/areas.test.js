import makeAreas from "../src/areas.js";

const layout = {
  id: 1,
  type: "container",
  direction: "row",
  children: [
    {
      id: 1,
      type: "zone",
      ratio: 20,
    },
    {
      id: 2,
      type: "container",
      direction: "column",
      ratio: 80,
      children: [
        {
          id: 2,
          type: "zone",
          ratio: 40,
        },
        {
          id: 3,
          type: "container",
          direction: "row",
          ratio: 60,
          children: [
            {
              id: 3,
              type: "zone",
              ratio: 40,
            },
            {
              id: 4,
              type: "zone",
              ratio: 30,
            },
            {
              id: 5,
              type: "zone",
              ratio: 30,
            },
          ],
        },
      ],
    },
  ],
};

describe("Areas engine", () => {
  it("Should make areas", () => {
    expect(() => makeAreas(layout)).not.toThrow();
  });
});
