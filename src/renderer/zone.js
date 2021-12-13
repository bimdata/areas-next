import { h } from "vue/dist/vue.esm-bundler.js";

import { clamp } from "../utils.js";

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Zone } zone
 */
function renderZone(renderer, zone) {
  const container = renderer.getParent(zone);

  const options = {
    id: `zone-${zone.id}`,
    class: "areas-zone",
    key: zone.id,
  };

  if (container) {
    const {
      width: containerWidth,
      height: containerHeight,
    } = renderer.getContainerDimensions(container);

    const separatorCount = container.children.length - 1;

    if (container.direction === "column") {
      const separatorLessRatio =
        1 - (separatorCount * renderer.separatorSize) / containerHeight;

      options.style = {
        height: `${clamp(zone.ratio * separatorLessRatio, 0, 100)}%`,
        width: "100%",
      };
    } else {
      const separatorLessRatio =
        1 - (separatorCount * renderer.separatorSize) / containerWidth;

      options.style = {
        height: "100%",
        width: `${clamp(zone.ratio * separatorLessRatio, 0, 100)}%`,
      };
    }
  }

  return h("div", options, renderer.contentManager.renderZoneContent(zone));
}

export default renderZone;
