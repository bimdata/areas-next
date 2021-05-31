import Separator from "../separator/separator.js";

function makeContainerFactory(areas) {
  const Container = {
    /**
     * @returns { Areas.Container }
     */
    make(layout) {
      const container = document.createElement("areas-container");

      container.root = areas;

      container.separators = [];

      container.getSeparatorIndex = separator => {
        return container.separators.indexOf(separator);
      };

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
          const separator = new Separator(container);
          container.separators.push(separator);
          container.shadowRoot.appendChild(separator.el);
        }
      });

      return container;
    },
  };

  return Container;
}

export default makeContainerFactory;
