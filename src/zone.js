const template = document.createElement("template");
template.innerHTML = `
<div>
  Zone
  <!-- Content will be dynamically inserted here using zone id -->
</div>
<style>
:host {
  display: block;
  box-sizing: border-box;
  background-color: cornsilk;
  width: 100%;
  height: 100%;
}
</style>
`;

class AreasZone extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Create & append template
    shadowRoot.appendChild(template.content.cloneNode(true));

    // TODO zone may not be usefull as their unique goal is to have an unique id which is set by the container...
  }
}

window.customElements.define("areas-zone", AreasZone);

export default AreasZone;
