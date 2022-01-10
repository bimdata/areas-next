import { h } from "vue/dist/vue.esm-bundler.js";

import { getContainerChildStyleSizes } from "./container/utils.js";

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Zone } zone
 */
function renderZone(renderer, zone) {
  const options = {
    ref: renderer.contentManager.getRef(zone.id),
    id: `zone-${zone.id}`,
    class: "areas-zone",
    key: zone.id,
  };

  const container = renderer.getParent(zone);

  if (container) {
    const { width, height } = getContainerChildStyleSizes(
      renderer,
      container,
      zone
    );

    options.style = { width, height };
  }

  return h("div", options);
}

export default renderZone;
