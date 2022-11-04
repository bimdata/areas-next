import { getContainerChildStyleSizes } from "./utils.js";

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Zone } zone
 */
function renderZone(renderer, zone) {
  const options = {
    ref: renderer.contentManager.getRef(zone.id),
    id: `zone-${zone.id}`,
    class: "areas-zone",
    style: {
      flexGrow: 0,
      overflow: "hidden",
    },
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
  } else {
    options.style = { height: "100%" };
  }

  return renderer.vue.h("div", options);
}

export default renderZone;
