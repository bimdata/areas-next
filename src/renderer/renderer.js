import { createApp, h, ref, triggerRef, toRaw } from "vue";

import renderZone from "./zone.js";
import renderContainer from "./container/container.js";
import { getContainerDimensions } from "./container/utils.js";

/**
 * @param { Element } htmlElement
 * @param { Areas.Core } core
 * @return { Areas.Renderer }
 */
function makeRenderer(htmlElement, core) {
  const layout = ref(core.layout);

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
      return core.getParent(toRaw(containerChild));
    },
    getContainerDimensions(container) {
      return getContainerDimensions(this, container);
    },
    resize(containerChild, value) {
      core.resize(toRaw(containerChild), value);
      triggerRef(layout);
    },
    destroy() {
      resizeObserver.disconnect();
    },
  };

  function buildLayout(layout) {
    if (layout.type === "zone") {
      return renderZone(renderer, layout);
    } else {
      return renderContainer(renderer, layout);
    }
  }

  const app = createApp({
    render() {
      return h("div", { class: "areas-root" }, [buildLayout(layout.value)]);
    },
  });

  renderer.root = app.mount(htmlElement);

  return renderer;
}

export default makeRenderer;
