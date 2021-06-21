import { validateLayout } from "./layout.js";
import { deepCopy } from "./utils.js";
import {
  makeResizeFeature,
  makeSplitFeature,
  makeDeleteFeature,
  makeSwapFeature,
  makeGetZoneFeature,
  makeGetParentFeature,
} from "./features/index.js";

function make(layoutData) {
  const areas = {
    layout: null, // readonly
  };

  let layout = deepCopy(layoutData);
  validateLayout(layout);
  areas.layout = layout;

  areas.resizeZone = makeResizeFeature(areas);
  areas.splitZone = makeSplitFeature(areas);
  areas.deleteZone = makeDeleteFeature(areas);
  areas.swapZones = makeSwapFeature(areas);
  areas.getZone = makeGetZoneFeature(areas);
  areas.getParent = makeGetParentFeature(areas);

  return areas;
}

export default make;
