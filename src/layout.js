function validateLayout(layout) {
  if (layout?.type === "container") {
    validateContainer(layout);
  } else if (layout?.type === "zone") {
    validateZone(layout);
  } else {
    throw new TypeError(
      "AREAS - Layout first child must be a zone or a container."
    );
  }

  testNodeIds(layout);

  return layout;
}

function testNodeIds(layout) {
  const ids = new Set();
  for (let node of layout) {
    if (node.id != undefined) {
      if (ids.has(node.id)) {
        throw new Error("AREAS - Cannot add the same id twice.");
      } else {
        ids.add(node.id);
      }
    }
  }
}

function setNodeIds(layout) {
  const ids = Array.from(layout)
    .map(node => node.id)
    .filter(id => id !== undefined && id !== null)
    .sort((a, b) => a - b);

  let idMax = ids[ids.length - 1] ?? 0;

  Array.from(layout)
    .filter(id => id === undefined || id === null)
    .forEach(node => {
      node.id = ++idMax;
    });
}

function validateZone(zone) {
  if (typeof zone !== "object") {
    throw new TypeError("AREAS - Invalid zone. Zone must be an object.");
  }
  if (zone?.type !== "zone") {
    throw new TypeError('AREAS - Invalid zone. A zone must be of type "zone".');
  }
  return zone;
}

function validateContainer(container) {
  if (typeof container !== "object") {
    throw new TypeError(
      "AREAS - Invalid container. A container must be an object."
    );
  }
  if (container?.type !== "container") {
    throw new TypeError(
      'AREAS - Invalid container. Container must be of type "container".'
    );
  }
  if (
    !!container?.direction &&
    !["row", "column"].includes(container.direction)
  ) {
    throw new TypeError(
      'AREAS - Invalid container. Container direction must be of type "row" or "column".'
    );
  }
  if (container?.children?.length < 2) {
    throw new TypeError(
      "AREAS - Invalid container. Container children must have at least 2 children."
    );
  }
  if (container?.children?.reduce((acc, cur) => acc + cur?.ratio, 0) !== 100) {
    throw new TypeError(
      "AREAS - Invalid container. The sum of container children ratios must be equal to 100."
    );
  }

  return container;
}

export { validateLayout, setNodeIds };
