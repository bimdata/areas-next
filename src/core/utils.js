function makeRecursiveIterator(obj) {
  if (obj.children?.length) {
    obj.children.forEach(child => {
      Object.defineProperty(child, Symbol.iterator, {
        value: makeRecursiveIterator(child),
      });
    });
  }
  return function* () {
    yield obj;
    if (obj.children?.length) {
      for (let child of obj.children) {
        yield* child;
      }
    }
  };
}

/**
 * Add the ability to iterate over the given object. The object itself is yield first and then all its children.
 * @param {Object} obj
 * @returns The given object over witch it is now possible to iterate.
 */
function makeObjectIterable(obj) {
  Object.defineProperty(obj, Symbol.iterator, {
    value: makeRecursiveIterator(obj),
  });

  return obj;
}

function makeIdManager() {
  let currentId = 1;
  const ids = new Set();

  const idManager = {
    nextId() {
      while (!this.isIdAvailable(currentId)) {
        currentId++;
      }
      ids.add(currentId);
      return currentId;
    },
    isIdAvailable(id) {
      return !ids.has(id);
    },
    add(id) {
      if (!this.isIdAvailable(id)) {
        return false;
      } else {
        ids.add(id);
        return id;
      }
    },
  };

  return idManager;
}

export { makeObjectIterable, makeIdManager };
