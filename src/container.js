import { clamp, sum } from "./utils.js";

const template = document.createElement('template');
template.innerHTML = `
<areas-zone></areas-zone>
<areas-separator></areas-separator>
<areas-zone></areas-zone>
<areas-separator></areas-separator>
<areas-zone></areas-zone>
<areas-separator></areas-separator>
<areas-zone></areas-zone>
<areas-separator></areas-separator>
<areas-zone></areas-zone>
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

    this.separatorWidth = this.getAttribute("separator-width") ?? "2";
    this.direction = this.getAttribute("direction") ?? "row";

    this.shadowRoot.querySelector("areas-separator").style.width = `${this.separatorWidth}px`;

    this.ratios = this.getAttributeRatios() ?? this.getDefaultRatios();
  }

  connectedCallback() {
    const separators = this.shadowRoot.querySelectorAll("areas-separator");
    separators.forEach(
      separator => separator.addEventListener("move", e => this.onSeparatorMove(e))
    );
  }

  getAttributeRatios() {
    const attributeRatios = this.getAttribute("ratios");
    if (!attributeRatios) return undefined;

    try {
      const parsedAttributeRatios = JSON.parse(attributeRatios);
      const zones = this.shadowRoot.querySelectorAll("areas-zone");

      if (!Array.isArray(parsedAttributeRatios) || parsedAttributeRatios?.length !== zones.length) {
        console.warn("AREAS - You must provide one ratio per zone.");
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

  get ratios() {
    return this._ratios;
  }

  set ratios(value) {
    this._ratios = value;

    const zones = this.shadowRoot.querySelectorAll("areas-zone");

    zones.forEach((zone, i) => {
      zone.style.width = `max(0px, ${this.ratios[i]}% - ${this.separatorWidth * (zones.length - 1) / zones.length}px)`;
    });
  }

  static get observedAttributes() {
    return [ "separator-width" ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "separator-width") {
      this.onSeparatorWidthChange(newValue);
    }
  }

  onSeparatorWidthChange(value) {
    this.shadowRoot.querySelector("areas-separator").style.width = `${value}px`;
  }

  onSeparatorMove(e) {
    const { movementX } = e.detail;

    const { width } = this.getBoundingClientRect();

    const separator = e.currentTarget;

    const separatorIndex = Array.from(separator.parentNode.children).filter(isElementSeparator).indexOf(separator);

    let ratio1 = this.ratios[separatorIndex];
    let ratio2 = this.ratios[separatorIndex + 1];

    const deltaPercentage = movementX / width * 100;

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
  }
}

function isElementSeparator(element) {
return element.tagName.toLowerCase() === "areas-separator";
}

window.customElements.define("areas-container", AreasContainer);

export default AreasContainer;
