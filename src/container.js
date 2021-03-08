import { clamp, sum } from "./utils.js";

const template = document.createElement('template');
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
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // Create & append template
    shadowRoot.appendChild( template.content.cloneNode(true) );
  }

  connectedCallback() {
    this.separatorSize = this.getAttribute("separator-size") ?? "2";
    this.direction = this.getAttribute("direction") ?? "row";

    this.ratios = this.getAttributeRatios() ?? this.getDefaultRatios();

    const zoneLength = this.ratios.length;

    this.ratios.forEach((ratio, i) => {
      const zone = document.createElement("areas-zone");
      this.shadowRoot.appendChild(zone);
      if (i !== zoneLength - 1) {
        const separator = document.createElement("areas-separator");
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

    this.setZoneStyles();
  }

  getAttributeRatios() {
    const attributeRatios = this.getAttribute("ratios");
    if (!attributeRatios) return undefined;

    try {
      const parsedAttributeRatios = JSON.parse(attributeRatios);

      if (!Array.isArray(parsedAttributeRatios)) {
        console.warn("AREAS - 'ratios' attribute must be an array of number.");
        return;
      } else if (parsedAttributeRatios.reduce((acc, cur) => acc + cur, 0) !== 100) {
        console.warn("AREAS - Zone ratios sum must be 100.");
        return;
      } else {
        return parsedAttributeRatios
      }
    } catch(err) {
      console.warn(err);
      return;
    }
  }

  getDefaultRatios() {
    const zones = this.shadowRoot.querySelectorAll("areas-zone");
    const ratios = new Array(zones.length).fill(undefined).map(() => 100 / zones.length);
    return ratios;
  }

  setZoneStyles() {
    const zones = Array.from(this.shadowRoot.querySelectorAll("areas-zone")); // TODO cache it !
    if (this.direction === "column") {
      const { height } = this.getBoundingClientRect();
      const zoneSpaceRatio = (height - this.separatorSize * (zones.length - 1)) / height;
      zones.forEach(zone => {
        zone.style.height = `max(0px, ${this.ratios[zones.indexOf(zone)] * zoneSpaceRatio}%)`;
      });
    } else {
      const { width } = this.getBoundingClientRect();
      const zoneSpaceRatio = (width - this.separatorSize * (zones.length - 1)) / width;
      zones.forEach(zone => {
        zone.style.width = `max(0px, ${this.ratios[zones.indexOf(zone)] * zoneSpaceRatio}%)`;
      });
    }
  }

  static get observedAttributes() {
    return [ "separator-size" ];
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

      deltaPercentage = movementY / height * 100;
    } else {
      const { x, width: separatorWidth } = separator.getBoundingClientRect();
      const { clientX } = e.detail;

      const separatorPosition = x + separatorWidth / 2;

      const movementX = clientX - separatorPosition;

      const { width } = this.getBoundingClientRect();

      deltaPercentage = movementX / width * 100;
    }

    const separatorIndex = Array.from(separator.parentNode.children).filter(isElementSeparator).indexOf(separator);

    let ratio1 = this.ratios[separatorIndex];
    let ratio2 = this.ratios[separatorIndex + 1];

    const sumPreAreasRatio = separatorIndex === 0 ? 0 : this.ratios.slice(0, separatorIndex).reduce(sum, 0);
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

    this.setZoneStyles();
  }
}

function isElementSeparator(element) {
return element.tagName.toLowerCase() === "areas-separator";
}

window.customElements.define("areas-container", AreasContainer);

export default AreasContainer;
