import { ref, h } from "vue/dist/vue.esm-bundler.js";

import makeContent from "./content.js";

function makeContentManager() {
  /**
   * @type { Map<number, Areas.Content> }
   */
  const contents = new Map();
  const zoneRefs = new Map();

  const contentManager = {
    contents,
    /**
     * @param { Areas.Zone } zone
     */
    renderZoneContent(zone) {
      let content = contents.get(zone.id);

      if (!content) {
        content = makeContent(this, zone.id, zone.content);
        contents.set(zone.id, content);
      }

      return content.render();
    },
    swap(zoneId1, zoneId2) {
      const content1 = contents.get(zoneId1);
      const content2 = contents.get(zoneId2);

      if (!(content1 && content2)) {
        console.warn("no content");
        return;
      }

      const content1Parent = content1.dom.parentElement;
      const content2Parent = content2.dom.parentElement;

      content1Parent.removeChild(content1.dom);
      content2Parent.removeChild(content2.dom);

      content1Parent.appendChild(content2.dom);
      content2Parent.appendChild(content1.dom);

      contents.set(zoneId1, content2);
      contents.set(zoneId2, content1);
    },
    buildLayoutContent(layout) {
      for (const node of layout) {
        if (node.type === "zone" && node.content) {
          const zoneId = node.id;

          contents.set(zoneId, { component: node.content, ref: ref(null) });
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
    getRef(zoneId) {
      let zoneRef = zoneRefs.get(zoneId);
      if (!zoneRef) {
        zoneRef = ref(null);
        zoneRefs.set(zoneId, zoneRef);
      }

      return zoneRef;
    },
    link() {
      [...zoneRefs.entries()].forEach(([zoneId, zoneRef]) => {
        const content = contents.get(zoneId);
        if (!content) return;

        const contentDOM = content.ref.value.$el;

        const target = zoneRef.value;

        while (target.lastChild) {
          target.removeChild(target.lastChild);
        }

        target.appendChild(contentDOM);
      });
    },
  };

  return contentManager;
}

export default makeContentManager;
