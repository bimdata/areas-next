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
  return layout;
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

export { validateLayout };
