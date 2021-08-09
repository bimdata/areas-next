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

export { deepCopy, makeLayoutIterable };
