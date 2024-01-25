import renderZone from "./zone.js";
import renderContainer from "./container.js";
import makeContentManager from "./contentManager.js";

/**
 * @param { Areas.Core } core
 * @param { Object } vue Vue.js 3
 * @param { { separatorSize?: number, separatorDetectionMargin?: number, separatorDetectionZIndex?: number } } [options]
 * @return { Areas.Renderer }
 */
function makeRenderer(core, vue, options = {}) {
  const widthRef = vue.ref(0);
  const heightRef = vue.ref(0);

  const {
    separatorSize = 2,
    separatorDetectionMargin = 10,
    separatorDetectionZIndex = 2,
  } = options;

  const renderer = {
    vue: vue,
    core,
    zones: vue.ref([]),
    get width() {
      return widthRef.value;
    },
    get height() {
      return heightRef.value;
    },
    get separatorSize() {
      return separatorSize;
    },
    get separatorDetectionMargin() {
      return separatorDetectionMargin;
    },
    get separatorDetectionZIndex() {
      return separatorDetectionZIndex;
    },
    getParent(containerChild) {
      return this.core.getParent(containerChild);
    },
    /**
     * After updating the core layout tree structure, it is required to synchronize the UI to reflect the changes.
     *
     * NOTE: a simple resize does not alter the tree structure of the layout, it does not require such a re-synchronization.
     *
     * If core.layout reference is updated, it must be reassigned to renderer.layout,
     * else, a simple `vue.triggerRef` on the renderer.layout is enough (triggerRef=true).
     *
     * @param { boolean } [triggerRef=false]
     */
    async coreLayoutSync(reassignedLayout = false) {
      if (!this.layout) return; // not yet mounted but layout reassigned

      if (reassignedLayout) {
        this.layout.value = this.core.layout;
      } else {
        vue.triggerRef(this.layout);
      }
      await vue.nextTick();
      this.contentManager.link();
    },
    resize(containerChild, value) {
      this.core.resize(containerChild, value);
      vue.triggerRef(this.layout);
    },
    async split(zoneId, ratio, direction, insertAfter, cfg) {
      const coreResult = this.core.splitZone(
        zoneId,
        ratio,
        direction,
        insertAfter,
        cfg
      );
      await this.coreLayoutSync(this.zones.value.length === 1);
      return coreResult;
    },
    async splitLayout(ratio, direction, insertAfter, cfg) {
      const coreResult = this.core.splitLayout(
        ratio,
        direction,
        insertAfter,
        cfg
      );
      await this.coreLayoutSync(true);
      return coreResult;
    },
    async delete(zoneId) {
      let layoutMustBeReassigned = false;

      const zone = this.core.getZone(zoneId);
      if (zone) {
        const zoneParent = this.core.getParent(zone);
        layoutMustBeReassigned =
          zoneParent?.children.length === 2 &&
          this.core.getParent(zoneParent) === null;
      }

      this.contentManager.deleteZoneContent(zoneId);
      const coreResult = this.core.deleteZone(zoneId);

      await this.coreLayoutSync(layoutMustBeReassigned);

      return coreResult;
    },
    async swap(zoneIdA, zoneIdB) {
      const coreResult = this.core.swapZones(zoneIdA, zoneIdB);
      await this.coreLayoutSync();
      return coreResult;
    },
    destroy() {
      this.resizeObserver?.disconnect();
    },
    root: null,
    get component() {
      this.layout = vue.shallowRef(core.layout);

      vue.watch(
        this.layout,
        newLayout => {
          this.zones.value = [...newLayout].filter(
            node => node.type === "zone"
          );
        },
        {
          immediate: true,
        }
      );

      return {
        created() {
          renderer.root = this;
        },
        mounted() {
          const {
            width: initWidth,
            height: initHeight,
          } = this.$el.getBoundingClientRect();

          widthRef.value = initWidth;
          heightRef.value = initHeight;

          renderer.resizeObserver = new ResizeObserver(entries =>
            entries.forEach(entry => {
              const { width, height } = entry.target.getBoundingClientRect();

              widthRef.value = width;
              heightRef.value = height;
            })
          );

          renderer.resizeObserver.observe(this.$el);

          renderer.contentManager.link();
        },
        render() {
          return vue.h(
            "div",
            {
              class: "areas-root",
            },
            [
              renderer.contentManager.renderContent(renderer.layout.value),
              buildLayout(renderer.layout.value),
            ]
          );
        },
      };
    },
  };

  renderer.contentManager = makeContentManager(renderer);

  function buildLayout(layout) {
    if (layout.type === "zone") {
      return renderZone(renderer, layout);
    } else {
      return renderContainer(renderer, layout);
    }
  }

  return renderer;
}

export default makeRenderer;
