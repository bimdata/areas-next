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
  }

  return renderer.vue.h("div", options);
}

export default renderZone;
