import { validateLayout } from "./utils.js";

class AreasRoot extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const layout = validateLayout(this.getAttribute("layout"));
    const separatorSize = +this.getAttribute("separator-size") ?? 2; // TODO: handle NaN case

    const container = document.createElement("areas-container");
    container.setAttribute("separator-size", separatorSize);
    container.setAttribute("layout", JSON.stringify(layout));

    this.shadowRoot.appendChild(container);

    container.initSize();
  }
}

window.customElements.define("areas-root", AreasRoot);

export default AreasRoot;