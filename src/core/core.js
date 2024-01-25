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
    _layout: null,
    get layout() {
      return this._layout;
    },
    set layout(layout) {
      if (!layout) {
        layout = { type: "zone" }; // nullish layout fallback to a single zone
      }

      makeObjectIterable(layout);
      validateLayout(layout);
      this._layout = layout;
      setLayoutIds(core);
    },
    zoneIdManager: makeIdManager(),
    containerIdManager: makeIdManager(),
  };

  core.layout = layout;

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
