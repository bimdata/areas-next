import { clamp } from "../../utils.js";

/**
 *
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 * @returns { { width: number, height: number } }
 */
function getContainerDimensions(renderer, container) {
  const parentContainer = renderer.getParent(container);
  if (parentContainer) {
    const { width: parentWidth, height: parentHeight } = getContainerDimensions(
      renderer,
      parentContainer
    );
    const separatorCount = parentContainer.children.length - 1;
    if (parentContainer.direction === "column") {
      return {
        width: parentWidth,
        height: Math.max(
          0,
          (parentHeight - separatorCount * renderer.separatorSize) *
            (container.ratio / 100)
        ),
      };
    } else {
      return {
        width: Math.max(
          0,
          (parentWidth - separatorCount * renderer.separatorSize) *
            (container.ratio / 100)
        ),
        height: parentHeight,
      };
    }
  } else {
    return {
      width: renderer.width,
      height: renderer.height,
    };
  }
}

function getContainerChildStyleSizes(renderer, container, containerChild) {
  const {
    width: containerWidth,
    height: containerHeight,
  } = renderer.getContainerDimensions(container);

  const separatorCount = container.children.length - 1;

  if (container.direction === "column") {
    const separatorLessRatio =
      1 - (separatorCount * renderer.separatorSize) / containerHeight;

    return {
      height: `${clamp(containerChild.ratio * separatorLessRatio, 0, 100)}%`,
      width: "100%",
    };
  } else {
    const separatorLessRatio =
      1 - (separatorCount * renderer.separatorSize) / containerWidth;

    return {
      height: "100%",
      width: `${clamp(containerChild.ratio * separatorLessRatio, 0, 100)}%`,
    };
  }
}

export { getContainerDimensions, getContainerChildStyleSizes };
