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
    // EXPOSED API
    /**
     * Swap (switch) the contents of two zones.
     *
     * @param {number} srcZoneId id of the source zone
     * @param {number} targetZoneId id of the target zone
     */
    swap(srcZoneId, targetZoneId) {
      return this.renderer.contentManager.swap(srcZoneId, targetZoneId);
    },
    split(zoneId, ratio, direction, insertAfter) {
      return this.renderer.split(zoneId, ratio, direction, insertAfter);
    },
    delete(zoneId) {
      return this.renderer.delete(zoneId);
    },
  });

  return areas;
}

export default makeAreas;
