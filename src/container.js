import { clamp, sum, validateLayout } from "./utils.js";

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

    if (this.alreadyConnectedOnce) {
      return;
    } else {
      this.alreadyConnectedOnce = true;
    }

    this.separatorSize = +this.getAttribute("separator-size") ?? 2; // TODO: handle NaN case
    this.layout = validateLayout(this.getAttribute("layout"));
    this.ratios = this.layout.children.map(child => child.ratio);
    this.direction = this.layout.direction ?? "row";

    this.layout.children.forEach((child, i, children) => {
      if (child.type === "zone") {
        const zone = document.createElement("areas-zone");
        zone.setAttribute("id", this.root.zoneId++);
        zone.setAttribute("draggable", true);

        this.shadowRoot.appendChild(zone);
      } else {
        const container = document.createElement("areas-container");
        container.setAttribute("separator-size", this.separatorSize);
        container.setAttribute("layout", JSON.stringify(child));

        this.shadowRoot.appendChild(container);
      }
      if (i !== children.length - 1) {
        const separator = document.createElement("areas-separator");
        separator.setAttribute("direction", this.direction);
        if (this.direction === "column") {
          separator.style.height = `${this.separatorSize}px`;
          separator.style.cursor = "ns-resize";
          this.style.flexDirection = "column";
        } else {
          separator.style.width = `${this.separatorSize}px`;
          separator.style.cursor = "ew-resize";
          this.style.flexDirection = "row";
        }
        separator.addEventListener("move", e => this.onSeparatorMove(e));
        this.shadowRoot.appendChild(separator);
      }
    });
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  /**
   * @returns { HTMLElement }
   */
  get root() {
    const parentHost = this.shadowRoot.host.parentNode.host;
    return parentHost.tagName === "AREAS-ROOT" ? parentHost : parentHost.root;
  }

  get children() {
    if (!this._children) {
      this._children = Array.from(
        this.shadowRoot.querySelectorAll("areas-container, areas-zone")
      );
    }

    return this._children;
  }

  getZone(zoneId) {
    for (let child of this.children) {
      if (child.tagName === "AREAS-ZONE") {
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
    const index = this.children.indexOf(zone);
    if (this.children.length > 2) {
      // delete and share ratios to siblings
      const separators = this.shadowRoot.querySelectorAll("areas-separator");

      let separator = null;

      const zoneRatio = this.ratios[index];

      if (index === 0) {
        // first
        const siblingRatio = this.ratios[1];
        this.ratios.splice(index, 2, siblingRatio + zoneRatio);
        separator = separators[index];
      } else if (index === this.children.length - 1) {
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
      const sibling = this.children[index === 1 ? 0 : 1];

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

  initSize() {
    this.setSize();
    const containers = Array.from(
      this.shadowRoot.querySelectorAll("areas-container")
    );
    containers.forEach(container => container.initSize());
  }

  setSize() {
    this._children = null;
    if (this.direction === "column") {
      const { height } = this.getBoundingClientRect();
      const childSpaceRatio =
        (height - this.separatorSize * (this.children.length - 1)) / height;
      this.children.forEach(child => {
        child.style.height = `max(0px, ${
          this.ratios[this.children.indexOf(child)] * childSpaceRatio
        }%)`;
      });
    } else {
      const { width } = this.getBoundingClientRect();
      const childSpaceRatio =
        (width - this.separatorSize * (this.children.length - 1)) / width;
      this.children.forEach(child => {
        child.style.width = `max(0px, ${
          this.ratios[this.children.indexOf(child)] * childSpaceRatio
        }%)`;
      });
    }
  }

  static get observedAttributes() {
    return ["separator-size"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "separator-size") {
      this.onSeparatorSizeChange(newValue);
    }
  }

  onSeparatorSizeChange(value) {
    this.shadowRoot.querySelectorAll("areas-separator").forEach(separator => {
      if (this.direction === "column") {
        separator.style.height = `${value}px`;
      } else {
        separator.style.width = `${value}px`;
      }
    });
  }

  onSeparatorMove(e) {
    const separator = e.currentTarget;

    let deltaPercentage = null;

    if (this.direction === "column") {
      const { y, height: separatorHeight } = separator.getBoundingClientRect();
      const { clientY } = e.detail;

      const separatorPosition = y + separatorHeight / 2;

      const movementY = clientY - separatorPosition;

      const { height } = this.getBoundingClientRect();

      deltaPercentage = (movementY / height) * 100;
    } else {
      const { x, width: separatorWidth } = separator.getBoundingClientRect();
      const { clientX } = e.detail;

      const separatorPosition = x + separatorWidth / 2;

      const movementX = clientX - separatorPosition;

      const { width } = this.getBoundingClientRect();

      deltaPercentage = (movementX / width) * 100;
    }

    const separatorIndex = Array.from(separator.parentNode.children)
      .filter(isElementSeparator)
      .indexOf(separator);

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

function isElementSeparator(element) {
  return element.tagName.toLowerCase() === "areas-separator";
}

window.customElements.define("areas-container", AreasContainer);

export default AreasContainer;
