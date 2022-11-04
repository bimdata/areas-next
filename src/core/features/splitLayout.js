import { makeObjectIterable } from "../utils.js";

function makeSplitLayoutFeature(core) {
  return (ratio = 50, direction = "row", insertAfter = true, cfg = null) => {
    const layout = core.layout;

    if (typeof ratio !== "number" || ratio < 0 || ratio > 100) {
      throw new TypeError(
        `AREAS CORE - fail to split layout: invalid ratio ${ratio}, ratio should be a number between 0 and 100.`
      );
    }
    if (direction !== "row" && direction !== "column") {
      throw new TypeError(
        `AREAS CORE - fail to split layout: invalid direction ${direction}, direction should be 'row' or 'column'.`
      );
    }

    const newZone = makeObjectIterable({
      id: core.zoneIdManager.nextId(),
      type: "zone",
      ...cfg,
    });

    const newContainer = makeObjectIterable({
      id: core.containerIdManager.nextId(),
      type: "container",
      direction,
    });

    if (insertAfter) {
      newZone.ratio = Math.floor(100 - ratio);
      layout.ratio = Math.ceil(ratio);
      newContainer.children = [layout, newZone];
    } else {
      newZone.ratio = Math.floor(ratio);
      layout.ratio = Math.ceil(100 - ratio);
      newContainer.children = [newZone, layout];
    }
    core._layout = newContainer;

    return newZone;
  };
}

export default makeSplitLayoutFeature;
