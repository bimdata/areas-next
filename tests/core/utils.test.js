import { makeLayoutIterable, makeIdManager } from "../../src/core/utils.js";

describe("Iterable layout", () => {
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

describe("Id Manager", () => {
  it("Should return the available ids.", () => {
    const idManager = makeIdManager();

    expect(idManager.nextId()).toBe(1);
    expect(idManager.nextId()).toBe(2);
    expect(idManager.nextId()).toBe(3);

    expect(idManager.add(4)).toBe(4);
    expect(idManager.add(5)).toBe(5);

    expect(idManager.nextId()).toBe(6);
    expect(idManager.nextId()).toBe(7);
    expect(idManager.nextId()).toBe(8);
  });

  it("Should return if id is available.", () => {
    const idManager = makeIdManager();

    expect(idManager.nextId()).toBe(1);

    expect(idManager.isIdAvailable(1)).toBe(false);
    expect(idManager.isIdAvailable(2)).toBe(true);
  });
});
