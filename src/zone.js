const template = document.createElement("template");
template.innerHTML = `
<div class="content">
  <!-- Content will be dynamically inserted here using zone id -->
</div>
<div class="overlay">
  <!-- Overlay -->
  <div class="split-line"></div>
</div>
`;

/**
 * @type { Areas.Zone }
 */
export default class Zone {
  /**
   * @param { Areas.Areas } areas
   * @param { number } id
   * @param { Areas.Container } container
   */
  constructor(areas, id, container = null) {
    this.areas = areas;
    this.id = id;
    this.container = container;

    const el = document.createElement("div");
    el.classList.add("zone");
    el.appendChild(template.content.cloneNode(true));

    this._dragging = false;
    this._dragover = false;

    el.addEventListener("dragstart", e => this.onDragStart(e));
    el.addEventListener("dragleave", () => this.onDragLeave());
    el.addEventListener("dragenter", e => this.onDragEnter(e));
    el.addEventListener("dragend", () => this.onDragEnd());
    el.addEventListener("dragover", e => this.onDragOver(e));
    el.addEventListener("drop", e => this.onDrop(e));

    el.addEventListener("click", e => this.onClick(e));

    el.addEventListener("mousemove", e => this.onMouseMove(e));

    this.el = el;
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
      this.el.style.backgroundColor = "#dcf5d4";
    } else {
      this.el.style.backgroundColor = "cornsilk";
    }
  }

  get content() {
    return this.el.querySelector(".content");
  }

  /**
   * @param { DragEvent }
   */
  onDragStart(dragEvent) {
    this.dragging = true;
    dragEvent.dataTransfer.setData("areas-zoneid", this.id);
    dragEvent.dataTransfer.effectAllowed = "move";

    if (this.areas.dragImage) {
      dragEvent.dataTransfer.setDragImage(
        this.areas.dragImage.img,
        this.areas.dragImage.xOffset,
        this.areas.dragImage.yOffset
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

    this.areas.swapZones(areaId, this.id);
  }

  onClick(e) {
    const zoneId = this.id;
    if (
      this.el.hasAttribute("splittable-v") ||
      this.el.hasAttribute("splittable-h")
    ) {
      const splitLine = this.el.querySelector(".split-line");

      splitLine.style.top = null;
      splitLine.style.left = null;

      const way = this.el.hasAttribute("splittable-v")
        ? "vertical"
        : "horizontal";
      const insertNewAfter = this.areas.splitInsert === "after";

      const { offsetX, offsetY } = e;
      let percentage = null;
      if (way === "vertical") {
        percentage = Math.floor(
          (100 * offsetY) / this.el.getBoundingClientRect().height
        );
      } else {
        percentage = Math.floor(
          (100 * offsetX) / this.el.getBoundingClientRect().width
        );
      }

      this.root.splitZone(zoneId, way, percentage, insertNewAfter);
    } else if (this.el.hasAttribute("deletable")) {
      this.root.deleteZone(zoneId);
    }
  }

  /**
   * @param { MouseEvent } e
   */
  onMouseMove(e) {
    if (
      this.el.hasAttribute("splittable-v") ||
      this.el.hasAttribute("splittable-h")
    ) {
      const splitLine = this.el.querySelector(".split-line");

      const { width, height } = splitLine.getBoundingClientRect();

      splitLine.style.top = null;
      splitLine.style.left = null;

      const { offsetX, offsetY } = e;
      if (this.el.hasAttribute("splittable-v")) {
        splitLine.style.top = `${offsetY - height / 2}px`;
      }

      if (this.el.hasAttribute("splittable-h")) {
        splitLine.style.left = `${offsetX - width / 2}px`;
      }
    }
  }
}
