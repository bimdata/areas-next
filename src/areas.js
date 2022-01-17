import makeCore from "./core/core.js";
import makeRenderer from "./renderer/renderer.js";

function makeAreas() {
  const renderer = makeRenderer();
  let _core = null;

  const areas = Object.freeze({
    get core() {
      return _core;
    },
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
    splitLayout(ratio, direction, insertAfter) {
      this.renderer.splitLayout(ratio, direction, insertAfter);
    },
    delete(zoneId) {
      return this.renderer.delete(zoneId);
    },
    registerContent(name, content, options) {
      return this.renderer.contentManager.setContent(name, content, options);
    },
    mount(htmlElement, layoutData) {
      _core = makeCore(layoutData);

      this.renderer.mount(htmlElement, this.core);
    },
  });

  return areas;
}

export default makeAreas;
