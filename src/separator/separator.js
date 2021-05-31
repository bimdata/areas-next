const GRABBER_MARGIN = 4;

export default class Separator {
  /**
   * @this { Areas.Separator }
   */
  constructor(container, zIndex = 1001) {
    this.container = container;
    this.el = document.createElement("div");
    this.el.classList.add("separator");
    this.el.style.zIndex = zIndex;

    const grabber = document.createElement("div");
    grabber.classList.add("grabber");

    const direction = container.direction;

    if (direction === "column") {
      grabber.style.width = "100%";
      grabber.style.height = `calc(100% + ${GRABBER_MARGIN * 2}px)`;
      grabber.style.transform = `translateY(-${GRABBER_MARGIN}px)`;
    } else {
      grabber.style.width = `calc(100% + ${GRABBER_MARGIN * 2}px)`;
      grabber.style.height = "100%";
      grabber.style.transform = `translateX(-${GRABBER_MARGIN}px)`;
    }

    this.el.appendChild(grabber);

    grabber.addEventListener("mousedown", e => this.onMouseDown(e));

    if (container.direction === "column") {
      this.el.style.height = `${container.root.separatorSize}px`;
      if (!container.root.locked) {
        grabber.style.cursor = "ns-resize";
      }
    } else {
      this.el.style.width = `${container.root.separatorSize}px`;
      if (!container.root.locked) {
        grabber.style.cursor = "ew-resize";
      }
    }
  }

  /**
   * @param { MouseEvent } mouseDownEvent
   */
  onMouseDown(mouseDownEvent) {
    mouseDownEvent.preventDefault();
    mouseDownEvent.stopPropagation();

    document.addEventListener(
      "mousemove",
      (this.mouseMoveListener = mouseMoveEvent => this.drag(mouseMoveEvent))
    );

    document.addEventListener("mouseup", () => this.stopDrag(), { once: true });
  }

  /**
   * @param { MouseEvent } event
   */
  drag(event) {
    this.container.onSeparatorMove(this, event);
  }

  stopDrag() {
    document.removeEventListener("mousemove", this.mouseMoveListener);
  }
}
