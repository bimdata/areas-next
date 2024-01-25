import makeCore from "./core/core.js";
import { deepCopy } from "./core/utils.js";
import makeRenderer from "./renderer/renderer.js";

/**
 * @param { Areas.Vue } vue Vue.js 3
 * @param { Areas.Layout } [layoutData=null]
 * @param { Areas.AreasOptions } [options=null]
 * @returns { Areas.Areas }
 */
function makeAreas(vue, layoutData = null, options = null) {
  const core = makeCore(layoutData);
  const renderer = makeRenderer(core, vue, options);

  const areas = Object.freeze({
    core,
    renderer,
    destroy() {
      renderer.destroy();
    },
    swap(zoneIdA, zoneIdB) {
      return this.renderer.swap(zoneIdA, zoneIdB);
    },
    split(zoneId, ratio, direction, insertAfter, cfg) {
      return this.renderer.split(zoneId, ratio, direction, insertAfter, cfg);
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
    set layout(layout) {
      this.core.layout = layout;
      this.renderer.contentManager.clean();
      this.renderer.coreLayoutSync(true);
    },
    get component() {
      return this.renderer.component;
    },
    get resizable() {
      return this.renderer.resizable;
    },
    set resizable(value) {
      this.renderer.resizable = value;
    },
  });

  return areas;
}

export default makeAreas;
