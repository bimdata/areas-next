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
    return registeredContents.has(name)
      ? registeredContents.get(name)
      : registeredContents.get("default");
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
          const contentName = zone.content ?? "default";
          zoneContent.set(
            zone.id,
            Object.assign({}, getRegisteredContent(contentName), {
              ref: renderer.vue.ref(null),
              options: { ...zone.options, key: zone.id },
              name: contentName,
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

    /**
     * Swap (switch) the contents of two zones.
     *
     * @param {number} srcZoneId id of the source zone
     * @param {number} targetZoneId id of the target zone
     */
    async swap(srcZoneId, targetZoneId) {
      const srcContent = zoneContent.get(srcZoneId);
      const targetContent = zoneContent.get(targetZoneId);

      if (!(srcContent && targetContent)) {
        console.warn("[Content Manager] Swap: no content.");
        return;
      }

      zoneContent.set(srcZoneId, targetContent);
      zoneContent.set(targetZoneId, srcContent);

      this.link();
    },
    deleteZoneContent(zoneId) {
      zoneContent.delete(zoneId);
      zoneRefs.delete(zoneId);
    },
  };

  return contentManager;
}

export default makeContentManager;
