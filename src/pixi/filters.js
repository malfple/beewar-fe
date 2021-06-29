import * as PIXI from 'pixi.js'

// used to dim units that has moved/attacked
const dimFilter = new PIXI.filters.ColorMatrixFilter()
const {matrix} = dimFilter
matrix[0] = 0.4
matrix[6] = 0.4
matrix[12] = 0.4

export {
  dimFilter,
}
