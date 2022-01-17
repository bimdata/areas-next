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

/**
 * Copy an object and all its children.
 * @param { { children?: Array } } object
 * @returns { { children?: Array } }
 */
function deepCopy(object) {
  if (!object) {
    return;
  }

  const newObject = Object.assign({}, object);

  if (object.children?.length > 0) {
    newObject.children = object.children.map(deepCopy);
  }

  return newObject;
}

export { makeObjectIterable, makeIdManager, deepCopy };
