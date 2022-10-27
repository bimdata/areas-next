/**
 * @param { Areas.Areas } core
 */
function makeSwapFeature(core) {
  return (zoneIdA, zoneIdB) => {
    const zoneA = core.getZone(zoneIdA);
    const zoneB = core.getZone(zoneIdB);

    if (!zoneA) {
      throw new Error(
        `AREAS CORE - fail to swap zone ${zoneIdA}: zone does not exist.`
      );
    }
    if (!zoneB) {
      throw new Error(
        `AREAS CORE - fail to swap to zone ${zoneIdB}: zone does not exist.`
      );
    }

    const zoneAContainer = core.getParent(zoneA);
    const zoneBContainer = core.getParent(zoneB);

    const zoneAIndex = zoneAContainer.children.indexOf(zoneA);
    const zoneBIndex = zoneBContainer.children.indexOf(zoneB);

    const zoneARatio = zoneA.ratio;
    const zoneBRatio = zoneB.ratio;

    zoneA.ratio = zoneBRatio;
    zoneB.ratio = zoneARatio;

    zoneAContainer.children[zoneAIndex] = zoneB;
    zoneBContainer.children[zoneBIndex] = zoneA;
  };
}

export default makeSwapFeature;
