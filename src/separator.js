const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
  box-sizing: border-box;
  background-color: black;

  position: relative;
}

.grabber {
  position: absolute;
  opacity: 0;
}
</style>
`;

const GRABBER_MARGIN = 4;

class AreasSeparator extends HTMLElement {
  constructor() {
    super();
    // Create & attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Create & append template
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.direction = this.getAttribute("direction");
    const grabber = document.createElement("div");
    grabber.classList.add("grabber");

    if (this.direction === "column") {
      grabber.style.width = "100%";
      grabber.style.height = `calc(100% + ${GRABBER_MARGIN * 2}px)`;
      grabber.style.transform = `translateY(-${GRABBER_MARGIN}px)`;
    } else {
      grabber.style.width = `calc(100% + ${GRABBER_MARGIN * 2}px)`;
      grabber.style.height = "100%";
      grabber.style.transform = `translateX(-${GRABBER_MARGIN}px)`;
    }

    this.shadowRoot.appendChild(grabber);

    grabber.addEventListener("mousedown", e => this.onMouseDown(e));
  }

  onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    document.addEventListener(
      "mousemove",
      (this.mouseMoveListener = e => this.drag(e))
    );
    document.addEventListener("mouseup", e => this.stopDrag(e));
  }

  drag(e) {
    this.dispatchEvent(
      new CustomEvent("move", {
        detail: e,
      })
    );
  }

  stopDrag() {
    document.removeEventListener("mousemove", this.mouseMoveListener);
  }
}

window.customElements.define("areas-separator", AreasSeparator);

export default AreasSeparator;
