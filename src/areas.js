import { validateLayout } from "./utils.js";
import Zone from "./zone/zone.js";
import Container from "./container/container.js";
import style from "./style.js";

const template = document.createElement("template");
template.innerHTML = style;

class AreasRoot extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Create & append template
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.nextZoneId = 1;
    this._mode = null;

    this.modeAttributes = new Map([
      ["split-v", "splittable-v"],
      ["split-h", "splittable-h"],
      ["swap", "draggable"],
      ["delete", "deletable"],
    ]);
  }

  connectedCallback() {
    if (this.hasAttribute("layout")) {
      const layout = validateLayout(this.getAttribute("layout"));

      this.removeAttribute("layout"); // After validation, the layout attribute is removed because changing it will have no effect.

      this.setZoneIds(layout);

      if (layout.type === "container") {
        const container = new Container(this, layout);

        this.shadowRoot.appendChild(container.el);
      } else {
        const zone = new Zone(this, layout.id);
        this.shadowRoot.appendChild(zone.el);
      }
    }

    // TODO for development only
    window.areas = this;
  }

  static get observedAttributes() {
    return ["locked"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "locked") {
      if (newValue !== "" && newValue !== null) {
        throw new Error(
          "AREAS - locked attribute may be used as boolean attribute with no value."
        );
      }
      const container = this.shadowRoot.querySelector(".container");
      if (!container) return;

      if (newValue === null) {
        // remove lock
        container.locked = false;
      } else {
        // lock containers
        container.locked = true;
      }
    }
  }

  get locked() {
    return this.hasAttribute("locked");
  }

  set locked(value) {
    if (typeof value !== "boolean") {
      throw new Error("AREAS - locked only accepts booleans.");
    }
    if (value) {
      this.setAttribute("locked", "");
    } else {
      this.removeAttribute("locked", true);
    }
  }

  get mode() {
    return this._mode;
  }

  get modeAttribute() {
    return this.modeAttributes.get(this.mode);
  }

  set mode(mode) {
    if (!this.parentElement) {
      throw new Error("AREAS - Areas must be attached to set mode.");
    }
    if (!["delete", "swap", "split-v", "split-h", null].includes(mode)) {
      throw new Error(
        `AREAS - mode only accept "delete", "swap", "split-v", "split-h" and null, get ${mode}`
      );
    }

    this._mode = mode;

    this.zones.forEach(zone =>
      Array.from(this.modeAttributes.values()).forEach(attribute =>
        zone.removeAttribute(attribute)
      )
    );

    this.zones.forEach(zone => zone.setAttribute(this.modeAttribute, true));
  }

  get zones() {
    const zone = this.shadowRoot.querySelector(".zone");
    if (zone) {
      return [zone];
    } else {
      return this.shadowRoot.querySelector(".container").zones;
    }
  }

  get separatorSize() {
    return +this.getAttribute("separator-size") ?? 2; // TODO: handle NaN case
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
        zone.container.deleteZone(zone);
      }
      return true;
    } else {
      return false;
    }
  }

  splitZone(zoneId, way, percentage = 50, insertNewAfter = true) {
    const zone = this.getZone(zoneId);
    if (!zone) return false;

    if (!["vertical", "horizontal"].includes(way)) {
      throw new TypeError(
        `AREAS - Cannot split area this way. Only accept "vertical" or "horizontal", get "${way}".`
      );
    }

    if (percentage > 100 || percentage < 0) {
      throw new TypeError(
        "AREAS - splitZone percentage must be a number between 0 and 100."
      );
    }

    const oldZoneRatio = insertNewAfter ? percentage : 100 - percentage;
    const newZoneRatio = insertNewAfter ? 100 - percentage : percentage;

    const direction = way === "vertical" ? "column" : "row";

    const separatorSize = +this.getAttribute("separator-size") ?? 2;

    const container = zone.container;
    if (!container) {
      // zone is root
      this.shadowRoot.removeChild(zone);

      const oldZone = {
        content: zone,
        type: "zone",
        ratio: oldZoneRatio,
      };

      const newZone = {
        type: "zone",
        ratio: newZoneRatio,
        id: this.nextZoneId++,
      };

      const containerChildren = [oldZone];

      if (insertNewAfter) {
        containerChildren.push(newZone);
      } else {
        containerChildren.unshift(newZone);
      }

      const layout = {
        type: "container",
        direction,
        children: containerChildren,
      };

      this.shadowRoot.appendChild(new Container(this, layout));
    } else {
      // zone is in container
      if (container.direction === direction) {
        // Split in same direction
        const zoneIndex = container.children.indexOf(zone);
        const zoneRatio = container.ratios[zoneIndex];

        const firstRatio = ((zoneRatio * percentage) / 100).toFixed(3);
        const secondRatio = zoneRatio - firstRatio;

        container.ratios.splice(zoneIndex, 1, firstRatio, secondRatio);

        const separator = container.Separator.make(); // TODO doesnt exist anymore
        const newZone = new Zone(this, this.nextZoneId++);
        if (insertNewAfter) {
          const zoneNextSibling = zone.nextSibling;
          if (zoneNextSibling) {
            container.shadowRoot.insertBefore(newZone.el, zoneNextSibling);
            container.shadowRoot.insertBefore(separator, newZone.el);
          } else {
            container.shadowRoot.appendChild(separator);
            container.shadowRoot.appendChild(newZone.el);
          }
        } else {
          container.shadowRoot.insertBefore(separator, zone);
          container.shadowRoot.insertBefore(newZone.el, separator);
        }

        container.setSize();
      } else {
        // Split in cross direction
        const oldZone = {
          content: zone,
          type: "zone",
          ratio: oldZoneRatio,
        };

        const newZone = {
          type: "zone",
          ratio: newZoneRatio,
          id: this.nextZoneId++,
        };

        const containerChildren = [oldZone];

        if (insertNewAfter) {
          containerChildren.push(newZone);
        } else {
          containerChildren.unshift(newZone);
        }

        const layout = {
          type: "container",
          direction,
          children: containerChildren,
        };

        const zoneWidth = zone.style.width;
        const zoneHeight = zone.style.height;

        zone.style.width = null;
        zone.style.height = null;

        const nextSibling = zone.nextSibling;

        // WARNING : this removes the zone from its current location
        const childContainer = this.Container.make(layout, separatorSize);

        childContainer.style.width = zoneWidth;
        childContainer.style.height = zoneHeight;

        if (nextSibling) {
          container.shadowRoot.insertBefore(childContainer, nextSibling);
        } else {
          container.shadowRoot.appendChild(childContainer);
        }
      }
    }
    return true;
  }

  getZone(zoneId) {
    if (typeof zoneId !== "number") {
      throw new TypeError("AREAS - getZone only accept number.");
    }
    const child = this.shadowRoot.firstElementChild;
    if (child.tagName === "AREAS-ZONE") {
      // simple zone layout
      return Number(child.getAttribute("id")) === zoneId ? child : undefined;
    } else {
      return child.getZone(zoneId);
    }
  }

  setZoneIds(layout) {
    if (layout.type === "zone") {
      if (layout.id === null || layout.id === undefined) {
        layout.id = this.nextZoneId++;
      } else if (layout.id >= this.nextZoneId) {
        this.nextZoneId = layout.id + 1;
      }
    } else {
      layout.children.forEach(child => this.setZoneIds(child));
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
