const template = document.createElement("template");
template.innerHTML = `
<div class="content">
  <!-- Content will be dynamically inserted here using zone id -->
</div>
<div class="overlay">
  <!-- Overlay -->
</div>
<style>
:host {
  position: relative;
  display: block;
  box-sizing: border-box;
  background-color: cornsilk;
  height: 100%;
}

.content {
  width: 100%;
  height: 100%;
}

.overlay {
  display: none;
  position: absolute;
  opacity: 0.1;
  z-index: 1000; /* TODO may be configurable ... */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

:host([deletable]:hover) .overlay {
  display: block;
  background-color: red;  /* TODO may be configurable with custom CSS prop ... */
  cursor: crosshair;
}

:host([draggable]:hover) .overlay {
  display: block;
  background-color: green;  /* TODO may be configurable with custom CSS prop ... */
  cursor: grab;
}

:host([splittable]:hover) .overlay {
  display: block;
  background-color: blue;  /* TODO may be configurable with custom CSS prop ... */
  cursor: copy;
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

    this.addEventListener("dragstart", e => this.onDragStart(e));
    this.addEventListener("dragleave", () => this.onDragLeave());
    this.addEventListener("dragenter", e => this.onDragEnter(e));
    this.addEventListener("dragend", () => this.onDragEnd());
    this.addEventListener("dragover", e => this.onDragOver(e));
    this.addEventListener("drop", e => this.onDrop(e));

    this.addEventListener("click", e => this.onClick(e));
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

  get container() {
    const parent = this.parentNode?.host;
    return parent.tagName === "AREAS-CONTAINER" ? parent : undefined;
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

  onDragEnd() {
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

  onDragLeave() {
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

  onClick(e) {
    const zoneId = Number(this.getAttribute("id"));
    if (this.hasAttribute("splittable")) {
      const way = this.root.splitDirection || "vertical"; // TODO think about it
      const insertNewAfter = this.root.splitInsert === "after"; // TODO think about it

      const { offsetX, offsetY } = e;
      let percentage = null;
      if (way === "vertical") {
        percentage = Math.floor(
          (100 * offsetY) / this.getBoundingClientRect().height
        );
      } else {
        percentage = Math.floor(
          (100 * offsetX) / this.getBoundingClientRect().width
        );
      }

      this.root.splitZone(zoneId, way, percentage, insertNewAfter);
    } else if (this.hasAttribute("deletable")) {
      this.root.deleteZone(zoneId);
    }
  }

  // TODO DEV ONLY START
  static get observedAttributes() {
    return ["id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "id") {
      this.shadowRoot.querySelector(
        ".content"
      ).textContent = `Content ${newValue}`;
    }
  }
  // TODO DEV ONLY STOP
}

window.customElements.define("areas-zone", AreasZone);

export default AreasZone;
