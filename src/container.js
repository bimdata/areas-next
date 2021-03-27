import { clamp, sum } from "./utils.js";

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
    return Array.from(
      this.shadowRoot.querySelectorAll("areas-container, areas-zone")
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

  onSeparatorMove(e) {
    if (this.locked) return;
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

  makeSeparator() {
    const separator = document.createElement("areas-separator");
    separator.setAttribute("direction", this.direction);
    if (this.direction === "column") {
      separator.style.height = `${this.separatorSize}px`;
      if (!this.locked) {
        separator.style.cursor = "ns-resize";
      }
    } else {
      separator.style.width = `${this.separatorSize}px`;
      if (!this.locked) {
        separator.style.cursor = "ew-resize";
      }
    }
    separator.addEventListener("move", e => this.onSeparatorMove(e));

    return separator;
  }

  makeZone(id) {
    const zone = document.createElement("areas-zone");
    zone.setAttribute("id", id);
    zone.setAttribute("draggable", true);

    return zone;
  }
}

function isElementSeparator(element) {
  return element.tagName.toLowerCase() === "areas-separator";
}

const Container = {
  make(layout, separatorSize = 2, locked = false) {
    const container = document.createElement("areas-container");

    container.separatorSize = separatorSize;
    container._locked = locked;

    container.ratios = layout.children.map(child => child.ratio);
    container.direction = layout.direction ?? "row";

    layout.children.forEach((child, i, children) => {
      if (child.type === "zone") {
        if (child.content) {
          // existing zone
          container.shadowRoot.appendChild(child.content);
        } else {
          // new
          container.shadowRoot.appendChild(container.makeZone(child.id));
        }
      } else {
        const childContainer = Container.make(child, separatorSize, locked);

        container.shadowRoot.appendChild(childContainer);
      }
      if (i !== children.length - 1) {
        if (container.direction === "column") {
          container.style.flexDirection = "column";
        } else {
          container.style.flexDirection = "row";
        }
        container.shadowRoot.appendChild(container.makeSeparator());
      }
    });

    return container;
  },
};

window.customElements.define("areas-container", AreasContainer);

export { AreasContainer as default, Container };
