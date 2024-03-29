/**
 * @param { Areas.Renderer } renderer
 * @returns { Areas.ContentManager }
 */
function makeContentManager(renderer) {
  /** @type { Map<string, Areas.Content> } */
  const registeredContents = new Map();
  /** @type { Map<number, Areas.ContentInstance> } */
  const zoneContent = new Map();
  /** @type { Map<number, Ref> } */
  const zoneRefs = new Map();

  registeredContents.set("default", {
    component: {
      render() {
        return renderer.vue.h("div", "Default component");
      },
    },
  });

  function getRegisteredContent(name) {
    if (name && !registeredContents.has(name)) {
      console.warn(
        `[AREAS] Content with name ${name} is not registered, fallback to 'default'.`
      );
      name = "default";
    }

    return registeredContents.get(name);
  }

  const contentManager = {
    registerContent(name, component) {
      registeredContents.set(name, {
        name,
        component,
      });
    },
    /**
     * Creates and return the layout content element which is a hidden `<div>`
     * used to render zones contents before linking them.
     *
     * @param {Areas.Node} layout areas layout tree
     * @returns {VNode}
     */
    renderContent(layout) {
      [...layout]
        .filter(node => node.type === "zone")
        .forEach(zone => {
          zoneContent.set(
            zone.id,
            Object.assign({}, getRegisteredContent(zone.content ?? "default"), {
              ref: renderer.vue.ref(null),
              options: { zoneId: zone.id, ...zone.options, key: zone.id },
              name: zone.content ?? "default",
            })
          );
        });

      return renderer.vue.h(
        "div",
        {
          style: { display: "none" },
        },
        [...zoneContent.values()].map(content =>
          renderer.vue.h(content.component, {
            ...content.options,
            ref: content.ref,
          })
        )
      );
    },
    /**
     * Link contents (from `contents` Map) to their corresponding zone.
     */
    link() {
      [...zoneRefs.entries()].forEach(([zoneId, zoneRef]) => {
        const content = zoneContent.get(zoneId);
        if (!content) return;

        const contentElement = content.ref.value.$el;
        const target = zoneRef.value;

        while (target.lastChild) {
          target.removeChild(target.lastChild);
        }
        target.appendChild(contentElement);
      });
    },
    getElementZoneId(el) {
      for (const [zoneId, zoneRef] of [...zoneRefs.entries()]) {
        if (zoneRef.value?.contains(el)) {
          return zoneId;
        }
      }
      return null;
    },
    getRef(zoneId) {
      let zoneRef = zoneRefs.get(zoneId);
      if (!zoneRef) {
        zoneRef = renderer.vue.ref(null);
        zoneRefs.set(zoneId, zoneRef);
      }

      return zoneRef;
    },
    deleteZoneContent(zoneId) {
      zoneContent.delete(zoneId);
      zoneRefs.delete(zoneId);
    },
    clean() {
      zoneContent.clear();
      zoneRefs.clear();
    },
  };

  return contentManager;
}

export default makeContentManager;
