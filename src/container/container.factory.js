import makeSeparatorFactory from "../separator/separator.factory.js";

function makeContainerFactory(areas) {
  const Container = {
    make(layout) {
      const container = document.createElement("areas-container");

      container.root = areas;

      container.Separator = makeSeparatorFactory(container);

      container.separatorSize = areas.separatorSize;
      container._locked = areas.locked;

      container.ratios = layout.children.map(child => child.ratio);
      container.direction = layout.direction ?? "row";

      layout.children.forEach((child, i, children) => {
        if (child.type === "zone") {
          if (child.content) {
            // existing zone
            container.shadowRoot.appendChild(child.content);
          } else {
            // new
            container.shadowRoot.appendChild(areas.Zone.make(child.id));
          }
        } else {
          const childContainer = Container.make(child);

          container.shadowRoot.appendChild(childContainer);
        }
        if (i !== children.length - 1) {
          if (container.direction === "column") {
            container.style.flexDirection = "column";
          } else {
            container.style.flexDirection = "row";
          }
          container.shadowRoot.appendChild(container.Separator.make());
        }
      });

      return container;
    },
  };

  return Container;
}

export default makeContainerFactory;
