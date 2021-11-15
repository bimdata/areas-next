import { createApp, h, ref, triggerRef, toRaw } from "vue";

import renderZone from "./zone.js";
import renderContainer from "./container.js";

/**
 * @param { Element } htmlElement
 * @param { Areas.Core } core
 * @return { Areas.Renderer }
 */
function makeRenderer(htmlElement, core) {
  const layout = ref(core.layout);

  const renderer = {
    getParent(containerChild) {
      return core.getParent(toRaw(containerChild));
    },
    resize(containerChild, value) {
      core.resize(toRaw(containerChild), value);
      triggerRef(layout);
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
