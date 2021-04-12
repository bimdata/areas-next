const template = document.createElement("template");
template.innerHTML = `
<div class="content">
  <!-- Content will be dynamically inserted here using zone id -->
</div>
<div class="overlay">
  <div class="split-line"></div>
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

.overlay .split-line {
  display: none;
  position: absolute;
  background-color: red;
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

:host([splittable-v]:hover) .overlay {
  display: block;
  background-color: blue;  /* TODO may be configurable with custom CSS prop ... */
  cursor: row-resize;
}

:host([splittable-v]:hover) .overlay .split-line {
  display: block;
  left: 0;
  width: 100%;
  height: 2px;
}

:host([splittable-h]:hover) .overlay {
  display: block;
  background-color: blue;  /* TODO may be configurable with custom CSS prop ... */
  cursor: col-resize;
}

:host([splittable-h]:hover) .overlay .split-line {
  display: block;
  top: 0;
  width: 2px;
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

    this.addEventListener("dragstart", e => this.onDragStart(e));
    this.addEventListener("dragleave", () => this.onDragLeave());
    this.addEventListener("dragenter", e => this.onDragEnter(e));
    this.addEventListener("dragend", () => this.onDragEnd());
    this.addEventListener("dragover", e => this.onDragOver(e));
    this.addEventListener("drop", e => this.onDrop(e));

    this.addEventListener("click", e => this.onClick(e));

    this.addEventListener("mousemove", e => this.onMouseMove(e));
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
    if (
      this.hasAttribute("splittable-v") ||
      this.hasAttribute("splittable-h")
    ) {
      const splitLine = this.shadowRoot.querySelector(".split-line");

      splitLine.style.top = null;
      splitLine.style.left = null;

      const way = this.hasAttribute("splittable-v") ? "vertical" : "horizontal";
      const insertNewAfter = this.root.splitInsert === "after";

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

  /**
   * @param { MouseEvent } e
   */
  onMouseMove(e) {
    if (
      this.hasAttribute("splittable-v") ||
      this.hasAttribute("splittable-h")
    ) {
      const splitLine = this.shadowRoot.querySelector(".split-line");

      const { width, height } = splitLine.getBoundingClientRect();

      splitLine.style.top = null;
      splitLine.style.left = null;

      const { offsetX, offsetY } = e;
      if (this.hasAttribute("splittable-v")) {
        splitLine.style.top = `${offsetY - height / 2}px`;
      }

      if (this.hasAttribute("splittable-h")) {
        splitLine.style.left = `${offsetX - width / 2}px`;
      }
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
