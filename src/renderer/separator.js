/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 */
function renderSeparator(renderer, container, index) {
  const cursor = container.direction === "column" ? "ns-resize" : "ew-resize";
  const options = {
    ref: `separator-${container.id}-${index + 1}`,
    class: "areas-separator",
    style: {
      [container.direction === "column"
        ? "height"
        : "width"]: `${renderer.separatorSize}px`,
      cursor,
      backgroundColor: "var(--areas-separator-color, black)",
      flexShrink: 0,
    },
    onMousedown: e => onMouseDown(renderer, container, index, e, cursor),
  };

  return renderer.vue.h("div", options);
}

function onMouseDown(renderer, container, index, mouseEvent, cursor) {
  mouseEvent.preventDefault();
  mouseEvent.stopPropagation();

  document.body.style.cursor = cursor;

  const mousemoveFunc = e => drag(renderer, container, index, e);
  const mouseupFunc = () => stopDrag(mousemoveFunc, mouseupFunc);

  document.addEventListener("mousemove", mousemoveFunc);
  document.addEventListener("mouseup", mouseupFunc);
}

/**
 *
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 * @param { number } index
 * @param { MouseEvent} e
 */
function drag(renderer, container, index, e) {
  const containerChild = container.children[index];

  const dimension = container.direction === "column" ? "height" : "width";

  const separatorElement =
    renderer.root.$refs[`separator-${container.id}-${index + 1}`];

  const separatorRect = separatorElement.getBoundingClientRect();
  const separatorSize = separatorRect[dimension];

  const deltaSize =
    (container.direction === "column"
      ? e.clientY - separatorRect.y
      : e.clientX - separatorRect.x) -
    separatorSize / 2;

  const containerSize = renderer.root.$refs[
    `container-${container.id}`
  ].getBoundingClientRect()[dimension];

  const deltaPercentage = (deltaSize / containerSize) * 100;

  renderer.resize(containerChild, deltaPercentage);
}

function stopDrag(mousemoveFunc, mouseupFunc) {
  document.removeEventListener("mousemove", mousemoveFunc);
  document.removeEventListener("mouseup", mouseupFunc);

  document.body.style.cursor = "";
}

export default renderSeparator;
