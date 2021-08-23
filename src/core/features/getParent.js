function makeGetParentFeature(core) {
  return node => {
    if (!node) {
      throw new TypeError(
        "AREAS CORE - fail to get parent: zone is null or undefined"
      );
    }
    if (!core.getNodes().includes(node)) {
      throw new Error("AREAS CORE - fail to get parent: zone does not exist");
    }
    if (core.layout.type === "zone") {
      return null;
    } else {
      return getParent(core.layout, node);
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
