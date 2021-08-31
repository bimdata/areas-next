import { createApp, h, ref, watch } from "vue";

import renderZone from "./zone.js";
import renderContainer from "./container.js";

/**
 * @param { Element } htmlElement
 * @param { Areas.Core } core
 */
function makeRenderer(htmlElement, core) {
  const layout = core.layout;
  const refLayout = ref(layout);

  function buildLayout(layout) {
    if (layout.type === "zone") {
      return renderZone(core, layout);
    } else {
      return renderContainer(core, layout);
    }
  }

  const app = createApp({
    render() {
      let buildedLayout = buildLayout(layout);

      watch(refLayout, () => {
        buildedLayout = buildLayout(layout);
      });

      return h("div", { class: "areas-root" }, [buildedLayout]);
    },
  });

  app.mount(htmlElement);

  return app;
}

export default makeRenderer;
