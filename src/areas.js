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

    const container = document.createElement("areas-container"); // TODO handle simple zone layout
    container.setAttribute("separator-size", separatorSize);
    container.setAttribute("layout", JSON.stringify(layout));

    this.shadowRoot.appendChild(container);

    container.initSize();

    // TODO for development only
    window.areas = this;
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
}

window.customElements.define("areas-root", AreasRoot);

export default AreasRoot;
