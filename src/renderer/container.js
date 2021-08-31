import { h } from "vue";

import renderZone from "./zone.js";

const separatorSize = 3;

function renderContainer(core, container) {
  const options = {
    class: "areas-container",
    id: `container-${container.id}`,
    key: container.id,
    style: {
      height: "100%",
      flexDirection: container.direction,
    },
  };

  const separatorCount = container.children.length - 1;

  const children = container.children.map(child => {
    if (child.type === "zone") {
      return renderZone(
        core,
        child,
        (separatorCount / container.children.length) * separatorSize
      );
    } else {
      return renderContainer(core, child);
    }
  });

  return h("div", options, [children]);
}

export default renderContainer;
