import { h } from "vue";
import renderSeparator from "../separator.js";

import renderZone from "../zone.js";

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 */
function renderContainer(renderer, container) {
  const options = {
    ref: `container-${container.id}`,
    class: "areas-container",
    id: `container-${container.id}`,
    style: {
      height: "100%",
      flexDirection: container.direction,
    },
  };

  const dimension = container.direction === "column" ? "height" : "width";

  const containerSize = renderer.getContainerDimensions(container)[dimension];

  const containerParent = renderer.getParent(container);
  if (containerParent) {
    const separatorCount = container.children.length - 1;

    const separatorsLessRatio =
      1 - (renderer.separatorSize * separatorCount) / containerSize;

    if (containerParent.direction === "column") {
      options.style.height = `${container.ratio * separatorsLessRatio}%`;
      options.style.width = "100%";
    } else {
      options.style.height = "100%";
      options.style.width = `${container.ratio * separatorsLessRatio}%`;
    }
  }

  const separatorCount = container.children.length - 1;

  const children = container.children.map((child, i) => {
    if (child.type === "zone") {
      if (i <= separatorCount - 1) {
        return [
          renderZone(renderer, child),
          renderSeparator(renderer, container, i),
        ];
      } else {
        return renderZone(renderer, child);
      }
    } else {
      return renderContainer(renderer, child);
    }
  });

  return h("div", options, [children]);
}

export default renderContainer;
