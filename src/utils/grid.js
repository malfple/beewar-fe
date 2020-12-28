/**
 * calculates distance between two positions as if there are no obstacles
 * @param {int} y1
 * @param {int} x1
 * @param {int} y2
 * @param {int} x2
 * @return {int} dist
 */
function hexDistance(y1, x1, y2, x2) {
  const tx1 = x1 - (y1 + (y1 & 1)) / 2
  const tx2 = x2 - (y2 + (y2 & 1)) / 2
  const z1 = -tx1 - y1
  const z2 = -tx2 - y2
  return (Math.abs(tx1-tx2) + Math.abs(y1-y2) + Math.abs(z1-z2)) / 2
}

export {
  hexDistance,
}
