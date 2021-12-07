import { h } from "vue";
import renderSeparator from "./separator.js";

import renderZone from "./zone.js";

const separatorSize = 3;

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 */
function renderContainer(renderer, container, deltaPx = 0) {
  const options = {
    ref: `container-${container.id}`,
    class: "areas-container",
    id: `container-${container.id}`,
    style: {
      height: "100%",
      flexDirection: container.direction,
    },
  };

  const containerParent = renderer.getParent(container);
  if (containerParent) {
    if (containerParent.direction === "column") {
      options.style.height = `calc(${container.ratio}% - ${deltaPx}px)`;
      options.style.width = "100%";
    } else {
      options.style.height = "100%";
      options.style.width = `calc(${container.ratio}% - ${deltaPx}px)`;
    }
  }

  const separatorCount = container.children.length - 1;

  const children = container.children.map((child, i) => {
    if (child.type === "zone") {
      if (i <= separatorCount - 1) {
        return [
          renderZone(
            renderer,
            child,
            (separatorCount / container.children.length) * separatorSize
          ),
          renderSeparator(renderer, container, i),
        ];
      } else {
        return renderZone(
          renderer,
          child,
          (separatorCount / container.children.length) * separatorSize
        );
      }
    } else {
      return renderContainer(
        renderer,
        child,
        (separatorCount / container.children.length) * separatorSize
      );
    }
  });

  return h("div", options, [children]);
}

export default renderContainer;
