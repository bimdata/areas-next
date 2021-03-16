const template = document.createElement("template");
template.innerHTML = `
<div class="content">
  <!-- Content will be dynamically inserted here using zone id -->
</div>
<style>
:host {
  display: block;
  box-sizing: border-box;
  background-color: cornsilk;
  height: 100%;
}

.content {
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

    this._dragging = false;
    this._dragover = false;

    // TODO zone may not be usefull as their unique goal is to have an unique id which is set by the container...
  }

  connectedCallback() {
    this.addEventListener("dragstart", e => this.onDragStart(e));
    this.addEventListener("dragleave", e => this.onDragLeave(e));
    this.addEventListener("dragenter", e => this.onDragEnter(e));
    this.addEventListener("dragend", e => this.onDragEnd(e));
    this.addEventListener("dragover", e => this.onDragOver(e));
    this.addEventListener("drop", e => this.onDrop(e));
  }

  get dragging() {
    return this._dragging;
  }

  get dragover() {
    return this._dragover;
  }

  set dragging(value) {
    this._dragging = value;
  }

  set dragover(value) {
    if (this.dragging) return;
    this._dragover = value;
    if (value) {
      this.style.backgroundColor = "#dcf5d4";
    } else {
      this.style.backgroundColor = "cornsilk";
    }
  }

  /**
   * @returns { HTMLElement }
   */
  get root() {
    const parentHost = this.shadowRoot.host.parentNode.host;
    return parentHost.tagName === "AREAS-ROOT" ? parentHost : parentHost.root;
  }

  get content() {
    return this.shadowRoot.querySelector(".content");
  }

  /**
   * @param { DragEvent }
   */
  onDragStart(dragEvent) {
    this.dragging = true;
    dragEvent.dataTransfer.setData("areas-zoneid", this.getAttribute("id"));
    dragEvent.dataTransfer.effectAllowed = "move";

    if (this.root.dragImage) {
      dragEvent.dataTransfer.setDragImage(
        this.root.dragImage.img,
        this.root.dragImage.xOffset,
        this.root.dragImage.yOffset
      );
    }
  }

  /**
   * @param { DragEvent }
   */
  onDragEnd(dragEvent) {
    this.dragging = false;
  }

  /**
   * @param { DragEvent }
   */
  onDragEnter(dragEvent) {
    if (dragEvent.dataTransfer.types.includes("areas-zoneid")) {
      this.dragover = true;
    }
  }

  /**
   * @param { DragEvent }
   */
  onDragLeave(dragEvent) {
    this.dragover = false;
  }

  /**
   * @param { DragEvent }
   */
  onDragOver(dragEvent) {
    if (dragEvent.dataTransfer.types.includes("areas-zoneid")) {
      dragEvent.preventDefault();
      dragEvent.dataTransfer.dropEffect = "move";
    }
  }

  /**
   * @param { DragEvent }
   */
  onDrop(dragEvent) {
    this.dragover = false;
    const areaId = Number(dragEvent.dataTransfer.getData("areas-zoneid"));

    this.root.swapZones(areaId, Number(this.getAttribute("id")));
  }

  // TODO DEV ONLY START
  static get observedAttributes() {
    return ["id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "id") {
      this.shadowRoot.querySelector(
        ".content"
      ).textContent = `Zone ${newValue}`;
    }
  }
  // TODO DEV ONLY STOP
}

window.customElements.define("areas-zone", AreasZone);

export default AreasZone;
