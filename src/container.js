import Zone from "../zone.js";
import Separator from "../separator.js";
import { clamp, sum } from "../utils.js";

export default class Container {
  constructor(areas, layout) {
    const el = document.createElement("div");
    el.classList.add("container");

    this.el = el;
    this.areas = areas;

    this.separators = [];

    this.ratios = layout.children.map(child => child.ratio);
    this.direction = layout.direction ?? "row";

    layout.children.forEach((child, i, children) => {
      if (child.type === "zone") {
        if (child.content) {
          // existing zone
          el.appendChild(child.content);
        } else {
          // new
          el.appendChild(new Zone(areas, child.id, this).el);
        }
      } else {
        const childContainer = new Container(areas, child);
        el.appendChild(childContainer.el);
      }
      if (i !== children.length - 1) {
        if (this.direction === "column") {
          el.style.flexDirection = "column";
        } else {
          el.style.flexDirection = "row";
        }
        const separator = new Separator(this);
        this.separators.push(separator);
        el.appendChild(separator.el);
      }
    });

    this.resizeObserver = new ResizeObserver(() => this.setSize());
    this.resizeObserver.observe(el);
  }

  destroy() {
    this.resizeObserver.disconnect();
  }

  get separatorSize() {
    return this.areas.separatorSize;
  }

  get _locked() {
    return this.areas.locked;
  }

  /**
   * @param { Areas.Separator } separator
   */
  getSeparatorIndex(separator) {
    return this.separators.indexOf(separator);
  }

  get children() {
    return Array.from(this.el.children).filter(
      child => !child.classList.contains("separator")
    );
  }

  get locked() {
    return this._locked;
  }

  set locked(value) {
    this._locked = value;

    this.el
      .querySelectorAll(".container")
      .forEach(container => (container.locked = value));

    this.el.querySelectorAll(".separator").forEach(separator => {
      if (this.direction === "column") {
        separator.style.cursor = value ? null : "ns-resize";
      } else {
        separator.style.cursor = value ? null : "ew-resize";
      }
    });
  }

  /**
   * Returs all zones in this container and in its container descendants.
   */
  get zones() {
    const zones = Array.from(this.el.querySelectorAll(".zone"));
    const containers = this.el.querySelectorAll(".container");
    containers.forEach(container => zones.push(...container.zones));

    return zones;
  }

  getZone(zoneId) {
    for (let child of this.children) {
      if (child.classList.contains("zone")) {
        if (child.getAttribute("id") === zoneId.toString()) {
          return child;
        }
      } else {
        const zone = child.getZone(zoneId);
        if (zone) {
          return zone;
        }
      }
    }
  }

  /**
   * @param { HTMLElement } zone
   */
  deleteZone(zone) {
    const children = this.children;
    const index = children.indexOf(zone);
    if (children.length > 2) {
      // delete and share ratios to siblings
      const separators = this.el.querySelectorAll(".separator");

      let separator = null;

      const zoneRatio = this.ratios[index];

      if (index === 0) {
        // first
        const siblingRatio = this.ratios[1];
        this.ratios.splice(index, 2, siblingRatio + zoneRatio);
        separator = separators[index];
      } else if (index === children.length - 1) {
        // last
        const siblingRatio = this.ratios[index - 1];
        this.ratios.splice(index - 1, 2, siblingRatio + zoneRatio);
        separator = separators[index - 1];
      } else {
        // middle
        const previousSiblingRatio = this.ratios[index - 1];
        const nextSiblingRatio = this.ratios[index + 1];
        this.ratios.splice(
          index - 1,
          3,
          previousSiblingRatio + Math.floor(zoneRatio / 2),
          nextSiblingRatio + Math.ceil(zoneRatio / 2)
        );
        separator = separators[index];
      }

      this.el.removeChild(zone);
      this.el.removeChild(separator);

      this.setSize();
    } else {
      const sibling = children[index === 1 ? 0 : 1];

      sibling.style.height = null;
      sibling.style.width = null;

      /** @type { HTMLElement} */
      const parentContainer = this.el.parentNode;
      if (parentContainer.classList.contains("container")) {
        parentContainer.shadowRoot.replaceChild(sibling, this);
        parentContainer.setSize();
      } else {
        // root
        this.areas.shadowRoot.replaceChild(sibling, this);
        if (sibling.classList.contains("zone")) {
          // simple zone layout
          sibling.removeAttribute("draggable");
        }
      }
    }
  }

  setSize() {
    const children = this.children;
    if (this.direction === "column") {
      const { height } = this.el.getBoundingClientRect();
      const childSpaceRatio =
        (height - this.separatorSize * (children.length - 1)) / height;
      children.forEach(child => {
        child.style.height = `max(0px, ${
          this.ratios[children.indexOf(child)] * childSpaceRatio
        }%)`;
      });
    } else {
      const { width } = this.el.getBoundingClientRect();
      const childSpaceRatio =
        (width - this.separatorSize * (children.length - 1)) / width;
      children.forEach(child => {
        child.style.width = `max(0px, ${
          this.ratios[children.indexOf(child)] * childSpaceRatio
        }%)`;
      });
    }
  }

  /**
   * @param { Areas.Separator } separator
   * @param { MouseEvent } event
   */
  onSeparatorMove(separator, event) {
    if (this.locked) return;

    let deltaPercentage = null;

    if (this.direction === "column") {
      const {
        y,
        height: separatorHeight,
      } = separator.el.getBoundingClientRect();
      const { clientY } = event;

      const separatorPosition = y + separatorHeight / 2;

      const movementY = clientY - separatorPosition;

      const { height } = this.el.getBoundingClientRect();

      deltaPercentage = (movementY / height) * 100;
    } else {
      const { x, width: separatorWidth } = separator.el.getBoundingClientRect();
      const { clientX } = event;

      const separatorPosition = x + separatorWidth / 2;

      const movementX = clientX - separatorPosition;

      const { width } = this.el.getBoundingClientRect();

      deltaPercentage = (movementX / width) * 100;
    }

    const separatorIndex = this.getSeparatorIndex(separator);

    let ratio1 = this.ratios[separatorIndex];
    let ratio2 = this.ratios[separatorIndex + 1];

    const sumPreAreasRatio =
      separatorIndex === 0
        ? 0
        : this.ratios.slice(0, separatorIndex).reduce(sum, 0);
    const sumPostAreasRatio =
      separatorIndex === this.ratios.length - 2
        ? 0
        : this.ratios.slice(separatorIndex + 2).reduce(sum, 0);

    const maxRatio = 100 - (sumPreAreasRatio + sumPostAreasRatio);

    ratio1 = clamp(ratio1 + deltaPercentage, 0, maxRatio);
    ratio2 = clamp(ratio2 - deltaPercentage, 0, maxRatio);

    const ratios = this.ratios;

    ratios.splice(separatorIndex, 2, ratio1, ratio2);

    this.ratios = ratios;

    this.setSize();
  }
}
