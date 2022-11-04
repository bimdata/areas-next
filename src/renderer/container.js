import renderSeparator from "./separator.js";

import renderZone from "./zone.js";
import { getContainerChildStyleSizes } from "./utils.js";

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 */
function renderContainer(renderer, container) {
  const options = {
    ref: `container-${container.id}`,
    id: `container-${container.id}`,
    class: "areas-container",
    style: {
      height: "100%",
      display: "flex",
      flexDirection: container.direction,
    },
  };

  const containerParent = renderer.getParent(container);

  if (containerParent) {
    const { width, height } = getContainerChildStyleSizes(
      renderer,
      containerParent,
      container
    );

    options.style.width = width;
    options.style.height = height;
  }

  const separatorCount = container.children.length - 1;

  const children = container.children.map((child, i) => {
    if (i <= separatorCount - 1) {
      return [
        child.type === "zone"
          ? renderZone(renderer, child)
          : renderContainer(renderer, child),
        renderSeparator(renderer, container, i),
      ];
    } else {
      return child.type === "zone"
        ? renderZone(renderer, child)
        : renderContainer(renderer, child);
    }
  });

  return renderer.vue.h("div", options, [children]);
}

export default renderContainer;
