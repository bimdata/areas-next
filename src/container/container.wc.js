import { clamp, sum } from "../utils.js";

import style from "../style.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

${style}

</style>
`;

class AreasContainer extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Create & append template
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.resizeObserver = new ResizeObserver(() => this.setSize());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  get children() {
    return Array.from(
      this.shadowRoot.querySelectorAll("areas-container, .zone")
    );
  }

  get locked() {
    return this._locked;
  }

  set locked(value) {
    this._locked = value;

    this.shadowRoot
      .querySelectorAll("areas-container")
      .forEach(container => (container.locked = value));

    this.shadowRoot.querySelectorAll("areas-separator").forEach(separator => {
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
    const zones = Array.from(this.shadowRoot.querySelectorAll(".zone"));
    const containers = this.shadowRoot.querySelectorAll("areas-container");
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
      const separators = this.shadowRoot.querySelectorAll("areas-separator");

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

      this.shadowRoot.removeChild(zone);
      this.shadowRoot.removeChild(separator);

      this.setSize();
    } else {
      const sibling = children[index === 1 ? 0 : 1];

      sibling.style.height = null;
      sibling.style.width = null;

      /** @type { HTMLElement} */
      const parentContainer = this.shadowRoot.host.parentNode.host;
      if (parentContainer.tagName === "AREAS-CONTAINER") {
        parentContainer.shadowRoot.replaceChild(sibling, this);
        parentContainer.setSize();
      } else {
        // root
        this.root.shadowRoot.replaceChild(sibling, this);
        if (sibling.tagName === "AREAS-ZONE") {
          // simple zone layout
          sibling.removeAttribute("draggable");
        }
      }
    }
  }

  setSize() {
    const children = this.children;
    if (this.direction === "column") {
      const { height } = this.getBoundingClientRect();
      const childSpaceRatio =
        (height - this.separatorSize * (children.length - 1)) / height;
      children.forEach(child => {
        child.style.height = `max(0px, ${
          this.ratios[children.indexOf(child)] * childSpaceRatio
        }%)`;
      });
    } else {
      const { width } = this.getBoundingClientRect();
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

      const { height } = this.getBoundingClientRect();

      deltaPercentage = (movementY / height) * 100;
    } else {
      const { x, width: separatorWidth } = separator.el.getBoundingClientRect();
      const { clientX } = event;

      const separatorPosition = x + separatorWidth / 2;

      const movementX = clientX - separatorPosition;

      const { width } = this.getBoundingClientRect();

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

window.customElements.define("areas-container", AreasContainer);

export default AreasContainer;
