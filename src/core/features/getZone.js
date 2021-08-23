function makeGetZoneFeature(core) {
  return zoneId => {
    if (core.layout.type === "zone") {
      if (core.layout.id === zoneId) {
        return core.layout;
      } else {
        return null;
      }
    } else {
      return getContainerZone(core.layout, zoneId);
    }
  };
}

function getContainerZone(container, zoneId) {
  for (let child of container.children) {
    if (child.type === "zone") {
      if (child.id === zoneId) {
        return child;
      }
    } else {
      const zone = getContainerZone(child, zoneId);
      if (zone) {
        return zone;
      }
    }
  }

  return null;
}

export default makeGetZoneFeature;
