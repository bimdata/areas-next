import makeCore from "./core/core.js";
import makeRenderer from "./renderer/renderer.js";

function makeAreas(htmlElement, layoutData) {
  const core = makeCore(layoutData);
  const renderer = makeRenderer(htmlElement, core);

  const areas = {
    core,
    renderer,
  };

  return areas;
}

export default makeAreas;
