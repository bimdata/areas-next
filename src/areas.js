import makeCore from "./core/core.js";
import makeRenderer from "./renderer/renderer.js";

function makeAreas(htmlElement, layoutData) {
  const core = makeCore(layoutData);
  const renderer = makeRenderer(htmlElement, core);

  const areas = Object.freeze({
    core,
    renderer,
    destroy() {
      renderer.destroy();
    },
  });

  return areas;
}

export default makeAreas;
