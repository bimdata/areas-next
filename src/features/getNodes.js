function makeGetNodesFeature(areas) {
  return () => getDescendants(areas.layout, [areas.layout]);
}

function getDescendants(node, descendants = []) {
  node.children?.forEach(child => {
    descendants.push(child);
    if (child.type === "container") {
      getDescendants(child, descendants);
    }
  });

  return descendants;
}

export default makeGetNodesFeature;
