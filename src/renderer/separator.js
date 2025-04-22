/**
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 */
function renderSeparator(renderer, container, index) {
  const {
    separatorSize,
    separatorDetectionMargin,
    separatorDetectionZIndex,
  } = renderer;

  const isColumn = container.direction === "column";

  const options = {
    ref: `separator-${container.id}-${index + 1}`,
    class: "areas-separator",
    style: {
      [isColumn ? "height" : "width"]: `${separatorSize}px`,
      backgroundColor: "var(--areas-separator-color, black)",
      flexShrink: 0,
      position: "relative",
    },
  };

  const cursor = isColumn ? "ns-resize" : "ew-resize";

  const detectionElement = renderer.vue.h("div", {
    // detection margin
    style: {
      position: "absolute",
      [isColumn ? "height" : "width"]: `${separatorDetectionMargin * 2}px`,
      [isColumn ? "width" : "height"]: "100%",
      [isColumn ? "top" : "left"]: `${
        -separatorDetectionMargin + separatorSize / 2
      }px`,
      zIndex: separatorDetectionZIndex,
      cursor,
    },
    onPointerdown: e => onPointerDown(renderer, container, index, e, cursor),
  });

  return renderer.vue.h(
    "div",
    options,
    renderer.resizable ? [detectionElement] : null
  );
}

function onPointerDown(renderer, container, index, pointerEvent) {
  pointerEvent.preventDefault();
  pointerEvent.stopPropagation();

  const separatorElement = pointerEvent.currentTarget;

  separatorElement.setPointerCapture(pointerEvent.pointerId);

  const pointerMoveFunc = e => drag(renderer, container, index, e);
  const pointerUpFunc = () => {
    separatorElement.removeEventListener("pointermove", pointerMoveFunc);
  };

  separatorElement.addEventListener("pointermove", pointerMoveFunc);
  separatorElement.addEventListener("pointerup", pointerUpFunc, {
    once: true,
  });
}

/**
 *
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 * @param { number } index
 * @param { PointerEvent } e
 */
function drag(renderer, container, index, e) {
  const containerChild = container.children[index];

  const dimension = container.direction === "column" ? "height" : "width";

  const { separatorDetectionMargin } = renderer;

  const deltaSize =
    (container.direction === "column" ? e.offsetY : e.offsetX) -
    separatorDetectionMargin;

  const containerSize = renderer.root.$refs[
    `container-${container.id}`
  ].getBoundingClientRect()[dimension];

  const deltaPercentage = (deltaSize / containerSize) * 100;

  renderer.resize(containerChild, deltaPercentage);
}

export default renderSeparator;
