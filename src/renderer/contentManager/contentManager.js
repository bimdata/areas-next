import { h, ref } from "vue/dist/vue.esm-bundler.js";

function makeContentManager() {
  /** @type { Map<number, Areas.Content> } */
  const contents = new Map();
  /** @type { Map<number, Ref> } */
  const zoneRefs = new Map();

  const contentManager = {
    contents,

    /**
     * Creates and return the layout content element which is a hidden `<div>`
     * used to render zones contents before linking them.
     * This method will also populate the `contents` Map of the content manager.
     *
     * @param {Areas.Node} layout areas layout tree
     * @returns {VNode}
     */
    buildLayoutContent(layout) {
      for (const node of layout) {
        if (node.type === "zone" && node.content) {
          contents.set(node.id, { component: node.content, ref: ref(null) });
        }
      }

      return h(
        "div",
        {
          style: { display: "none" },
        },
        [...contents.values()].map(content =>
          h(content.component, { ref: content.ref })
        )
      );
    },

    /**
     * Link contents (from `contents` Map) to their corresponding zone.
     */
    link() {
      [...zoneRefs.entries()].forEach(([zoneId, zoneRef]) => {
        const content = contents.get(zoneId);
        if (!content) return;

        const contentElement = content.ref.value.$el;
        const target = zoneRef.value;

        while (target.lastChild) {
          target.removeChild(target.lastChild);
        }
        target.appendChild(contentElement);
      });
    },

    getRef(zoneId) {
      let zoneRef = zoneRefs.get(zoneId);
      if (!zoneRef) {
        zoneRef = ref(null);
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
    swap(srcZoneId, targetZoneId) {
      const srcContent = contents.get(srcZoneId);
      const targetContent = contents.get(targetZoneId);

      if (!(srcContent && targetContent)) {
        console.warn("[Content Manager] Swap: no content.");
        return;
      }

      contents.set(srcZoneId, targetContent);
      contents.set(targetZoneId, srcContent);

      this.link();
    },
    deleteContent(zoneId) {
      contents.delete(zoneId);
      zoneRefs.delete(zoneId);
    },
  };

  return contentManager;
}

export default makeContentManager;
