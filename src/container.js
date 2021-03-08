import { clamp, sum, validateContainer } from "./utils.js";

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
    this.separatorSize = +this.getAttribute("separator-size") ?? 2; // TODO: handle NaN case
    this.layout = this.getAttributeLayout();
    this.ratios = this.layout.children.map(child => child.ratio);
    this.direction = this.layout.direction ?? "row";

    const childrenLength = this.layout.children.length;

    this.layout.children.forEach((children, i) => {
      if (children.type === "zone") {
        const zone = document.createElement("areas-zone");

        this.shadowRoot.appendChild(zone);
      } else {
        const container = document.createElement("areas-container");
        container.setAttribute("separator-size", this.separatorSize);
        container.setAttribute("layout", JSON.stringify(children));

        this.shadowRoot.appendChild(container);
      }
      if (i !== childrenLength - 1) {
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

  getAttributeLayout() {
    const layoutString = this.getAttribute("layout");
    let layout = null;
    try {
      layout = JSON.parse(layoutString);
    } catch (err) {
      throw new Error("AREAS - Invalid layout. Layout attribute must be a valid JSON object.");
    }

    this.validateLayout(layout);

    return layout;
  }

  validateLayout(layout) {
    validateContainer(layout);
  }

  setZoneStyles() {
    const children = Array.from(this.shadowRoot.querySelectorAll("areas-container, areas-zone")); // TODO cache it !
    if (this.direction === "column") {
      const { height } = this.getBoundingClientRect();
      const childSpaceRatio = (height - this.separatorSize * (children.length - 1)) / height;
      children.forEach(child => {
        child.style.height = `max(0px, ${this.ratios[children.indexOf(child)] * childSpaceRatio}%)`;
      });
    } else {
      const { width } = this.getBoundingClientRect();
      const childSpaceRatio = (width - this.separatorSize * (children.length - 1)) / width;
      children.forEach(child => {
        child.style.width = `max(0px, ${this.ratios[children.indexOf(child)] * childSpaceRatio}%)`;
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
