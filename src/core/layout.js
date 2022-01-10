function validateLayout(layout) {
  if (layout?.type === "container") {
    validateContainer(layout);
  } else if (layout?.type === "zone") {
    validateZone(layout);
  } else {
    throw new TypeError(
      "AREAS CORE - Layout first child must be a zone or a container."
    );
  }

  testNodeIds(layout);

  return layout;
}

function testNodeIds(layout) {
  const zoneIds = new Set();
  const containerIds = new Set();
  for (let node of layout) {
    if (node.id != undefined) {
      if (node.type === "zone") {
        if (zoneIds.has(node.id)) {
          throw new Error("AREAS CORE - Cannot add the same zone id twice.");
        } else {
          zoneIds.add(node.id);
        }
      } else {
        // container
        if (containerIds.has(node.id)) {
          throw new Error(
            "AREAS CORE - Cannot add the same container id twice."
          );
        } else {
          containerIds.add(node.id);
        }
      }
    }
  }
}

function setLayoutIds(core) {
  setIds(core.layout, "zone", core.zoneIdManager);
  setIds(core.layout, "container", core.containerIdManager);
}

function setIds(layout, type, idManager) {
  const nodes = [...layout].filter(node => node.type === type);

  const ids = nodes
    .map(node => node.id)
    .filter(id => id !== undefined && id !== null);

  ids.forEach(id => idManager.add(id));

  nodes
    .filter(node => node.id === undefined || node.id === null)
    .forEach(node => {
      node.id = idManager.nextId();
    });
}

function validateZone(zone) {
  if (typeof zone !== "object") {
    throw new TypeError("AREAS CORE - Invalid zone. Zone must be an object.");
  }
  if (zone?.type !== "zone") {
    throw new TypeError(
      'AREAS CORE - Invalid zone. A zone must be of type "zone".'
    );
  }
  return zone;
}

function validateContainer(container) {
  if (typeof container !== "object") {
    throw new TypeError(
      "AREAS CORE - Invalid container. A container must be an object."
    );
  }
  if (container?.type !== "container") {
    throw new TypeError(
      'AREAS CORE - Invalid container. Container must be of type "container".'
    );
  }
  if (
    !!container?.direction &&
    !["row", "column"].includes(container.direction)
  ) {
    throw new TypeError(
      'AREAS CORE - Invalid container. Container direction must be of type "row" or "column".'
    );
  }
  if (container?.children?.length < 2) {
    throw new TypeError(
      "AREAS CORE - Invalid container. Container children must have at least 2 children."
    );
  }
  if (container?.children?.reduce((acc, cur) => acc + cur?.ratio, 0) !== 100) {
    throw new TypeError(
      "AREAS CORE - Invalid container. The sum of container children ratios must be equal to 100."
    );
  }

  return container;
}

export { validateLayout, setLayoutIds };
