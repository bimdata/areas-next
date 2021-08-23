function makeResizeFeature(core) {
  return (zoneId, value) => {
    if (typeof value !== "number") {
      throw new TypeError("AREAS CORE - resize value must be a number.");
    }

    const zone = core.getZone(zoneId);
    if (!zone) {
      throw new Error(
        `AREAS CORE - fail to resize zone ${zoneId}: zone does not exist.`
      );
    }

    const container = core.getParent(zone);
    if (!container) {
      return 100;
    }

    const zoneIndex = container.children.findIndex(child => child === zone);
    const nextZone = container.children[zoneIndex + 1];

    if (nextZone) {
      const totalRatio = zone.ratio + nextZone.ratio;
      let newRatio = zone.ratio + value;
      newRatio = newRatio < 0 ? 0 : newRatio;
      newRatio = newRatio > totalRatio ? totalRatio : newRatio;
      zone.ratio = newRatio;
      nextZone.ratio = totalRatio - newRatio;
    }

    return zone.ratio;
  };
}

export default makeResizeFeature;
