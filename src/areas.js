import { validateLayout } from "./utils.js";

class AreasRoot extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    this.attachShadow({ mode: "open" });

    this.zoneId = 1;
  }

  connectedCallback() {
    const layout = validateLayout(this.getAttribute("layout"));
    const separatorSize = +this.getAttribute("separator-size") ?? 2; // TODO: handle NaN case

    if (layout.type === "container") {
      const container = document.createElement("areas-container");
      container.setAttribute("separator-size", separatorSize);
      container.setAttribute("layout", JSON.stringify(layout));

      this.shadowRoot.appendChild(container);
      container.initSize();
    } else {
      const zone = document.createElement("areas-zone");
      zone.setAttribute("id", this.zoneId++);
      this.shadowRoot.appendChild(zone);
    }

    // TODO for development only
    window.areas = this;
  }

  swapZones(zoneId1, zoneId2) {
    if (typeof zoneId1 !== "number" || typeof zoneId2 !== "number") {
      throw new TypeError("AREAS - swapZones only accept numbers.");
    }

    const zone1 = this.getZone(zoneId1);
    const zone2 = this.getZone(zoneId2);

    if (zone1 && zone2) {
      const zone1Content = zone1.content;
      const zone2Content = zone2.content;

      zone1.shadowRoot.replaceChild(zone2Content, zone1Content);
      zone2.shadowRoot.appendChild(zone1Content);

      return true;
    } else {
      return false;
    }
  }

  deleteZone(zoneId) {
    if (typeof zoneId !== "number") {
      throw new TypeError("AREAS - deleteZone only accept number.");
    }
    const zone = this.getZone(zoneId);
    if (zone) {
      if (this.shadowRoot.firstElementChild === zone) {
        throw new Error("AREAS - Cannot delete root zone.");
      } else {
        const zoneContainer = zone.parentNode.host;
        zoneContainer.deleteZone(zone);
      }
      return true;
    } else {
      return false;
    }
  }

  getZone(zoneId) {
    if (typeof zoneId !== "number") {
      throw new TypeError("AREAS - getZone only accept number.");
    }
    const child = this.shadowRoot.firstElementChild;
    if (child.tagName === "AREAS-ZONE") {
      // simple zone layout
      return child.getAttribute("id") === zoneId ? child : undefined;
    } else {
      return child.getZone(zoneId);
    }
  }

  setDragImage(img, xOffset = 0, yOffset = 0) {
    if (!(img instanceof HTMLImageElement)) {
      throw new TypeError(
        "AREAS - first argument of setDragImage must be an HTMLImageElement."
      );
    }
    if (typeof xOffset !== "number" || typeof yOffset !== "number") {
      throw new TypeError(
        'AREAS - setDragImage "xOffset" and "yOffset" must be numbers (or undefined).'
      );
    }

    this.dragImage = {
      img,
      xOffset,
      yOffset,
    };
  }
}

window.customElements.define("areas-root", AreasRoot);

export default AreasRoot;
