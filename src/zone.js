const template = document.createElement('template');
template.innerHTML = `
<div>
  Zone
  <!-- Content will be dynamically inserted here using zone id -->
</div>
<style>
:host {
  box-sizing: border-box;
  background-color: cornsilk;
}
</style>
`;

class AreasZone extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // Create & append template
    shadowRoot.appendChild( template.content.cloneNode(true) );
  }

}

window.customElements.define("areas-zone", AreasZone);

export default AreasZone;
