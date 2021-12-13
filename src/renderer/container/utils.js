/**
 *
 * @param { Areas.Renderer } renderer
 * @param { Areas.Container } container
 * @returns { {width: number, height: number } }
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
        height:
          (parentHeight - separatorCount * renderer.separatorSize) *
          (container.ratio / 100),
      };
    } else {
      return {
        width:
          (parentWidth - separatorCount * renderer.separatorSize) *
          (container.ratio / 100),
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

export { getContainerDimensions };
