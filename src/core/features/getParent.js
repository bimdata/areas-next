function makeGetParentFeature(core) {
  return containerChild => {
    if (!containerChild) {
      throw new TypeError(
        "AREAS CORE - fail to get parent: container child is null or undefined"
      );
    }
    if (core.layout.type === "zone") {
      return null;
    } else {
      return getParent(core.layout, containerChild);
    }
  };
}

function getParent(container, containerChild) {
  for (let child of container.children) {
    if (child === containerChild) {
      return container;
    } else if (child.type === "container") {
      const parent = getParent(child, containerChild);
      if (parent) {
        return parent;
      }
    }
  }

  return null;
}

export default makeGetParentFeature;
