import { makeLayoutIterable } from "../src/utils";

describe("Utilities", () => {
  it("Should return all nodes", () => {
    const node2 = { id: 1, type: "zone", ratio: 40 };
    const node3 = { id: 2, type: "zone", ratio: 30 };
    const node5 = { id: 3, type: "zone", ratio: 50 };
    const node6 = { id: 4, type: "zone", ratio: 50 };

    const node4 = {
      type: "container",
      direction: "row",
      ratio: 30,
      children: [node5, node6],
    };

    const node1 = {
      type: "container",
      direction: "row",
      children: [node2, node3, node4],
    };

    makeLayoutIterable(node1);

    expect([...node1]).toEqual([node1, node2, node3, node4, node5, node6]);
  });
});
