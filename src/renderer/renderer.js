import {
  createApp,
  h,
  ref,
  shallowRef,
  triggerRef,
} from "vue/dist/vue.esm-bundler.js";

import renderZone from "./zone.js";
import renderContainer from "./container/container.js";
import { getContainerDimensions } from "./container/utils.js";
import makeContentManager from "./contentManager/contentManager.js";

/**
 * @param { Element } htmlElement
 * @param { Areas.Core } core
 * @return { Areas.Renderer }
 */
function makeRenderer(htmlElement, core) {
  const layout = shallowRef(core.layout);

  const {
    width: initWidth,
    height: initHeight,
  } = htmlElement.getBoundingClientRect();

  const widthRef = ref(initWidth);
  const heightRef = ref(initHeight);

  const resizeObserver = new ResizeObserver(entries =>
    entries.forEach(entry => {
      const { width, height } = entry.target.getBoundingClientRect();

      widthRef.value = height;
      heightRef.value = width;
    })
  );

  resizeObserver.observe(htmlElement);

  const renderer = {
    get width() {
      return widthRef.value;
    },
    get height() {
      return heightRef.value;
    },
    get separatorSize() {
      return 3;
    },
    getParent(containerChild) {
      return core.getParent(containerChild);
    },
    getContainerDimensions(container) {
      return getContainerDimensions(this, container);
    },
    resize(containerChild, value) {
      core.resize(containerChild, value);
      triggerRef(layout);
    },
    destroy() {
      resizeObserver.disconnect();
    },
    contentManager: makeContentManager(),
  };

  function buildLayout(layout) {
    if (layout.type === "zone") {
      return renderZone(renderer, layout);
    } else {
      return renderContainer(renderer, layout);
    }
  }

  const app = createApp({
    mounted() {
      setTimeout(() => {
        // TODO !
        renderer.contentManager.link();
      });
    },
    render() {
      return h(
        "div",
        {
          class: "areas-root",
          style: { height: "100%" },
          mounted() {
            console.log("coucou");
          },
        },
        [
          renderer.contentManager.buildLayoutContent(layout.value),
          buildLayout(layout.value),
        ]
      );
    },
  });

  renderer.root = app.mount(htmlElement);

  return renderer;
}

export default makeRenderer;
