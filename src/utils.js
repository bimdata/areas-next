function clamp(value, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max);
}

export { clamp }