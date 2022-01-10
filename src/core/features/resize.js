/**
 * @param { Areas.Core } core
 *
 * @returns { Function }
 */
function makeResizeFeature(core) {
  /**
   * @param { Areas.Container } container
   * @param { Areas.ContainerChild } child
   * @param { number } value
   *
   * @returns { boolean }
   */
  const resize = (containerChild, value) => {
    if (typeof value !== "number") {
      throw new TypeError("AREAS CORE - resize value must be a number.");
    }

    const container = core.getParent(containerChild);

    const childIndex = container.children.findIndex(
      child => child === containerChild
    );
    if (childIndex === -1) {
      return false;
    }
    const nextChild = container.children[childIndex + 1];

    if (nextChild) {
      const totalRatio = containerChild.ratio + nextChild.ratio;
      let newRatio = containerChild.ratio + value;
      newRatio = newRatio < 0 ? 0 : newRatio;
      newRatio = newRatio > totalRatio ? totalRatio : newRatio;
      containerChild.ratio = newRatio;
      nextChild.ratio = totalRatio - newRatio;

      return true;
    } else {
      return false;
    }
  };

  return resize;
}

export default makeResizeFeature;
