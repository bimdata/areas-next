import { validateLayout, setLayoutIds } from "./layout.js";
import { makeObjectIterable, makeIdManager } from "./utils.js";
import {
  makeDeleteFeature,
  makeGetNodesFeature,
  makeGetParentFeature,
  makeGetZoneFeature,
  makeResizeFeature,
  makeSplitFeature,
  makeSplitLayoutFeature,
  makeSwapFeature,
} from "./features/index.js";

function make(layout) {
  const core = {
    layout: null, // readonly
    zoneIdManager: makeIdManager(),
    containerIdManager: makeIdManager(),
  };

  makeObjectIterable(layout);
  validateLayout(layout);
  core.layout = layout;
  setLayoutIds(core);

  core.deleteZone = makeDeleteFeature(core);
  core.getNodes = makeGetNodesFeature(core);
  core.getParent = makeGetParentFeature(core);
  core.getZone = makeGetZoneFeature(core);
  core.resize = makeResizeFeature(core);
  core.splitZone = makeSplitFeature(core);
  core.splitLayout = makeSplitLayoutFeature(core);
  core.swapZones = makeSwapFeature(core);

  return core;
}

export default make;
