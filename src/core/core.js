import { validateLayout, setLayoutIds } from "./layout.js";
import { deepCopy, makeLayoutIterable, makeIdManager } from "./utils.js";
import {
  makeDeleteFeature,
  makeGetNodesFeature,
  makeGetParentFeature,
  makeGetZoneFeature,
  makeResizeFeature,
  makeSplitFeature,
  makeSwapFeature,
} from "./features/index.js";

function make(layoutData) {
  const core = {
    layout: null, // readonly
    zoneIdManager: makeIdManager(),
    containerIdManager: makeIdManager(),
  };

  let layout = deepCopy(layoutData);
  makeLayoutIterable(layout);

  validateLayout(layout);

  core.layout = layout;

  setLayoutIds(core);

  core.deleteZone = makeDeleteFeature(core);
  core.getNodes = makeGetNodesFeature(core);
  core.getParent = makeGetParentFeature(core);
  core.getZone = makeGetZoneFeature(core);
  core.resizeZone = makeResizeFeature(core);
  core.splitZone = makeSplitFeature(core);
  core.swapZones = makeSwapFeature(core);

  return core;
}

export default make;