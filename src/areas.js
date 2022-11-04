import makeCore from "./core/core.js";
import { deepCopy } from "./core/utils.js";
import makeRenderer from "./renderer/renderer.js";

/**
 * @param { Areas.Vue } vue Vue.js 3
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
    swap(zoneIdA, zoneIdB) {
      return this.renderer.swap(zoneIdA, zoneIdB);
    },
    split(zoneId, ratio, direction, insertAfter) {
      return this.renderer.split(zoneId, ratio, direction, insertAfter);
    },
    splitLayout(ratio, direction, insertAfter, cfg) {
      return this.renderer.splitLayout(ratio, direction, insertAfter, cfg);
    },
    delete(zoneId) {
      return this.renderer.delete(zoneId);
    },
    registerContent(name, content) {
      this.renderer.contentManager.registerContent(name, content);
    },
    getElementZoneId(el) {
      return this.renderer.contentManager.getElementZoneId(el);
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
