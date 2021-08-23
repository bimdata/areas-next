import makeCore from "./core/core.js";
import makeRenderer from "./renderer/renderer.js";

export default makeAreas;

function makeAreas(htmlElement, layoutData) {
  const core = makeCore(layoutData);
  const renderer = makeRenderer(htmlElement, core);

  const areas = {
    core,
    renderer,
  };

  return areas;
}
