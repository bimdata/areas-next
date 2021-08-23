function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function makeLayoutIterable(layout) {
  const makeRecursiveIterator = obj => {
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
  };

  Object.defineProperty(layout, Symbol.iterator, {
    value: makeRecursiveIterator(layout),
  });

  return layout;
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

export { deepCopy, makeLayoutIterable, makeIdManager };
