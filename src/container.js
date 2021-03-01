const template = document.createElement('template');
template.innerHTML = `
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

    this.ratios = [50, 50];

    this.setRatios();
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

  connectedCallback() {
    const separator = this.shadowRoot.querySelector("areas-separator");
    separator.addEventListener("move", e => this.onSeparatorMove(e))
  }


  onSeparatorMove(e) {
    this.computeRatio(e);
  }

  computeRatio(e) {
    const { movementX } = e.detail;

    const { width } = this.getBoundingClientRect();

    let [ ratio1, ratio2 ] = this.ratios;

    const deltaPercentage = movementX / width * 100;

    ratio1 = clamp(ratio1 + deltaPercentage, 0, 100);
    ratio2 = clamp(ratio2 - deltaPercentage, 0, 100);

    this.ratios = [ratio1, ratio2];
    this.setRatios();
  }

  setRatios() {
    const [zone1, zone2] = this.shadowRoot.querySelectorAll("areas-zone");

    const [ ratio1, ratio2 ] = this.ratios;

    zone1.style.width = `max(0px, ${ratio1}% - ${this.separatorWidth/2}px)`;
    zone2.style.width = `max(0px, ${ratio2}% - ${this.separatorWidth/2}px)`;
  }
}

function clamp(value, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max);
}

function sum(a, b) {
  return a + b;
}

window.customElements.define("areas-container", AreasContainer);

export default AreasContainer;
