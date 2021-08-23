/**
 * @param { Areas.Areas } core
 */
function makeSwapFeature(core) {
  return (srcZoneId, destZoneId) => {
    const zoneSrc = core.getZone(srcZoneId);
    const zoneDest = core.getZone(destZoneId);

    if (!zoneSrc) {
      throw new Error(
        `AREAS CORE - fail to swap zone ${srcZoneId}: zone does not exist.`
      );
    }
    if (!zoneDest) {
      throw new Error(
        `AREAS CORE - fail to swap to zone ${destZoneId}: zone does not exist.`
      );
    }

    const zoneSrcContainer = core.getParent(zoneSrc);
    const zoneDestContainer = core.getParent(zoneDest);

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
