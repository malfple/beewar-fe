import * as PIXI from 'pixi.js'

// used to dim units that has moved/attacked
const dimFilter = new PIXI.filters.ColorMatrixFilter()
const {matrix} = dimFilter
matrix[0] = 0.5
matrix[6] = 0.5
matrix[12] = 0.5

export {
  dimFilter,
}
