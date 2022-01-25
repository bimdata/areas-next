import makeCore from "./core/core.js";
import { deepCopy } from "./core/utils.js";
import makeRenderer from "./renderer/renderer.js";

/**
 * @param { Object } vue Vue.js 3
 * @param { Areas.Layout } layoutData
 * @returns { Areas.Areas }
 */
function makeAreas(vue, layoutData) {
  const core = makeCore(layoutData);
  const renderer = makeRenderer(core, vue);

  const areas = Object.freeze({
    core,
    renderer,
    destroy() {
      renderer.destroy();
    },
    swap(srcZoneId, targetZoneId) {
      return this.renderer.contentManager.swap(srcZoneId, targetZoneId);
    },
    split(zoneId, ratio, direction, insertAfter) {
      return this.renderer.split(zoneId, ratio, direction, insertAfter);
    },
    splitLayout(ratio, direction, insertAfter) {
      return this.renderer.splitLayout(ratio, direction, insertAfter);
    },
    delete(zoneId) {
      return this.renderer.delete(zoneId);
    },
    registerContent(name, content, options) {
      return this.renderer.contentManager.setContent(name, content, options);
    },
    get layout() {
      return deepCopy(this.core.layout);
    },
    get component() {
      return this.renderer.component;
    },
  });

  return areas;
}

export default makeAreas;
