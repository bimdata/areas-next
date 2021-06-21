function makeDeleteFeature(areas) {
  return zoneId => {
    const zone = areas.getZone(zoneId);
    if (!zone) {
      return false;
    }

    const container = areas.getParent(zone);
    if (!container) {
      throw new Error("AREAS - Cannot delete root Zone");
    }

    if (container.children.length > 2) {
      // just remove the zone and dispatch its ratio
      const zoneIndex = container.children.indexOf(zone);
      const previous = container.children[zoneIndex - 1];
      const next = container.children[zoneIndex + 1];

      if (zoneIndex === 0) {
        next.ratio += zone.ratio;
      } else if (zoneIndex === container.children.length - 1) {
        previous.ratio += zone.ratio;
      } else {
        previous.ratio += Math.floor(zone.ratio / 2);
        next.ratio += Math.ceil(zone.ratio / 2);
      }

      container.children = container.children.filter(
        child => child.id !== zoneId
      );
    } else {
      // the container is removed and became the remaining zone
      const zoneIndex = container.children.indexOf(zone);
      const sibling = container.children[zoneIndex === 1 ? 0 : 1];

      const containerParent = areas.getParent(container);
      if (containerParent) {
        const containerRatio = container.ratio;
        sibling.ratio = containerRatio;

        const containerIndex = containerParent.children.indexOf(container);
        containerParent.children.splice(containerIndex, 1, sibling);
      } else {
        // root position
        areas.layout = sibling;
      }
    }

    return zone;
  };
}

export default makeDeleteFeature;
