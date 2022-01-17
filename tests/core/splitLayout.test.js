import makeCore from "../../src/core/core.js";

describe("Split layout feature", () => {
  let testLayout = null;

  beforeEach(() => {
    testLayout = {
      type: "container",
      direction: "row",
      children: [
        { id: 1, type: "zone", ratio: 40 },
        { id: 2, type: "zone", ratio: 60 },
      ],
    };
  });

  it('Should throw if direction is neither "row" or "column".', () => {
    const core = makeCore(testLayout);

    expect(() => core.splitLayout(50, "no good")).toThrow();
  });

  it("Should throw if ratio is not a number.", () => {
    const core = makeCore(testLayout);

    expect(() => core.splitLayout("a", "row")).toThrow();
  });

  it("Should throw if ratio is lesser than 0 or greater than 100.", () => {
    const core = makeCore(testLayout);

    expect(() => core.splitZone(-1, "row")).toThrow();
    expect(() => core.splitZone(101, "row")).toThrow();
  });
});
