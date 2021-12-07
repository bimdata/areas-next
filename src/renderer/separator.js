import { h } from "vue";

const separatorSize = 3;

/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 */
function renderSeparator(renderer, container, index) {
  return h("div", {
    ref: `separator-${container.id}-${index + 1}`,
    style: {
      [container.direction === "column"
        ? "height"
        : "width"]: `${separatorSize}px`,
      cursor: container.direction === "column" ? "ns-resize" : "ew-resize",
      backgroundColor: "grey", // TODO developmenent only
    },
    onMousedown: e => onMouseDown(renderer, container, index, e),
  });
}

function onMouseDown(renderer, container, index, mouseEvent) {
  mouseEvent.preventDefault();
  mouseEvent.stopPropagation();

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
}

export default renderSeparator;
