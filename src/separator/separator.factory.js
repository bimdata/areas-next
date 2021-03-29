/**
 * @param { AreasContainer } container
 *
 * @returns { AreasSeparatorFactory }
 */
function makeSeparatorFactory(container) {
  return {
    make() {
      const separator = document.createElement("areas-separator");
      separator.style.zIndex = 1001; // TODO may be configuratble.

      separator.setAttribute("direction", this.direction);
      if (container.direction === "column") {
        separator.style.height = `${container.root.separatorSize}px`;
        if (!container.root.locked) {
          separator.style.cursor = "ns-resize";
        }
      } else {
        separator.style.width = `${container.root.separatorSize}px`;
        if (!container.root.locked) {
          separator.style.cursor = "ew-resize";
        }
      }
      separator.addEventListener("move", e => container.onSeparatorMove(e));

      return separator;
    },
  };
}

export default makeSeparatorFactory;
