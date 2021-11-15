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

  let mousemoveFunc = e => drag(renderer, container, index, e);
  let mouseupFunc = () => stopDrag(mousemoveFunc, mouseupFunc);

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

  /**
   * @type { Element }
   */
  const dimension = container.direction === "column" ? "height" : "width";

  const separatorElement =
    renderer.root.$refs[`separator-${container.id}-${index + 1}`];

  const separatorSize = separatorElement.getBoundingClientRect()[dimension];

  const containerChildRect = separatorElement.previousElementSibling.getBoundingClientRect();
  const containerChildSize = containerChildRect[dimension];
  const nextContainerChildSize = separatorElement.nextElementSibling.getBoundingClientRect()[
    dimension
  ];

  const totalSize = separatorSize + containerChildSize + nextContainerChildSize;

  const requestedSize =
    container.direction === "column"
      ? e.clientY - containerChildRect.y
      : e.clientX - containerChildRect.x;

  const delta = requestedSize - containerChildSize;

  renderer.resize(containerChild, (delta / totalSize) * 100);
}

function stopDrag(mousemoveFunc, mouseupFunc) {
  document.removeEventListener("mousemove", mousemoveFunc);
  document.removeEventListener("mouseup", mouseupFunc);
}

export default renderSeparator;
