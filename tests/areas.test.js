import makeAreas from "../src/new-project-from-scratch/areas.js";

const layout = {
  type: "container",
  direction: "row",
  children: [
    {
      type: "zone",
      ratio: 20,
    },
    {
      type: "container",
      direction: "column",
      ratio: 80,
      children: [
        {
          type: "zone",
          ratio: 40,
        },
        {
          type: "container",
          direction: "row",
          ratio: 60,
          children: [
            {
              type: "zone",
              ratio: 40,
              id: 12,
            },
            {
              type: "zone",
              ratio: 30,
            },
            {
              type: "zone",
              ratio: 30,
            },
          ],
        },
      ],
    },
  ],
};

describe("state management", () => {
  it("Should work", () => {
    expect(() => makeAreas(layout)).not.toThrow();
  });
});
