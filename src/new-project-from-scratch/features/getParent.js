function makeGetParentFeature(areas) {
  return node => {
    if (areas.layout.type === "zone") {
      return null;
    } else {
      return getParent(areas.layout, node);
    }
  };
}

function getParent(container, node) {
  for (let child of container.children) {
    if (child.type === "zone") {
      if (child === node) {
        return container;
      }
    } else {
      const parent = getParent(child, node);
      if (parent) {
        return parent;
      }
    }
  }

  return null;
}

export default makeGetParentFeature;
