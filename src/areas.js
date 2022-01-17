import makeCore from "./core/core.js";
import { deepCopy } from "./core/utils.js";
import makeRenderer from "./renderer/renderer.js";

function makeAreas() {
  const core = makeCore();
  const renderer = makeRenderer(core);

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
    splitLayout(ratio, direction, insertAfter) {
      this.renderer.splitLayout(ratio, direction, insertAfter);
    },
    delete(zoneId) {
      return this.renderer.delete(zoneId);
    },
    registerContent(name, content, options) {
      return this.renderer.contentManager.setContent(name, content, options);
    },
    mount(el, layoutData) {
      this.core.layout = layoutData;
      this.renderer.mount(el, layoutData);
    },
    get layout() {
      return deepCopy(this.core.layout);
    },
  });

  return areas;
}

export default makeAreas;
