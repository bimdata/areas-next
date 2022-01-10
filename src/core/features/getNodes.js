function makeGetNodesFeature(core) {
  return () => getDescendants(core.layout, [core.layout]);
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
