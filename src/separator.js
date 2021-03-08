const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  box-sizing: border-box;
  background-color: black;
}

.grabber {
  position: absolute;
}
</style>
`;

class AreasSeparator extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // Create & append template
    shadowRoot.appendChild( template.content.cloneNode(true) );

    shadowRoot.host.addEventListener("mousedown", this.onMouseDown);
  }

  onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    document.addEventListener("mousemove", this.mouseMoveListener = e => this.drag(e));
    document.addEventListener("mouseup", e => this.stopDrag(e));
  }

  drag(e) {
    this.dispatchEvent(new CustomEvent("move", {
      detail: e
    }));
  }

  stopDrag() {
    document.removeEventListener("mousemove", this.mouseMoveListener);
  }
}

window.customElements.define("areas-separator", AreasSeparator);

export default AreasSeparator;
