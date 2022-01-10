function clamp(value = 1, min = 0, max = 100) {
  return Math.min(Math.max(min, value), max);
}

export { clamp };
