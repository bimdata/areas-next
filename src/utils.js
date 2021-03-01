function clamp(value, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max);
}

function sum(a, b) {
  return a + b;
}

export { clamp, sum }