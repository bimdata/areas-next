function makeGetZoneFeature(areas) {
  return zoneId => {
    if (areas.layout.type === "zone") {
      if (areas.layout.id === zoneId) {
        return areas.layout;
      } else {
        return null;
      }
    } else {
      return getContainerZone(areas.layout, zoneId);
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
