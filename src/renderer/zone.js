import { h } from "vue";

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Zone } zone
 */
function renderZone(renderer, zone) {
  const container = renderer.getParent(zone);

  const options = {
    class: "areas-zone",
    id: `zone-${zone.id}`,
    key: zone.id,
  };

  if (container) {
    const {
      width: containerWidth,
      height: containerHeight,
    } = renderer.getContainerDimensions(container);

    const separatorCount = container.children.length - 1;

    if (container.direction === "column") {
      const totalSeparatorRatio =
        (separatorCount * renderer.separatorSize) / containerHeight;
      const perZoneSeparatorRatio =
        (separatorCount / container.children.length) * totalSeparatorRatio;

      options.style = {
        height: `${zone.ratio - perZoneSeparatorRatio}%`,
        width: "100%",
      };
    } else {
      const totalSeparatorRatio =
        (separatorCount * renderer.separatorSize) / containerWidth;
      const perZoneSeparatorRatio =
        (separatorCount / container.children.length) * totalSeparatorRatio;

      options.style = {
        height: "100%",
        width: `${zone.ratio - perZoneSeparatorRatio}%`,
      };
    }
  }

  return h("div", options, `zone-id-${zone.id}`);
}

export default renderZone;
