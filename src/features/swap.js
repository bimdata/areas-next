/**
 * @param { Areas.Areas } areas
 */
function makeSwapFeature(areas) {
  return (srcZoneId, destZoneId) => {
    const zoneSrc = areas.getZone(srcZoneId);
    const zoneDest = areas.getZone(destZoneId);

    if (!zoneSrc) {
      throw new Error(
        `AREAS - fail to swap zone ${srcZoneId}: zone does not exist.`
      );
    }
    if (!zoneDest) {
      throw new Error(
        `AREAS - fail to swap to zone ${destZoneId}: zone does not exist.`
      );
    }

    const zoneSrcContainer = areas.getParent(zoneSrc);
    const zoneDestContainer = areas.getParent(zoneDest);

    const zoneSrcIndex = zoneSrcContainer.children.indexOf(zoneSrc);
    const zoneDestIndex = zoneDestContainer.children.indexOf(zoneDest);

    const zoneSrcRatio = zoneSrc.ratio;
    const zoneDestRatio = zoneDest.ratio;

    zoneSrc.ratio = zoneDestRatio;
    zoneDest.ratio = zoneSrcRatio;

    zoneSrcContainer.children[zoneSrcIndex] = zoneDest;
    zoneDestContainer.children[zoneDestIndex] = zoneSrc;
  };
}

export default makeSwapFeature;
