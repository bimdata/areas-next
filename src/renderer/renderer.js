import {
  createApp,
  h,
  ref,
  shallowRef,
  triggerRef,
  nextTick,
} from "vue/dist/vue.esm-bundler.js";

import renderZone from "./zone.js";
import renderContainer from "./container/container.js";
import { getContainerDimensions } from "./container/utils.js";
import makeContentManager from "./contentManager/contentManager.js";

/**
 * @return { Areas.Renderer }
 */
function makeRenderer() {
  const renderer = {
    get width() {
      return this.widthRef?.value;
    },
    get height() {
      return this.heightRef?.value;
    },
    get separatorSize() {
      return 3;
    },
    getParent(containerChild) {
      return this.core.getParent(containerChild);
    },
    getContainerDimensions(container) {
      return getContainerDimensions(this, container);
    },
    resize(containerChild, value) {
      this.core.resize(containerChild, value);
      triggerRef(this.layout);
    },
    async split(zoneId, ratio, direction, insertAfter) {
      this.core.splitZone(zoneId, ratio, direction, insertAfter);
      triggerRef(this.layout);
      await nextTick();
      this.contentManager.link();
    },
    async delete(zoneId) {
      this.contentManager.deleteZoneContent(zoneId);
      this.core.deleteZone(zoneId);
      triggerRef(this.layout);
      await nextTick();
      this.contentManager.link();
    },
    destroy() {
      this.resizeObserver?.disconnect();
    },
    contentManager: makeContentManager(),
    root: null,
    /**

     * @param {HTMLElement} htmlElement
      * @param { Areas.Core } core
     */
    mount(htmlElement, core) {
      this.core = core;
      this.layout = shallowRef(core.layout);

      const {
        width: initWidth,
        height: initHeight,
      } = htmlElement.getBoundingClientRect();

      this.widthRef = ref(initWidth);
      this.heightRef = ref(initHeight);

      this.resizeObserver = new ResizeObserver(entries =>
        entries.forEach(entry => {
          const { width, height } = entry.target.getBoundingClientRect();

          this.widthRef.value = width;
          this.heightRef.value = height;
        })
      );

      this.resizeObserver.observe(htmlElement);
      const app = createApp({
        mounted() {
          setTimeout(() => renderer.contentManager.link());
        },
        render() {
          return h(
            "div",
            {
              class: "areas-root",
              style: { height: "100%" },
            },
            [
              renderer.contentManager.renderContent(renderer.layout.value),
              buildLayout(renderer.layout.value),
            ]
          );
        },
      });

      this.root = app.mount(htmlElement);

      return app;
    },
  };

  function buildLayout(layout) {
    if (layout.type === "zone") {
      return renderZone(renderer, layout);
    } else {
      return renderContainer(renderer, layout);
    }
  }

  return renderer;
}

export default makeRenderer;
