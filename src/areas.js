import { validateLayout } from "./layout.js";
import { deepCopy } from "./utils.js";
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
  };

  let layout = deepCopy(layoutData);
  validateLayout(layout);
  areas.layout = layout;

  areas.deleteZone = makeDeleteFeature(areas);
  areas.getParent = makeGetParentFeature(areas);
  areas.getZone = makeGetZoneFeature(areas);
  areas.resizeZone = makeResizeFeature(areas);
  areas.splitZone = makeSplitFeature(areas);
  areas.swapZones = makeSwapFeature(areas);

  return areas;
}

export default make;
