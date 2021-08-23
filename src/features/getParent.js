function makeGetParentFeature(areas) {
  return node => {
    if (!node) {
      throw new TypeError(
        "AREAS - fail to get parent: zone is null or undefined"
      );
    }
    if (!areas.getNodes().includes(node)) {
      throw new Error("AREAS - fail to get parent: zone does not exist");
    }
    if (areas.layout.type === "zone") {
      return null;
    } else {
      return getParent(areas.layout, node);
    }
  };
}

function getParent(container, node) {
  for (let child of container.children) {
    if (child === node) {
      return container;
    } else if (child.type === "container") {
      const parent = getParent(child, node);
      if (parent) {
        return parent;
      }
    }
  }

  return null;
}

export default makeGetParentFeature;
