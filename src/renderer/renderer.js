import { createApp, h, ref, watch } from "vue";

/**
 * @param { Element } htmlElement
 * @param { Areas.Core } core
 */
function makeRenderer(htmlElement, core) {
  const layout = core.layout;
  const refLayout = ref(layout);

  function buildLayout(layout) {
    if (layout.type === "zone") {
      return renderZone(layout);
    } else {
      return renderContainer(layout);
    }
  }

  /**
   * @param { Areas.Zone } zone
   */
  function renderZone(zone) {
    const container = core.getParent(zone);

    const options = {
      class: "areas-zone",
      id: `zone-${zone.id}`,
      key: zone.id,
    };

    if (container) {
      if (container.direction === "column") {
        options.style = {
          height: `${zone.ratio}%`,
          width: "100%",
        };
      } else {
        options.style = {
          height: "100%",
          width: `${zone.ratio}%`,
        };
      }
    }

    return h("div", options, `zone-id-${zone.id}`);
  }

  /**
   * @param { Areas.Container } container
   */
  function renderContainer(container) {
    const options = {
      class: "areas-container",
      id: `container-${container.id}`,
      key: container.id,
      style: {
        height: "100%",
        flexDirection: container.direction,
      },
    };

    const children = container.children.map(child => {
      if (child.type === "zone") {
        return renderZone(child);
      } else {
        return renderContainer(child);
      }
    });

    return h("div", options, [children]);
  }

  const app = createApp({
    render() {
      let buildedLayout = buildLayout(layout);

      watch(refLayout, () => {
        buildedLayout = buildLayout(layout);
      });

      return h("div", { class: "areas-root" }, [buildedLayout]);
    },
  });

  app.mount(htmlElement);

  return app;
}

export default makeRenderer;
