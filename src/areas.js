import { validateLayout, setLayoutIds } from "./layout.js";
import { deepCopy, makeLayoutIterable, makeIdManager } from "./utils.js";
import {
  makeDeleteFeature,
  makeGetParentFeature,
  makeGetZoneFeature,
  makeResizeFeature,
  makeSplitFeature,
  makeSwapFeature,
} from "./features/index.js";

function make(layoutData) {
  const areas = {
    layout: null, // readonly
    zoneIdManager: makeIdManager(),
    containerIdManager: makeIdManager(),
  };

  let layout = deepCopy(layoutData);
  makeLayoutIterable(layout);

  validateLayout(layout);

  areas.layout = layout;

  setLayoutIds(areas);

  areas.deleteZone = makeDeleteFeature(areas);
  areas.getParent = makeGetParentFeature(areas);
  areas.getZone = makeGetZoneFeature(areas);
  areas.resizeZone = makeResizeFeature(areas);
  areas.splitZone = makeSplitFeature(areas);
  areas.swapZones = makeSwapFeature(areas);

  return areas;
}

export default make;
