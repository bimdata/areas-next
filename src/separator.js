const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  box-sizing: border-box;
  width: 2px;
  cursor: ew-resize;
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

    const separator = document.createElement("div"); // TODO naming

    shadowRoot.host.addEventListener("mousedown", this.onMouseDown);
  }

  static get observedAttributes() {
    return [ 'width' ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "width") {
      this.onWidthChanged(oldValue, newValue);
    }
  }

  onWidthChanged(oldValue, newValue) {
    this.shadowRoot;
  }

  onMouseDown(e) {
    // this.activeSeparatorIndex = separatorIndex;
    e.preventDefault();
    e.stopPropagation();
    // TODO areas cursor not defined !
    // this.areas.cursor = `--areas-global-cursor: ${
    //   this.direction === "row"
    //     ? "var(--areas-vertical-resize-cursor, ew-resize)"
    //     : "var(--areas-horizontal-resize-cursor, ns-resize)"
    // }`;

    document.addEventListener("mousemove", this.mouseMoveListener = e => this.drag(e));
    document.addEventListener("mouseup", e => this.stopDrag(e));
  }

  drag(e) {
    this.dispatchEvent(new CustomEvent("move", {
      detail: e
    }));
  }

  stopDrag(e) {
    // this.activeSeparatorIndex = null;
    // this.areas.cursor = null;
    document.removeEventListener("mousemove", this.mouseMoveListener);
  }
}

window.customElements.define("areas-separator", AreasSeparator);

export default AreasSeparator;
