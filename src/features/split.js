function makeSplitFeature(areas) {
  return (zoneId, ratio, direction, insertAfter = true) => {
    const zone = areas.getZone(zoneId);
    if (!zone) {
      throw new Error(
        `AREAS - fail to split zone ${zoneId}: zone does not exist.`
      );
    }
    if (typeof ratio !== "number" || ratio < 0 || ratio > 100) {
      throw new TypeError(
        `AREAS - fail to split zone: invalid ratio ${ratio}, ratio should be a number between 0 and 100.`
      );
    }
    if (direction !== "row" && direction !== "column") {
      throw new TypeError(
        `AREAS - fail to split zone: invalid direction ${direction}, direction should be 'row' or 'column'.`
      );
    }

    const container = areas.getParent(zone);
    const newZone = { id: areas.zoneIdManager.nextId(), type: "zone" };
    if (container) {
      const zoneIndex = container.children.findIndex(child => child === zone);

      if (container.direction === direction) {
        // Add a new zone after/before the target zone in the container children array
        if (insertAfter) {
          newZone.ratio = Math.floor((zone.ratio * (100 - ratio)) / 100);
          zone.ratio = Math.ceil((zone.ratio * ratio) / 100);
          container.children.splice(zoneIndex, 1, zone, newZone);
        } else {
          newZone.ratio = Math.floor((zone.ratio * ratio) / 100);
          zone.ratio = Math.ceil((zone.ratio * (100 - ratio)) / 100);
          container.children.splice(zoneIndex, 1, newZone, zone);
        }
      } else {
        // Add replace the target zone with a new container in the cross direction
        // that contains the target zone and a new zone after/before it
        const newContainer = {
          id: areas.containerIdManager.nextId(),
          type: "container",
          direction,
          ratio: zone.ratio,
        };
        if (insertAfter) {
          newZone.ratio = Math.floor(100 - ratio);
          zone.ratio = Math.ceil(ratio);
          newContainer.children = [zone, newZone];
        } else {
          newZone.ratio = Math.floor(ratio);
          zone.ratio = Math.ceil(100 - ratio);
          newContainer.children = [newZone, zone];
        }
        container.children.splice(zoneIndex, 1, newContainer);
      }
    } else {
      // Single zone layout
      const newContainer = {
        id: areas.containerIdManager.nextId(),
        type: "container",
        direction,
      };
      if (insertAfter) {
        newZone.ratio = Math.floor(100 - ratio);
        zone.ratio = Math.ceil(ratio);
        newContainer.children = [zone, newZone];
      } else {
        newZone.ratio = Math.floor(ratio);
        zone.ratio = Math.ceil(100 - ratio);
        newContainer.children = [newZone, zone];
      }
      areas.layout = newContainer;
    }

    return newZone;
  };
}

export default makeSplitFeature;
